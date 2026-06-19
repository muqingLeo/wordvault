// Modern WordVault Popup
document.addEventListener('DOMContentLoaded', () => {
  const contentArea = document.getElementById('content');
  contentArea.innerHTML = `
    <div style="display:flex; gap:8px; margin-bottom:12px;">
      <button id="lookupTab">🔎 Lookup</button>
      <button id="dictTab">📚 My Dictionary</button>
    </div>
    <div id="mainContent"></div>
  `;

  document.getElementById('lookupTab').onclick = showLookup;
  document.getElementById('dictTab').onclick = showDictionary;
  showLookup();
});

function showLookup() {
  document.getElementById('mainContent').innerHTML = `<p><em>Highlight any word → right-click → "Look up in WordVault"</em></p>`;
}

async function lookupWord(word) { /* same as previous full version */ 
  // (keeping the same lookupWord and saveWord from last version)
}

function saveWord(entry) { /* same */ }

function showDictionary() {
  const content = document.getElementById('mainContent');
  chrome.storage.local.get(['savedWords'], (data) => {
    const words = data.savedWords || [];
    if (words.length === 0) {
      content.innerHTML = `<p>Your dictionary is empty. Start saving words!</p>`;
      return;
    }

    let html = `<h3>My Dictionary (${words.length} words)</h3>`;
    html += `<button id="exportCSV">📤 Export as CSV (Excel)</button> `;
    html += `<button id="exportJSON">📤 Export as JSON</button>`;

    html += `<ul style="max-height:250px; overflow-y:auto; margin-top:12px;">`;
    words.forEach(w => html += `<li><strong>${w.word}</strong></li>`);
    html += `</ul>`;

    content.innerHTML = html;

    document.getElementById('exportCSV').onclick = () => exportAsCSV(words);
    document.getElementById('exportJSON').onclick = () => exportAsJSON(words);
  });
}

function exportAsCSV(words) {
  let csv = "Word,Date Saved,Part of Speech,Definition\n";
  words.forEach(w => {
    const def = w.definitions[0]?.definitions[0]?.definition || "";
    csv += `"${w.word}","${w.dateSaved}","${w.definitions[0]?.partOfSpeech || ''}","${def.replace(/"/g, '""')}"\n`;
  });

  const blob = new Blob([csv], {type: "text/csv"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wordvault-dictionary-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  alert("✅ CSV exported! Open with Excel/Google Sheets.");
}

function exportAsJSON(words) {
  const blob = new Blob([JSON.stringify(words, null, 2)], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wordvault-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
}

