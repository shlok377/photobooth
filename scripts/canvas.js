const stripCanvas = document.getElementById('strip-canvas');
const stripCtx = stripCanvas.getContext('2d');
const stripPreview = document.getElementById('photo-strip-preview');

function generateStrip() {
  const photos = appState.capturedPhotos;
  if (photos.length === 0) return;
  
  // Define layout
  const padding = 80;
  const spacing = 40;
  const photoWidth = 1200;
  const photoHeight = 900; // 4:3 aspect ratio
  
  const bottomTextSpace = 240;
  const cols = appState.columns;
  const rows = Math.ceil(photos.length / cols);
  
  stripCanvas.width = (photoWidth * cols) + (spacing * (cols - 1)) + (padding * 2);
  stripCanvas.height = (padding * 2) + (rows * photoHeight) + ((rows - 1) * spacing) + bottomTextSpace;
  
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
      const colIndex = i % appState.columns;
      const rowIndex = Math.floor(i / appState.columns);
      const xOffset = padding + (colIndex * photoWidth) + (colIndex * spacing);
      const yOffset = padding + (rowIndex * photoHeight) + (rowIndex * spacing);
      
      stripCtx.drawImage(img, xOffset, yOffset, photoWidth, photoHeight);
      
      // Draw inner border/shadow for vintage feel
      stripCtx.strokeStyle = 'rgba(0,0,0,0.1)';
      stripCtx.lineWidth = 1;
      stripCtx.strokeRect(xOffset, yOffset, photoWidth, photoHeight);
      
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
  const textY = stripCanvas.height - 100;
  
  stripCtx.fillStyle = '#0A0A0A';
  stripCtx.font = '700 80px "Playfair Display", serif';
  stripCtx.textAlign = 'center';
  
  const caption = appState.customText || "Analog Photobooth";
  stripCtx.fillText(caption, stripCanvas.width / 2, textY);
  
  // Show preview
  stripPreview.style.display = 'block';
  
  // Slide up animation using GSAP
  gsap.fromTo(stripPreview, 
    { y: 200, opacity: 0, rotation: -4, scale: 0.9 },
    { y: 0, opacity: 1, rotation: 0, scale: 1, duration: 1, ease: "elastic.out(1, 0.7)" }
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
