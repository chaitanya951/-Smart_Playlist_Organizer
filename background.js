chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url && tab.url.includes('youtube.com')) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content_script.js']
      });
    }
  });
  