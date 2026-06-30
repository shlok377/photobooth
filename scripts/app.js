// State Management
const appState = {
  template: '3-shot',
  totalShots: 3,
  currentShotIndex: 0,
  capturedPhotos: [],
  customText: "",
  status: "idle" // idle, counting, review, done
};

// UI Elements
const els = {
  video: document.getElementById('camera-feed'),
  skeleton: document.getElementById('camera-skeleton'),
  btnStart: document.getElementById('btn-start'),
  btnRetake: document.getElementById('btn-retake'),
  btnKeep: document.getElementById('btn-keep'),
  btnDownload: document.getElementById('btn-download'),
  controlsIdle: document.getElementById('controls-idle'),
  controlsReview: document.getElementById('controls-review'),
  controlsDone: document.getElementById('controls-done'),
  errorMsg: document.getElementById('error-message'),
  countdown: document.getElementById('countdown-display')
};

// Initialize App
async function initApp() {
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
  } else if (appState.status === 'review') {
    els.controlsReview.classList.remove('hidden');
  } else if (appState.status === 'done') {
    els.controlsDone.classList.remove('hidden');
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

// Boot
window.addEventListener('DOMContentLoaded', initApp);
