// State Management
const appState = {
  columns: 1,
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
  countdown: document.getElementById('countdown-display'),
  layoutRadios: document.querySelectorAll('input[name="layout"]'),
  shots1Radios: document.querySelectorAll('input[name="shots1"]'),
  shots2Radios: document.querySelectorAll('input[name="shots2"]'),
  shots1Container: document.getElementById('shots-1col'),
  shots2Container: document.getElementById('shots-2col')
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

// Config Event Listeners
els.layoutRadios.forEach(radio => {
  radio.addEventListener('change', (e) => {
    appState.columns = parseInt(e.target.value);
    if (appState.columns === 1) {
      els.shots1Container.classList.remove('hidden');
      els.shots2Container.classList.add('hidden');
      
      // Update state to match selected 1-col option
      const selected = document.querySelector('input[name="shots1"]:checked').value;
      appState.totalShots = parseInt(selected);
    } else {
      els.shots1Container.classList.add('hidden');
      els.shots2Container.classList.remove('hidden');
      
      // Update state to match selected 2-col option
      let selected = document.querySelector('input[name="shots2"]:checked');
      if (!selected) {
        // default select 6 if none selected
        els.shots2Radios[0].checked = true;
        selected = els.shots2Radios[0];
      }
      appState.totalShots = parseInt(selected.value);
    }
  });
});

els.shots1Radios.forEach(radio => {
  radio.addEventListener('change', (e) => {
    if (appState.columns === 1) {
      appState.totalShots = parseInt(e.target.value);
    }
  });
});

els.shots2Radios.forEach(radio => {
  radio.addEventListener('change', (e) => {
    if (appState.columns === 2) {
      appState.totalShots = parseInt(e.target.value);
    }
  });
});

// Boot
window.addEventListener('DOMContentLoaded', initApp);
