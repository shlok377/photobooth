// State Management
const appState = {
  columns: 1,
  totalShots: 3,
  currentShotIndex: 0,
  capturedPhotos: [],
  customText: "",
  filter: "none",
  status: "idle" // idle, counting, review, done
};

// UI Elements
const els = {
  videoWrapper: document.querySelector('.video-wrapper'),
  video: document.getElementById('camera-feed'),
  skeleton: document.getElementById('camera-skeleton'),
  btnStart: document.getElementById('btn-start'),
  btnRetake: document.getElementById('btn-retake'),
  btnKeep: document.getElementById('btn-keep'),
  btnDownload: document.getElementById('btn-download'),
  btnRestart: document.getElementById('btn-restart'),
  controlsIdle: document.getElementById('controls-idle'),
  controlsReview: document.getElementById('controls-review'),
  controlsDone: document.getElementById('controls-done'),
  errorMsg: document.getElementById('error-message'),
  countdown: document.getElementById('countdown-display'),
  layoutRadios: document.querySelectorAll('input[name="layout"]'),
  filterDropdown: document.getElementById('filter-dropdown'),
  shots1Radios: document.querySelectorAll('input[name="shots1"]'),
  shots2Radios: document.querySelectorAll('input[name="shots2"]'),
  shots1Container: document.getElementById('shots-1col'),
  shots2Container: document.getElementById('shots-2col'),
  layoutPreview: document.getElementById('layout-preview'),
  timelineTray: document.getElementById('timeline-tray'),
  lightboxOverlay: document.getElementById('lightbox-overlay'),
  lightboxImg: document.getElementById('lightbox-img')
};

// Initialize App
async function initApp() {
  updatePreviewVisualizer();
  try {
    await initCamera(els.video);
    // Camera is ready
    els.skeleton.classList.add('hidden');
    els.video.classList.remove('hidden');
    els.btnStart.disabled = false;
  } catch (error) {
    showError("Camera access denied. Please enable camera permissions in your browser settings to start the photobooth.");
  }
}

function showError(msg) {
  els.errorMsg.textContent = msg;
  els.errorMsg.style.display = 'block';
  els.skeleton.classList.add('hidden');
}

function updateUI() {
  els.controlsIdle.classList.add('hidden');
  els.controlsReview.classList.add('hidden');
  els.controlsDone.classList.add('hidden');
  
  if (appState.status === 'idle') {
    els.controlsIdle.classList.remove('hidden');
    els.btnRestart.classList.add('hidden');
  } else {
    els.btnRestart.classList.remove('hidden');
    if (appState.status === 'review') {
      els.controlsReview.classList.remove('hidden');
    } else if (appState.status === 'done') {
      els.controlsDone.classList.remove('hidden');
    }
  }
}

// Event Listeners
els.btnStart.addEventListener('click', () => {
  appState.status = 'counting';
  updateUI();
  startSession();
});

els.btnRetake.addEventListener('click', () => {
  handleRetake();
});

els.btnKeep.addEventListener('click', () => {
  handleContinue();
});

els.btnDownload.addEventListener('click', () => {
  triggerDownload();
});

els.btnRestart.addEventListener('click', () => {
  resetSession();
});

// Config Event Listeners
els.layoutRadios.forEach(radio => {
  radio.addEventListener('change', (e) => {
    appState.columns = parseInt(e.target.value);
    if (appState.columns === 1) {
      els.shots1Container.classList.remove('hide-stack');
      els.shots2Container.classList.add('hide-stack');
      
      // Update state to match selected 1-col option
      const selected = document.querySelector('input[name="shots1"]:checked').value;
      appState.totalShots = parseInt(selected);
    } else {
      els.shots1Container.classList.add('hide-stack');
      els.shots2Container.classList.remove('hide-stack');
      
      // Update state to match selected 2-col option
      let selected = document.querySelector('input[name="shots2"]:checked');
      if (!selected) {
        // default select 6 if none selected
        els.shots2Radios[0].checked = true;
        selected = els.shots2Radios[0];
      }
      appState.totalShots = parseInt(selected.value);
    }
    updatePreviewVisualizer();
  });
});

els.filterDropdown.addEventListener('change', (e) => {
  appState.filter = e.target.value;
  
  // update live video preview classes
  els.video.classList.remove('filter-bw', 'filter-vintage', 'filter-polaroid');
  els.videoWrapper.classList.remove('vignette-polaroid');
  if (appState.filter === 'bw') {
    els.video.classList.add('filter-bw');
  } else if (appState.filter === 'vintage') {
    els.video.classList.add('filter-vintage');
  } else if (appState.filter === 'polaroid') {
    els.video.classList.add('filter-polaroid');
    els.videoWrapper.classList.add('vignette-polaroid');
  }
});

els.shots1Radios.forEach(radio => {
  radio.addEventListener('change', (e) => {
    if (appState.columns === 1) {
      appState.totalShots = parseInt(e.target.value);
      updatePreviewVisualizer();
    }
  });
});

els.shots2Radios.forEach(radio => {
  radio.addEventListener('change', (e) => {
    if (appState.columns === 2) {
      appState.totalShots = parseInt(e.target.value);
      updatePreviewVisualizer();
    }
  });
});

function updatePreviewVisualizer() {
  els.layoutPreview.className = `layout-preview col-${appState.columns}`;
  els.layoutPreview.innerHTML = ''; // clear old
  
  for(let i = 0; i < appState.totalShots; i++) {
    const box = document.createElement('div');
    box.className = 'preview-box';
    els.layoutPreview.appendChild(box);
  }
  gsap.fromTo(els.layoutPreview.children, 
    { scale: 0.5, opacity: 0 }, 
    { scale: 1, opacity: 1, duration: 0.5, stagger: 0.05, ease: "back.out(1.7)" }
  );
}

// Lightbox logic
let currentLightboxIndex = -1;
els.btnLightboxClose = document.getElementById('btn-lightbox-close');
els.btnLightboxRemove = document.getElementById('btn-lightbox-remove');

els.lightboxOverlay.addEventListener('click', (e) => {
  if (e.target === els.lightboxOverlay) {
    closeLightbox();
  }
});

els.btnLightboxClose.addEventListener('click', () => {
  closeLightbox();
});

els.btnLightboxRemove.addEventListener('click', () => {
  if (currentLightboxIndex !== -1 && window.removePhotoFromSession) {
    window.removePhotoFromSession(currentLightboxIndex);
  }
  closeLightbox();
});

function closeLightbox() {
  if (window.resumeCountdown) window.resumeCountdown();
  
  els.lightboxOverlay.classList.remove('active');
  setTimeout(() => {
    els.lightboxOverlay.classList.add('hidden');
    els.lightboxImg.src = "";
  }, 300);
}

window.openLightbox = function(src, index) {
  if (window.pauseCountdown) window.pauseCountdown();
  
  currentLightboxIndex = index;
  els.lightboxImg.src = src;
  els.lightboxOverlay.classList.remove('hidden');
  // slight delay to allow display:block before opacity transition
  requestAnimationFrame(() => {
    els.lightboxOverlay.classList.add('active');
  });
}

// Boot
window.addEventListener('DOMContentLoaded', initApp);
