// GSAP Animations and Audio

// Create a synthetic shutter sound using Web Audio API if no asset is provided
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSyntheticShutter() {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  // A quick click/snap sound
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'square';
  osc.frequency.setValueAtTime(150, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.1);
  
  gain.gain.setValueAtTime(1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
}

function flashEffect() {
  const overlay = document.getElementById('flash-overlay');
  
  // GSAP timeline for flash
  const tl = gsap.timeline();
  tl.to(overlay, { opacity: 1, duration: 0.05, ease: "power4.out" })
    .to(overlay, { opacity: 0, duration: 0.4, ease: "power2.in" });
}

function playShutterSound() {
  // Can replace with actual audio element later if provided
  playSyntheticShutter();
}

function animateCountdownText(numberString) {
  els.countdown.textContent = numberString;
  els.countdown.classList.remove('hidden');
  
  gsap.fromTo(els.countdown, 
    { scale: 0.5, opacity: 0 },
    { scale: 1.2, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
  );
  
  gsap.to(els.countdown, {
    scale: 1,
    opacity: 0,
    duration: 0.5,
    delay: 0.5,
    ease: "power2.in"
  });
}
