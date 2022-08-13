const src_img = document.body.querySelector("#currentImg");
let output_canvas = document.body.querySelector("#render-canvas");
let output_canvas_ctx = output_canvas.getContext("2d");

const crop_preview = document.body.querySelector("#crop-preview");

let cropper = new Cropper(src_img, {
    viewMode: 3,
    autoCrop: true,
    // dragMode: move,
    preview: crop_preview,
    guides: false,
    highlight: false,
    background: false,
    rotatable: false
});

src_img.addEventListener("crop", () => {
    const crop_box_data = cropper.getCropBoxData();
    const new_canvas = cropper.getCroppedCanvas({
        //minWidth: output_canvas.width,
        //minHeight: output_canvas.height
        // maxWidth: output_canvas.width,
        // maxHeight: output_canvas.height
        width: crop_box_data.width,
        height: crop_box_data.height
    });
    // crop_preview.style.width = new_canvas.width;
    // crop_preview.style.height = new_canvas.height;
    output_canvas.width = new_canvas.width;
    output_canvas.height = new_canvas.height;
    output_canvas_ctx.drawImage(new_canvas, 0, 0);
});

src_img.addEventListener("cropend", () => {
    // console.log(cropper.getData());
    // console.log(cropper.getImageData());
    // console.log(cropper.getCanvasData());
    console.log(cropper.getCropBoxData());
    console.log("crop done");
})

