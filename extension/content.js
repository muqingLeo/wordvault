// WordVault Content Script - Detects text selection
console.log('WordVault Content Script Loaded');

document.addEventListener('mouseup', () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 0 && selectedText.length < 50) {
    console.log('WordVault: Selected text:', selectedText);
    // TODO: Show floating button or send to popup
  }
});
