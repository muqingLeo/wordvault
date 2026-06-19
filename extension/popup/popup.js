// WordVault Popup with Dictionary View
let currentView = 'lookup';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('content').innerHTML = `
    <div style="display:flex; gap:8px; margin-bottom:12px;">
      <button id="lookupTab">🔎 Lookup</button>
      <button id="dictTab">📚 My Dictionary</button>
    </div>
    <div id="mainContent"></div>
  `;

  document.getElementById('lookupTab').addEventListener('click', () => showLookup());
  document.getElementById('dictTab').addEventListener('click', () => showDictionary());

  showLookup(); // default
});

function showLookup() {
  document.getElementById('mainContent').innerHTML = `<p>Select a word on page + right-click "Look up in WordVault"</p>`;
}

async function showDictionary() {
  const content = document.getElementById('mainContent');
  chrome.storage.local.get(['savedWords'], (data) => {
    const words = data.savedWords || [];
    if (words.length === 0) {
      content.innerHTML = `<p>Your dictionary is empty. Save some words!</p>`;
      return;
    }

    let html = `<h3>My Dictionary (${words.length} words)</h3><ul style="max-height:300px; overflow-y:auto;">`;
    words.forEach((w, i) => {
      html += `<li><strong>${w.word}</strong> — saved ${new Date(w.dateSaved).toLocaleDateString()}</li>`;
    });
    html += `</ul><button id="exportBtn">Export as JSON</button>`;
    content.innerHTML = html;

    document.getElementById('exportBtn').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(words, null, 2)], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'wordvault-backup.json';
      a.click();
    });
  });
}

// Keep existing lookupWord and saveWord functions (from previous)
async function lookupWord(word) { /* ... same as before ... */ }
function saveWord(entry) { /* ... same as before ... */ }
