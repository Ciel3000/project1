/* ===== State ===== */
let currentScreen = 'screen-welcome';
let dodgeCount = 0;
let noClickCount = 0;

/* ===== Navigation ===== */
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    currentScreen = screenId;
  }
}

/* ===== Fake Loading (Screen 2 → 3) ===== */
function startLoading() {
  const overlay = document.getElementById('loading-overlay');
  overlay.classList.remove('hidden');
  setTimeout(() => {
    overlay.classList.add('hidden');
    showScreen('screen-ask');
  }, 1800);
}

/* ===== Yes Handler ===== */
function handleYes() {
  spawnConfetti();
  showScreen('screen-celebration');
  spawnConfettiRain();
}

/* ===== No Dodge Logic ===== */
function handleNoHover() {
  dodgeCount++;
  const btnNo = document.getElementById('btn-no');
  const btnYes = document.getElementById('btn-yes');

  // Show "Yes" button on first dodge
  if (dodgeCount === 1) {
    btnYes.style.visibility = 'visible';
  }

  // Move "No" button to random position within viewport
  const padding = 20;
  const maxX = window.innerWidth - btnNo.offsetWidth - padding;
  const maxY = window.innerHeight - btnNo.offsetHeight - padding;
  const randomX = Math.max(padding, Math.random() * maxX);
  const randomY = Math.max(padding, Math.random() * maxY);

  btnNo.style.position = 'fixed';
  btnNo.style.left = randomX + 'px';
  btnNo.style.top = randomY + 'px';
  btnNo.style.zIndex = '50';

  // Grow "Yes" button (cap at 2x)
  const scale = Math.min(2, 1 + dodgeCount * 0.15);
  btnYes.style.transform = `scale(${scale})`;
}

/* ===== No Click (Silly Excuse) ===== */
const excuses = [
  "Nice try! That doesn't count.",
  "Are you sure? Think again!",
  "The 'No' button is running away for a reason.",
  "Oops, wrong button! Try the other one 😉",
  "I don't accept 'No' for an answer. Try again!",
  "That was a test. You passed... barely.",
  "The sun is waiting. Don't keep it waiting!"
];

function handleNoClick() {
  noClickCount++;
  const excuseText = document.getElementById('excuse-text');
  excuseText.textContent = excuses[noClickCount % excuses.length];
  document.getElementById('screen-excuse').classList.remove('hidden');
}

function hideExcuse() {
  document.getElementById('screen-excuse').classList.add('hidden');
}

/* ===== Confetti ===== */
function spawnConfetti() {
  const colors = ['#ffb347', '#ff6b6b', '#ffd700', '#ff9f43', '#ff7675', '#fdcb6e'];
  const container = document.body;

  for (let i = 0; i < 80; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = '50%';
    confetti.style.top = '50%';

    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 300;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    const rotation = Math.random() * 720;

    confetti.style.setProperty('--tx', tx + 'px');
    confetti.style.setProperty('--ty', ty + 'px');
    confetti.style.setProperty('--rotation', rotation + 'deg');
    confetti.style.animation = `confetti-burst 1.5s ease-out forwards`;
    confetti.style.transform = `translate(0, 0) rotate(0deg)`;

    container.appendChild(confetti);

    // Animate with JS for more control
    requestAnimationFrame(() => {
      confetti.style.transform = `translate(${tx}px, ${ty}px) rotate(${rotation}deg)`;
      confetti.style.opacity = '0';
      confetti.style.transition = 'all 1.5s ease-out';
    });

    setTimeout(() => confetti.remove(), 1600);
  }
}

/* ===== Confetti Rain ===== */
function spawnConfettiRain() {
  const colors = ['#ffb347', '#ff6b6b', '#ffd700', '#ff9f43', '#ff7675', '#fdcb6e'];
  const container = document.body;

  for (let i = 0; i < 60; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-10px';
    confetti.style.width = (6 + Math.random() * 8) + 'px';
    confetti.style.height = (6 + Math.random() * 8) + 'px';
    confetti.style.animation = `confetti-rain ${2 + Math.random() * 3}s linear forwards`;
    confetti.style.animationDelay = Math.random() * 2 + 's';

    container.appendChild(confetti);

    setTimeout(() => confetti.remove(), 6000);
  }
}

/* ===== Wiggle on all buttons ===== */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    btn.style.animation = 'wiggle 0.4s ease';
    btn.addEventListener('animationend', () => {
      btn.style.animation = '';
    }, { once: true });
  });
});
