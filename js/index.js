"use strict";

// import '../node_modules/html2canvas/dist/html2canvas.min.js';
// import '../node_modules/html2canvas/dist/html2canvas.js';

const prerender_container = document.body.querySelector("#prerender-container");
const prerender_div = prerender_container.querySelector("#prerender-div");
const render_canvas = document.body.querySelector("#render-canvas");
const render_canvas_ctx = render_canvas.getContext("2d");

const io = document.body.querySelector("#io");
const b_debug_render = io.querySelector("#b_debug_render");
const debug_render_url = io.querySelector("#debug_render_url");
let render_url = "";
let file_name = "lineup.png";

const export_anchor = io.querySelector("#download_export");
const b_export = io.querySelector("#b_export");

const preview_height = 300;

function render(renderable_node=prerender_div) {
    return new Promise((resolve, reject) => {
        if (renderable_node === prerender_div) {
            // briefly show element for render
            prerender_container.style.display = "block";
        }
        // prerender_container.style.opacity = "0";

        // set appropriate dimensions
        // let c_width = prerender_div.offsetWidth;
        // let c_height = prerender_div.offsetHeight;
        let c_width =  prerender_div.scrollWidth;
        let c_height = prerender_div.scrollHeight;
        console.log(`${c_width} x ${c_height}`);

        // clear canvas and update size
        let dpi = window.devicePixelRatio;
        dpi = 1; // hard lock scaling to preserve original resolution
        render_canvas_ctx.clearRect(0, 0, render_canvas.width, render_canvas.height);
        render_canvas.width = c_width * dpi;
        render_canvas.height = c_height * dpi;
        render_canvas.style.width = c_width * (preview_height / c_height) + "px";
        render_canvas.style.height = preview_height + "px";
        render_canvas_ctx.imageSmoothing = false;

        html2canvas(prerender_div, {
            backgroundColor: null,
            canvas: render_canvas,
            scale: dpi,
            width: c_width,
            height: c_height
        }).then(function () {
            // hide composite div when done
            // prerender_container.style.display = "none";
            
            // reset the transform when done since html2canvas forgets about this
            render_canvas_ctx.setTransform(1, 0, 0, 1, 0, 0)
            
            // prepare the render for download
            const blob = render_canvas.toBlob((blob) => {
                URL.revokeObjectURL(render_url);
                render_url = URL.createObjectURL(blob);
                debug_render_url.value = render_url;
            });
            resolve();
        }); 
    });
}

function exportRender(url, file_name, export_anchor) {
    export_anchor.setAttribute("href", url);
    export_anchor.setAttribute("download", file_name);
    export_anchor.click();
}

b_debug_render.addEventListener("click", (event) => {
    render();
});
b_export.addEventListener("click", (event) => {
    if (!render_url) {
        const r = render();
        r.then(exportRender(render_url, file_name, export_anchor));
    } else {
        exportRender(render_url, file_name, export_anchor);
    }
});