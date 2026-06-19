chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "lookupWord",
    title: "Look up in WordVault",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "lookupWord") {
    chrome.storage.local.set({lookupWord: info.selectionText}, () => {
      chrome.action.openPopup();
    });
  }
});
