const stripCanvas = document.getElementById('strip-canvas');
const stripCtx = stripCanvas.getContext('2d');
const stripPreview = document.getElementById('photo-strip-preview');

function generateStrip() {
  const photos = appState.capturedPhotos;
  if (photos.length === 0) return;
  
  // Define layout
  const padding = 40;
  const spacing = 20;
  const photoWidth = 600;
  const photoHeight = 450; // 4:3 aspect ratio
  
  const bottomTextSpace = 120;
  
  stripCanvas.width = photoWidth + (padding * 2);
  stripCanvas.height = (padding * 2) + (photos.length * photoHeight) + ((photos.length - 1) * spacing) + bottomTextSpace;
  
  // Draw background
  stripCtx.fillStyle = '#FDFBF7';
  stripCtx.fillRect(0, 0, stripCanvas.width, stripCanvas.height);
  
  // Draw photos sequentially
  let loadedCount = 0;
  const imgObjects = [];
  
  photos.forEach((dataUrl, i) => {
    const img = new Image();
    imgObjects.push(img);
    
    img.onload = () => {
      const yOffset = padding + (i * photoHeight) + (i * spacing);
      stripCtx.drawImage(img, padding, yOffset, photoWidth, photoHeight);
      
      // Draw inner border/shadow for vintage feel
      stripCtx.strokeStyle = 'rgba(0,0,0,0.1)';
      stripCtx.lineWidth = 1;
      stripCtx.strokeRect(padding, yOffset, photoWidth, photoHeight);
      
      loadedCount++;
      if (loadedCount === photos.length) {
        finalizeStripDrawing();
      }
    };
    img.src = dataUrl;
  });
}

function finalizeStripDrawing() {
  // Draw text at the bottom
  const textY = stripCanvas.height - 50;
  
  stripCtx.fillStyle = '#0A0A0A';
  stripCtx.font = '700 40px "Playfair Display", serif';
  stripCtx.textAlign = 'center';
  
  const caption = appState.customText || "Analog Photobooth";
  stripCtx.fillText(caption, stripCanvas.width / 2, textY);
  
  // Show preview
  stripPreview.style.display = 'block';
  
  // Slide up animation using GSAP
  gsap.fromTo(stripPreview, 
    { y: 200, opacity: 0, rotation: -2 },
    { y: 0, opacity: 1, rotation: 0, duration: 0.8, ease: "power3.out" }
  );
}

function triggerDownload() {
  const link = document.createElement('a');
  link.download = `photobooth-strip-${Date.now()}.png`;
  link.href = stripCanvas.toDataURL('image/png');
  link.click();
  
  // Safety rule: clear drafts after successful download
  localStorage.removeItem('photobooth_draft_session');
}
