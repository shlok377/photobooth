let countdownInterval = null;
let currentSnapshot = null;

function startSession() {
  appState.capturedPhotos = [];
  appState.currentShotIndex = 0;
  
  // Clear any old drafts
  localStorage.removeItem('photobooth_draft_session');
  
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
  
  // Save to drafts in localstorage
  localStorage.setItem('photobooth_draft_session', JSON.stringify(appState.capturedPhotos));
  
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
  updateUI();
  
  // Trigger canvas generation
  generateStrip();
}
