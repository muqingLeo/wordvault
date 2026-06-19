// Improved WordVault Popup
document.addEventListener('DOMContentLoaded', () => {
  const content = document.getElementById('content');

  // Try to get selected text from current tab
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {action: "getSelection"}, (response) => {
      if (response && response.text) {
        lookupWord(response.text);
      } else {
        content.innerHTML = `<p>Select a word and use right-click menu.</p>`;
      }
    });
  });
});

async function lookupWord(word) {
  const content = document.getElementById('content');
  content.innerHTML = `<p>Looking up "<strong>${word}</strong>"...</p>`;

  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    if (!res.ok) throw new Error();

    const data = await res.json();
    const entry = data[0];

    let html = `<h3>${entry.word}</h3><p><em>${entry.phonetic || ''}</em></p>`;

    entry.meanings.forEach(m => {
      html += `<p><strong>${m.partOfSpeech}</strong></p>`;
      m.definitions.slice(0,2).forEach(d => {
        html += `<p>• ${d.definition}</p>`;
      });
    });

    html += `<button id="saveBtn">💾 Save to My Dictionary</button>`;
    content.innerHTML = html;

  } catch (e) {
    content.innerHTML = `<p>Could not find "${word}". Try a different word.</p>`;
  }
}
