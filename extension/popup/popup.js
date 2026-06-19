// Full WordVault Popup
document.addEventListener('DOMContentLoaded', () => {
  const contentArea = document.getElementById('content');
  contentArea.innerHTML = `
    <div style="display:flex; gap:8px; margin-bottom:12px; flex-wrap:wrap;">
      <button id="lookupTab">🔎 New Lookup</button>
      <button id="dictTab">📚 My Dictionary</button>
    </div>
    <div id="mainContent">Ready</div>
  `;

  document.getElementById('lookupTab').addEventListener('click', showLookup);
  document.getElementById('dictTab').addEventListener('click', showDictionary);

  // Auto check for incoming lookup
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
  document.getElementById('mainContent').innerHTML = `<p>Highlight a word on any page and use right-click → "Look up in WordVault"</p>`;
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
      m.definitions.slice(0, 2).forEach(d => html += `<p>• ${d.definition}</p>`);
    });

    html += `<button id="saveBtn" style="background:#1e40af;color:white;padding:8px 16px;border:none;border-radius:4px;cursor:pointer;">💾 Save to My Dictionary</button>`;
    content.innerHTML = html;

    document.getElementById('saveBtn').addEventListener('click', () => saveWord(entry));
  } catch (e) {
    content.innerHTML = `<p>Could not find definition for "${word}". Try another word.</p>`;
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
      alert(`✅ "${entry.word}" saved! Total words: ${saved.length}`);
      showDictionary(); // switch to dictionary view
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
    let html = `<h3>My Dictionary (${words.length})</h3><ul style="max-height:280px;overflow-y:auto;">`;
    words.forEach(w => {
      html += `<li><strong>${w.word}</strong> — ${new Date(w.dateSaved).toLocaleDateString()}</li>`;
    });
    html += `</ul><button id="exportBtn">Export JSON</button>`;
    content.innerHTML = html;

    document.getElementById('exportBtn').onclick = () => {
      const blob = new Blob([JSON.stringify(words, null, 2)], {type: "application/json"});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'wordvault-dictionary.json';
      a.click();
    };
  });
}
