"use strict";

// import './node_modules/html2canvas/dist/html2canvas.min.js';
// import './node_modules/html2canvas/dist/html2canvas.js';

const prerender_container = document.body.querySelector("#prerender-container");
const prerender_div = prerender_container.querySelector("#prerender-div");
const render_canvas = document.body.querySelector("#render-canvas");
const render_canvas_ctx = render_canvas.getContext("2d");

const io = document.body.querySelector("#io");
const b_debug_render = io.querySelector("#b_debug_render");
const debug_render_url = io.querySelector("#debug_render_url");
let render_url = "";

b_debug_render.addEventListener("click", render);

function render() {
    // briefly show element for render
    prerender_container.style.display = "block";
    // prerender_container.style.opacity = "0";

    // set appropriate dimensions
    let c_width = prerender_div.offsetWidth;
    let c_height = prerender_div.offsetHeight;
    console.log(`${c_width} x ${c_height}`);

    // clear canvas and update size
    render_canvas_ctx.clearRect(0, 0, render_canvas.width, render_canvas.height);
    render_canvas.width = c_width;
    render_canvas.height = c_height;

    html2canvas(prerender_div, {
        backgroundColor: null,
        canvas: render_canvas,
        scale: 1
    }).then(function() {
        // hide composite div when done
        // prerender_container.style.display = "none";
        
        // reset the transform when done since html2canvas forgets about this
        render_canvas_ctx.setTransform(1,0,0,1,0,0)
        
        // prepare the render for download
        const blob = render_canvas.toBlob((blob) => {
            URL.revokeObjectURL(render_url);
            render_url = URL.createObjectURL(blob);
            debug_render_url.value = render_url;
        });
    }); 
}


