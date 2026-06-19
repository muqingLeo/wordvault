console.log('WordVault Content Ready');

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "getSelection") {
    const text = window.getSelection().toString().trim();
    sendResponse({text: text});
  }
});
