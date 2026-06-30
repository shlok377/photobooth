let videoStream = null;
let captureCanvas = document.createElement('canvas');

async function initCamera(videoElement) {
  try {
    const constraints = {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 960 },
        facingMode: "user"
      },
      audio: false
    };
    videoStream = await navigator.mediaDevices.getUserMedia(constraints);
    videoElement.srcObject = videoStream;
    
    // Wait until video metadata is loaded to ensure dimensions are correct
    return new Promise((resolve) => {
      videoElement.onloadedmetadata = () => {
        resolve();
      };
    });
  } catch (err) {
    console.error("Camera error:", err);
    throw err;
  }
}

function takeSnapshot() {
  if (!els.video) return null;
  
  // Set internal canvas dimensions to match video
  captureCanvas.width = els.video.videoWidth;
  captureCanvas.height = els.video.videoHeight;
  
  const ctx = captureCanvas.getContext('2d');
  
  // We need to mirror the canvas drawing since the video is mirrored via CSS
  ctx.translate(captureCanvas.width, 0);
  ctx.scale(-1, 1);
  
  ctx.drawImage(els.video, 0, 0, captureCanvas.width, captureCanvas.height);
  
  // Return base64 png
  return captureCanvas.toDataURL('image/png');
}

function pauseVideo() {
  els.video.pause();
}

function resumeVideo() {
  els.video.play();
}
