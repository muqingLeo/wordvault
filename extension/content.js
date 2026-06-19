console.log('✅ WordVault Content Script Active');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received in content script:', message);
  if (message.action === "lookup") {
    console.log('Lookup requested for:', message.text);
    // For now, just log - popup will handle display
    sendResponse({status: "received"});
  }
});
