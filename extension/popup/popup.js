// WordVault Popup with Save
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['lookupWord'], (data) => {
    const word = data.lookupWord;
    if (word) {
      lookupWord(word);
      chrome.storage.local.remove('lookupWord');
    } else {
      document.getElementById('content').innerHTML = '<p>Select a word using right-click menu.</p>';
    }
  });
});

async function lookupWord(word) {
  const content = document.getElementById('content');
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

    html += `<button id="saveBtn">💾 Save to My Dictionary</button>`;
    content.innerHTML = html;

    document.getElementById('saveBtn').addEventListener('click', () => saveWord(entry));

  } catch (e) {
    content.innerHTML = `<p>Definition not found for "${word}".</p>`;
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
      alert(`✅ "${entry.word}" saved to your dictionary! (${saved.length} words total)`);
    });
  });
}
