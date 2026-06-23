const glass = document.getElementById('glass');

let targetX = 45;
let targetY = 28;

function animateLiquid() {
  const currentX = parseFloat(glass.style.getPropertyValue('--mouse-x')) || 45;
  const currentY = parseFloat(glass.style.getPropertyValue('--mouse-y')) || 28;

  const newX = currentX + (targetX - currentX) * 0.12;
  const newY = currentY + (targetY - currentY) * 0.12;

  glass.style.setProperty('--mouse-x', `${newX}%`);
  glass.style.setProperty('--mouse-y', `${newY}%`);

  requestAnimationFrame(animateLiquid);
}

document.addEventListener('mousemove', (e) => {
  const rect = glass.getBoundingClientRect();
  targetX = ((e.clientX - rect.left) / rect.width) * 100;
  targetY = ((e.clientY - rect.top) / rect.height) * 100;
});

document.addEventListener('DOMContentLoaded', () => {
  animateLiquid();

  const content = document.getElementById('content');
  content.innerHTML = `
    <h2 style="margin:0 0 6px; font-size:28px; font-weight:700;">resolution</h2>
    <div style="font-size:13px; color:#666; margin-bottom:16px;">/ˌrezəˈluːʃ(ə)n/</div>
    
    <div style="margin-bottom:18px;">
      <div style="font-weight:600; font-size:13px; color:#444; margin-bottom:6px;">noun</div>
      <ul style="margin:0; padding-left:18px; line-height:1.55; font-size:14.5px;">
        <li>A strong will, determination.</li>
        <li>The state of being resolute.</li>
      </ul>
    </div>

    <button class="save-btn" onclick="alert('Saved to dictionary! (demo)')">
      Save to My Dictionary
    </button>
  `;
});