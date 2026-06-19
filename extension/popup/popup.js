// WordVault Popup with Dictionary API
let currentWord = '';

async function lookupWord(word) {
  const content = document.getElementById('content');
  content.innerHTML = `<p>Looking up "<strong>${word}</strong>"...</p>`;

  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!res.ok) throw new Error('Word not found');

    const data = await res.json();
    const entry = data[0];

    let html = `
      <h3>${entry.word}</h3>
      <p><em>${entry.phonetic || ''}</em></p>
    `;

    entry.meanings.forEach(meaning => {
      html += `<p><strong>${meaning.partOfSpeech}</strong></p>`;
      meaning.definitions.slice(0, 3).forEach(def => {
        html += `<p>• ${def.definition}</p>`;
        if (def.example) html += `<p style="font-style:italic; color:#666;">Example: ${def.example}</p>`;
      });
    });

    html += `<button id="saveBtn" style="margin-top:12px; padding:8px;">Save to WordVault</button>`;
    content.innerHTML = html;

    document.getElementById('saveBtn').addEventListener('click', () => {
      alert('✅ Word saved! (Backend coming in Phase 4)');
    });

  } catch (err) {
    content.innerHTML = `<p>❌ Could not find definition for "${word}"</p>`;
  }
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "lookup") {
    currentWord = msg.text;
    lookupWord(currentWord);
  }
});
