"use strict";

// import '../node_modules/html2canvas/dist/html2canvas.min.js';
// import '../node_modules/html2canvas/dist/html2canvas.js';

/// Editor
const editor = document.body.querySelector("#editor");
const editor_image = editor.querySelector("#editor-image");
const editor_frame_wrap = editor_image.querySelector("#frame-wrap");
const editor_frame = editor_image.querySelector(".frame");

const zoom = editor.querySelector("#zoom");
const zoom_slider = zoom.querySelector("#zoom-slider");
const zoom_number = zoom.querySelector("#zoom-num");
const b_zoom_fit = zoom.querySelector("#zoom-fit");
const debug_anchor = editor.querySelector(".anchor");
let zoom_percentage = 100;

/// Render preview
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




// 0 = slider moved, 1 = number changed, 2 = scroll-wheeled, 3 = force zoom
// positive scroll_count for scroll up, negative for scroll down
function updateZoom(mode = 0, scroll_count = 0, anchor_x = 0, anchor_y = 0, zoom_override = 100) {
    let last_zoom = zoom_percentage;
    mode = mode % 4;
    switch (mode) {
        case 0:
            console.log("zoom slider updated");
            zoom_percentage = zoom_slider.value;
            zoom_number.value = zoom_percentage;
            break;
        case 1:
            console.log("zoom number field updated");
            zoom_percentage = zoom_number.value;
            zoom_slider.value = zoom_percentage;
            break;
        case 2:
            console.log("zoomed via scrollwheel");
            zoom_percentage += scroll_count;
            zoom_slider.number = zoom_percentage;
            zoom_slider.value = zoom_percentage;
            break;
        case 3:
            console.log("zoom via direct command");
            zoom_percentage = zoom_override;
            zoom_number.value = zoom_percentage;
            zoom_slider.value = zoom_percentage;
            break;
        default:
            zoom_percentage = 100;
            break;
    
    }

    // since origin (0,0) is at top-left, we must do something like this:
    // image coords and viewport coordinates are different
    // we must convert viewport coordinates to image coordinates,
    // apply the scaling to this coordinates, then determine the change in these coordinates
    // WE WILL NOT CONVERT BACK TO VIEWPORT COORDINATES since we do not need them to find the change in position of the anchor point after scaling

    let originX = -editor_image.scrollLeft;
    let originY = -editor_image.scrollTop;
    console.log(anchor_x);

    //! This isn't working. Debug; if cannot figure this out, resort to
    //! doing one-way scales, but doing (zoom_percentage - last_zoom) + 100 as the scale parameter
    // undo previous translate and scaling
    // let undoDeltas = getDeltaToMoveScaleAboutAnchor(anchor_x, anchor_y, originX, originY, (100 / last_zoom) * 100);

    // let unscaledAnchorX = anchor_x + undoDeltas[0];
    // let unscaledAnchorY = anchor_y + undoDeltas[1];
    // let unscaledOriginX = originX + undoDeltas[0];
    // let unscaledOriginY = originY + undoDeltas[1];
    // console.log(unscaledAnchorX);

    // // apply new scaling
    // let newDeltas = getDeltaToMoveScaleAboutAnchor(unscaledAnchorX, unscaledAnchorY, unscaledOriginX, unscaledOriginY, zoom_percentage);

    // // translate
    // let movedAnchorX = unscaledAnchorX + newDeltas[0];
    // let movedAnchorY = unscaledAnchorY + newDeltas[1];
    // console.log(movedAnchorX);

    // // Compute the total delta
    // let dx = movedAnchorX - anchor_x;
    // let dy = movedAnchorY - anchor_y;
    // console.log(dx);

    //! WHY DOESN'T THIS WORK??? IS MY ORIGIN WRONG???
    let scaleBy = (zoom_percentage - last_zoom) + 100;
    let deltas = getDeltaToMoveScaleAboutAnchor(anchor_x, anchor_y, originX, originY, scaleBy);
    let dx = deltas[0];
    let dy = deltas[1];
    
    editor_frame.style.transform = `scale(${zoom_percentage}%)`;
    editor_frame_wrap.style.width = `${editor_frame.scrollWidth * (zoom_percentage / 100)}px`;
    editor_frame_wrap.style.height = `${editor_frame.scrollHeight * (zoom_percentage / 100)}px`;


    if (editor_image.scrollWidth > editor_image.clientWidth) {
        editor_image.scrollLeft += dx;
    }
    if (editor_image.scrollHeight > editor_image.clientHeight) {
        editor_image.scrollTop += dy;
    }
}

zoom_slider.addEventListener("input", (event) => {
    // updateZoom(0, undefined, (editor_image.clientWidth / 2), (editor_image.clientHeight / 2));
    updateZoom(0, undefined, 0, 0);
});
zoom_number.addEventListener("change", (event) => {
    updateZoom(1, undefined, editor_image.offsetWidth / 2, editor_image.offsetHeight / 2);
});

b_zoom_fit.addEventListener("click", (event) => {
    let x_percent = editor_image.clientWidth / editor_frame.scrollWidth;
    let y_percent = editor_image.clientHeight / editor_frame.scrollHeight;
    let fit = Math.min(x_percent, y_percent) * 100;
    console.log(`fitting at ${fit}%`);
    updateZoom(3, undefined, 0, 0, fit);
})

// page load stuff
debug_anchor.style.width = `${editor_image.clientWidth}px`;
debug_anchor.style.height = `${editor_image.clientHeight}px`;

updateZoom(0);

//* scaleByPercent: 100 = 100%
// based on my thing here: https://www.desmos.com/calculator/0xtrac7und
function getDeltaToMoveScaleAboutAnchor(anchorX, anchorY, scaleOriginX, scaleOriginY, scaleByPercent) {
    let scaledAtOriginX = (scaleByPercent * .01) * (anchorX - scaleOriginX) + scaleOriginX;
    let scaledAtOriginY = (scaleByPercent * .01) * (anchorY - scaleOriginY) + scaleOriginY;

    let deltaX = scaledAtOriginX - anchorX;
    let deltaY = scaledAtOriginY - anchorY;

    return [deltaX, deltaY];
}