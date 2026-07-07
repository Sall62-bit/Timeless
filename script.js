const video = document.getElementById("webcam");
const canvas = document.getElementById("output_canvas");
const ctx = canvas.getContext("2d");

const photoContainer = document.getElementById("photoContainer");
const flash = document.getElementById("flash");
const blurLayer = document.getElementById("blurLayer");
const statusText = document.getElementById("status");

let activated = false;

// =============================
// AKTIFKAN KAMERA
// =============================

async function startCamera() {

    try{

        const stream = await navigator.mediaDevices.getUserMedia({
            video:{
                facingMode:"user"
            },
            audio:false
        });

        video.srcObject = stream;

    }catch(e){

        alert("Tidak dapat mengakses kamera.");

        console.log(e);

    }

}

startCamera();

// =============================
// RESIZE CANVAS
// =============================

video.addEventListener("loadeddata",()=>{

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    draw();

});

// =============================
// TAMPILKAN VIDEO
// =============================

function draw(){

    ctx.save();

    ctx.scale(-1,1);

    ctx.drawImage(
        video,
        -canvas.width,
        0,
        canvas.width,
        canvas.height
    );

    ctx.restore();

    requestAnimationFrame(draw);

}

// =============================
// ANIMASI FOTO
// =============================

function showPhoto(){

    if(activated) return;

    activated = true;

    statusText.innerHTML = "Foto berhasil ditampilkan ❤️";

    blurLayer.classList.add("active");

    flash.classList.add("active");

    photoContainer.classList.add("show");

    setTimeout(()=>{

        flash.classList.remove("active");

    },500);

}

// =============================
// RESET
// =============================

function resetPhoto(){

    activated = false;

    statusText.innerHTML = "Arahkan tangan ✌️ ke kamera";

    blurLayer.classList.remove("active");

    photoContainer.classList.remove("show");

}

// =============================
// DEMO
// Space = tampil
// R = reset
// =============================

window.addEventListener("keydown",(e)=>{

    if(e.code==="Space"){

        showPhoto();

    }

    if(e.key==="r" || e.key==="R"){

        resetPhoto();

    }

});
