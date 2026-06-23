chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "lookupWord",
    title: "Look up in WordVault",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "lookupWord" || !tab.id) return;

  try {
    // First try to send message
    await chrome.tabs.sendMessage(tab.id, {
      action: "showPanel",
      word: info.selectionText
    });
  } catch (err) {
    // If it fails, inject the content script manually
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      });
      
      // Wait a bit then try again
      setTimeout(async () => {
        try {
          await chrome.tabs.sendMessage(tab.id, {
            action: "showPanel",
            word: info.selectionText
          });
        } catch (e) {
          console.error("Still failed after injection:", e);
        }
      }, 400);
    } catch (injectionError) {
      console.error("Failed to inject content script:", injectionError);
    }
  }
});
