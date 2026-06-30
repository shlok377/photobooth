let countdownInterval = null;
let currentSnapshot = null;
let secondsLeftGlobal = 0;

function startSession() {
  appState.capturedPhotos = [];
  appState.currentShotIndex = 0;
  
  // Clear any old drafts and timeline
  localStorage.removeItem('photobooth_draft_session');
  els.timelineTray.innerHTML = '';
  els.timelineTray.classList.remove('hidden');
  
  startShotLoop();
}

function startShotLoop(resume = false) {
  appState.status = 'counting';
  updateUI();
  
  if (!resume) {
    secondsLeftGlobal = 10;
    // Initial display
    animateCountdownText(secondsLeftGlobal);
  }
  
  if (countdownInterval) clearInterval(countdownInterval);
  
  countdownInterval = setInterval(() => {
    secondsLeftGlobal--;
    
    if (secondsLeftGlobal > 0) {
      animateCountdownText(secondsLeftGlobal);
    } else {
      clearInterval(countdownInterval);
      els.countdown.classList.add('hidden');
      executeCapture();
    }
  }, 1000);
}

window.pauseCountdown = function() {
  if (appState.status === 'counting' && countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}

window.resumeCountdown = function() {
  if (appState.status === 'counting') {
    startShotLoop(true);
  }
}

function executeCapture() {
  flashEffect();
  playShutterSound();
  
  currentSnapshot = takeSnapshot();
  pauseVideo();
  
  // Transition to review
  appState.status = 'review';
  updateUI();
}

function handleRetake() {
  currentSnapshot = null;
  resumeVideo();
  startShotLoop();
}

function handleContinue() {
  // Save to state
  appState.capturedPhotos.push(currentSnapshot);
  
  // Save to drafts in localstorage safely
  try {
    localStorage.setItem('photobooth_draft_session', JSON.stringify(appState.capturedPhotos));
  } catch (e) {
    console.warn("Storage quota exceeded, continuing with in-memory state only.", e);
  }

  appState.currentShotIndex++;
  currentSnapshot = null;
  
  // Re-render the timeline tray
  renderTimelineTray();
  
  // Flash effect on the last added thumb
  if (typeof gsap !== 'undefined' && els.timelineTray.lastElementChild) {
    gsap.fromTo(els.timelineTray.lastElementChild, 
      { scale: 0, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)" }
    );
  }
  
  resumeVideo();
  
  if (appState.currentShotIndex < appState.totalShots) {
    startShotLoop();
  } else {
    finishSession();
  }
}

function finishSession() {
  appState.status = 'done';
  els.video.classList.add('hidden');
  updateUI();
  
  // Trigger canvas generation
  generateStrip();
}

function resetSession() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  els.countdown.classList.add('hidden');

  appState.capturedPhotos = [];
  appState.currentShotIndex = 0;
  appState.status = 'idle';
  
  // Clean up UI from finished state
  document.getElementById('photo-strip-preview').style.display = 'none';
  els.video.classList.remove('hidden');
  els.timelineTray.classList.add('hidden');
  els.timelineTray.innerHTML = '';
  resumeVideo();
  
  localStorage.removeItem('photobooth_draft_session');
  
  updateUI();
}

function renderTimelineTray() {
  els.timelineTray.innerHTML = '';
  if (appState.capturedPhotos.length > 0) {
    els.timelineTray.classList.remove('hidden');
    appState.capturedPhotos.forEach((photoData, index) => {
      const thumb = document.createElement('img');
      thumb.src = photoData;
      thumb.className = 'timeline-thumb';
      thumb.dataset.index = index;
      thumb.addEventListener('click', () => {
        if (typeof openLightbox !== 'undefined') {
          openLightbox(photoData, index);
        }
      });
      els.timelineTray.appendChild(thumb);
    });
  }
}

window.removePhotoFromSession = function(index) {
  appState.capturedPhotos.splice(index, 1);
  appState.currentShotIndex--;
  
  // Save to drafts in localstorage safely
  try {
    localStorage.setItem('photobooth_draft_session', JSON.stringify(appState.capturedPhotos));
  } catch (e) {
    console.warn("Storage quota exceeded", e);
  }
  
  renderTimelineTray();
  
  if (appState.status === 'done') {
    document.getElementById('photo-strip-preview').style.display = 'none';
    els.video.classList.remove('hidden');
    els.timelineTray.classList.remove('hidden');
    resumeVideo();
    startShotLoop();
  }
}
