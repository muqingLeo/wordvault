// WordVault Background Service Worker
console.log('WordVault Background Loaded');

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "lookupWord",
    title: "Look up in WordVault",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "lookupWord") {
    chrome.tabs.sendMessage(tab.id, { action: "lookup", text: info.selectionText });
  }
});
