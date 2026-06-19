// Complete WordVault Popup
document.addEventListener('DOMContentLoaded', () => {
  const contentArea = document.getElementById('content');
  contentArea.innerHTML = `
    <div style="display:flex; gap:8px; margin-bottom:12px;">
      <button id="lookupTab">🔎 New Lookup</button>
      <button id="dictTab">📚 My Dictionary</button>
    </div>
    <div id="mainContent">Ready</div>
  `;

  document.getElementById('lookupTab').onclick = showLookup;
  document.getElementById('dictTab').onclick = showDictionary;

  // Check for incoming lookup
  chrome.storage.local.get(['lookupWord'], (data) => {
    if (data.lookupWord) {
      lookupWord(data.lookupWord);
      chrome.storage.local.remove('lookupWord');
    } else {
      showLookup();
    }
  });
});

function showLookup() {
  document.getElementById('mainContent').innerHTML = `<p><em>Highlight word → right-click → "Look up in WordVault"</em></p>`;
}

async function lookupWord(word) {
  const content = document.getElementById('mainContent');
  content.innerHTML = `<p>Looking up "<strong>${word}</strong>"...</p>`;

  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    const data = await res.json();
    const entry = data[0];

    let html = `<h3>${entry.word}</h3><p>${entry.phonetic || ''}</p>`;

    entry.meanings.forEach(m => {
      html += `<p><strong>${m.partOfSpeech}</strong></p>`;
      m.definitions.slice(0,2).forEach(d => html += `<p>• ${d.definition}</p>`);
    });

    html += `<button id="saveBtn" style="background:#1e40af;color:white;padding:10px 16px;border:none;border-radius:6px;cursor:pointer;margin-top:12px;">💾 Save to My Dictionary</button>`;
    content.innerHTML = html;

    document.getElementById('saveBtn').addEventListener('click', () => saveWord(entry));
  } catch (e) {
    content.innerHTML = `<p>Could not find definition for "${word}".</p>`;
  }
}

function saveWord(entry) {
  const wordEntry = {
    word: entry.word,
    definitions: entry.meanings,
    dateSaved: new Date().toISOString(),
    tags: []
  };

  chrome.storage.local.get(['savedWords'], (data) => {
    let saved = data.savedWords || [];
    saved.push(wordEntry);
    chrome.storage.local.set({savedWords: saved}, () => {
      alert(`✅ "${entry.word}" saved successfully!`);
      showDictionary();
    });
  });
}

function showDictionary() {
  const content = document.getElementById('mainContent');
  chrome.storage.local.get(['savedWords'], (data) => {
    const words = data.savedWords || [];
    if (words.length === 0) {
      content.innerHTML = `<p>Your dictionary is empty.</p>`;
      return;
    }

    let html = `<h3>My Dictionary (${words.length} words)</h3>`;
    html += `<button id="exportCSV">📤 Export CSV (Excel)</button> <button id="exportJSON">📤 Export JSON</button>`;

    html += `<ul style="max-height:220px; overflow-y:auto; margin-top:12px;">`;
    words.forEach(w => html += `<li><strong>${w.word}</strong></li>`);
    html += `</ul>`;

    content.innerHTML = html;

    document.getElementById('exportCSV').onclick = () => exportAsCSV(words);
    document.getElementById('exportJSON').onclick = () => exportAsJSON(words);
  });
}

function exportAsCSV(words) {
  let csv = "Word,Date,Definition\n";
  words.forEach(w => {
    const def = w.definitions?.[0]?.definitions?.[0]?.definition || "";
    csv += `"${w.word}","${w.dateSaved}","${def.replace(/"/g, '""')}"\n`;
  });
  downloadFile(csv, 'wordvault-dictionary.csv', 'text/csv');
}

function exportAsJSON(words) {
  const jsonStr = JSON.stringify(words, null, 2);
  downloadFile(jsonStr, 'wordvault-backup.json', 'application/json');
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], {type});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  alert(`✅ Exported ${filename}`);
}
