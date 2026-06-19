// Keep all previous logic + mouse reactive glass
const glass = document.getElementById('glass');

document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;
  glass.style.background = `rgba(255, 255, 255, 0.75)`;
  glass.style.boxShadow = `0 8px 32px rgba(0, 0, 0, 0.2), inset 0 0 80px rgba(255,255,255,0.6)`;
});

document.addEventListener('DOMContentLoaded', () => {
  // ... (previous tab and functionality code remains the same)
  // Paste your previous full popup.js logic here if needed
});
