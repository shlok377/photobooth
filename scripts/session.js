let countdownInterval = null;
let currentSnapshot = null;

function startSession() {
  appState.capturedPhotos = [];
  appState.currentShotIndex = 0;
  
  // Clear any old drafts and timeline
  localStorage.removeItem('photobooth_draft_session');
  els.timelineTray.innerHTML = '';
  els.timelineTray.classList.remove('hidden');
  
  startShotLoop();
}

function startShotLoop() {
  appState.status = 'counting';
  updateUI();
  
  let secondsLeft = 10;
  
  // Initial display
  animateCountdownText(secondsLeft);
  
  countdownInterval = setInterval(() => {
    secondsLeft--;
    
    if (secondsLeft > 0) {
      animateCountdownText(secondsLeft);
    } else {
      clearInterval(countdownInterval);
      els.countdown.classList.add('hidden');
      executeCapture();
    }
  }, 1000);
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

  // Append thumbnail to timeline
  const thumb = document.createElement('img');
  thumb.src = currentSnapshot;
  thumb.className = 'timeline-thumb';
  thumb.addEventListener('click', () => {
    if (typeof openLightbox !== 'undefined') {
      openLightbox(thumb.src);
    }
  });
  els.timelineTray.appendChild(thumb);
  
  if (typeof gsap !== 'undefined') {
    gsap.fromTo(thumb, 
      { scale: 0, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)" }
    );
  }
  
  appState.currentShotIndex++;
  currentSnapshot = null;
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
  els.timelineTray.classList.add('hidden');
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
