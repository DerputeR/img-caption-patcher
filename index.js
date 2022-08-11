"use strict";

// import './node_modules/html2canvas/dist/html2canvas.min.js';
import './node_modules/html2canvas/dist/html2canvas.js';

html2canvas(document.body).then(function(canvas) {
    document.body.appendChild(canvas);
});