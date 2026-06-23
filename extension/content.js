console.log('%c[WordVault] Content script active', 'color: #0071e3');

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "showPanel") {
    showModernPanel(msg.word);
  }
});

function showModernPanel(word) {
  // Remove old panel
  const oldPanel = document.getElementById('wv-panel');
  if (oldPanel) oldPanel.remove();

  const panel = document.createElement('div');
  panel.id = 'wv-panel';
  panel.style.cssText = `
    position: fixed;
    top: 100px;
    right: 40px;
    width: 380px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    z-index: 2147483647;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    overflow: hidden;
    border: 1px solid #e5e5e7;
  `;

  panel.innerHTML = `
    <div style="background: linear-gradient(135deg, #0071e3, #40a9ff); color: white; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center;">
      <span style="font-weight: 700; font-size: 20px;">WordVault</span>
      <span id="close" style="font-size: 26px; cursor: pointer; line-height: 1;">×</span>
    </div>
    <div id="content-area" style="padding: 20px; min-height: 200px; color: #1d1d1f;">
      Looking up <strong>"${word}"</strong>...
    </div>
  `;

  document.body.appendChild(panel);

  // Close button
  panel.querySelector('#close').onclick = () => panel.remove();

  // Fetch definition
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`)
    .then(res => res.json())
    .then(data => {
      const entry = data[0];
      let html = `<h3 style="margin:0 0 10px; font-size: 22px;">${entry.word}</h3>`;

      if (entry.phonetic) {
        html += `<p style="color:#666; margin-bottom:16px;">${entry.phonetic}</p>`;
      }

      entry.meanings.forEach(meaning => {
        html += `<p style="font-weight:600; margin:12px 0 6px;">${meaning.partOfSpeech}</p>`;
        meaning.definitions.slice(0, 2).forEach(def => {
          html += `<p style="margin:4px 0 10px;">• ${def.definition}</p>`;
        });
      });

      html += `<button id="save-btn" style="margin-top:16px; width:100%; background:#0071e3; color:white; border:none; padding:12px; border-radius:9999px; font-size:16px; font-weight:600;">Save to My Dictionary</button>`;
      panel.querySelector('#content-area').innerHTML = html;

      // Save button
      panel.querySelector('#save-btn').onclick = () => {
        const entryData = {
          word: entry.word,
          definitions: entry.meanings,
          dateSaved: new Date().toISOString()
        };
        chrome.storage.local.get(['savedWords'], (result) => {
          const list = result.savedWords || [];
          list.push(entryData);
          chrome.storage.local.set({savedWords: list}, () => {
            alert(`✅ "${entry.word}" saved successfully!`);
          });
        });
      };
    })
    .catch(() => {
      panel.querySelector('#content-area').innerHTML = `<p>Could not find definition for this word.</p>`;
    });
}
