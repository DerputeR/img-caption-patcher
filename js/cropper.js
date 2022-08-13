const src_img = document.body.querySelector("#currentImg");
let output_canvas = document.body.querySelector("#render-canvas");
let output_canvas_ctx = output_canvas.getContext("2d");

let cropper = new Cropper(src_img, {
    viewMode: 3,
    // autoCrop: true,
    dragMode: "move",
    guides: false,
    highlight: false,
    background: false,
    rotatable: false,
    ready() {
        src_img.addEventListener("cropend", () => {
            const crop_box_data = cropper.getCropBoxData();
            const new_canvas = cropper.getCroppedCanvas({
                width: crop_box_data.width,
                height: crop_box_data.height
            });
            output_canvas.width = new_canvas.width;
            output_canvas.height = new_canvas.height;
            output_canvas_ctx.drawImage(new_canvas, 0, 0);
        });
        this.cropper.move(100, 0);
    }
});



document.addEventListener("click", function(e) {
    console.log(e.target); 
}, false);