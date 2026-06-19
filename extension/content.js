// Content Script
console.log('WordVault Content Script Loaded');

document.addEventListener('mouseup', () => {
  const selected = window.getSelection().toString().trim();
  if (selected.length > 0) {
    console.log('Selected:', selected);
  }
});
