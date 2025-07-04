// Listen for updates on any tab
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

  // Check if the URL changed and it's a YouTube URL
  if (changeInfo.url && tab.url.includes('youtube.com')) {
    
    // Inject the content script into the updated YouTube tab
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content_script.js']
    });
  }
});
