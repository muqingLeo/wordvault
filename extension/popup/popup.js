const glass = document.getElementById('glass');

glass.addEventListener('mousemove', (e) => {
  const rect = glass.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  glass.style.setProperty('--mx', `${x}%`);
  glass.style.setProperty('--my', `${y}%`);
});

document.addEventListener('DOMContentLoaded', () => {
  // Real lookup logic will go here later
  document.getElementById('content').innerHTML = `
    <h2 style="margin:0 0 8px;font-size:32px;">resolution</h2>
    <p style="margin:0 0 20px;color:#64748b;">/ˌrezəˈluːʃ(ə)n/</p>
    <div style="margin-bottom:20px;">
      <strong style="color:#334155;">noun</strong>
      <ul style="padding-left:20px;margin:8px 0 0;line-height:1.6;">
        <li>A strong will, determination.</li>
        <li>The state of being resolute.</li>
      </ul>
    </div>
    <button class="glass-btn" onclick="this.textContent='✅ Saved!';this.style.background='#86efac'">Save to My Dictionary</button>
  `;
});
