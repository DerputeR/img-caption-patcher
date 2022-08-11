"use strict";

// import './node_modules/html2canvas/dist/html2canvas.min.js';
// import './node_modules/html2canvas/dist/html2canvas.js';

const prerender_container = document.body.querySelector("#prerender-container");
const prerender_div = prerender_container.querySelector("#prerender-div");
const render_canvas = document.body.querySelector("#render-canvas");
const render_canvas_ctx = render_canvas.getContext("2d");

const io = document.body.querySelector("#io");
const b_debug_render = io.querySelector("#b_debug_render")

b_debug_render.addEventListener("click", render);

let last_width = prerender_div.offsetWidth;
let last_height = prerender_div.offsetHeight;

function render() {
    // briefly show element for render
    prerender_container.style.display = "block";
    // prerender_container.style.opacity = "0";

    // set appropriate dimensions
    let c_width = prerender_div.offsetWidth;
    let c_height = prerender_div.offsetHeight;
    console.log(`${c_width} x ${c_height}`);

    // update the canvas size
    if (last_width !== c_width || last_height !== c_height) {
        console.log("resizing canvas")
        render_canvas.width = c_width;
        render_canvas.height = c_height;
        last_width = c_width;
        last_height = c_height;
    } else {
        render_canvas_ctx.clearRect(0, 0, render_canvas.width, render_canvas.height);
    }

    html2canvas(prerender_div, {
        canvas: render_canvas,
        scale: 1
    }).then(function (canvas) {
        // reset the transform for further rendering
        render_canvas_ctx.setTransform(1,0,0,1,0,0)

        // hide composite div when done
        // prerender_container.style.display = "none";
    }); 
}


