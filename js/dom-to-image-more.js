"use strict";

// import "../node_modules/dom-to-image-more/src/dom-to-image-more.js";
// import "../node_modules/dom-to-image-more/dist/dom-to-image-more.min.js";

const io = document.body.querySelector("#io");
const b_render = io.querySelector("#b_render"); 
const render_url_element = io.querySelector("#render_url");
let render_url = ""; 
const render_region = document.body.querySelector("#prerender-div");

b_render.addEventListener("click", render);

function render() {
    console.log("rendering");
    domtoimage.toPng(render_region).then(function (dataUrl) {
        let img = new Image();
        img.src = dataUrl;
        document.body.appendChild(img);
    })
}