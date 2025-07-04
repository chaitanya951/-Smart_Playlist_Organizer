/**
 * YouTube Playlist Auto-Arranger Content Script
 * Injects a floating button on YouTube playlist pages.
 * Lets users sort playlist videos by Title or Duration.
 */

// Keep references to UI elements
let overlayButton = null;
let overlayPanel = null;
let observer = null;

// Initialize when content script loads
initializeContentScript();

/**
 * Entry point - runs only on playlist pages
 */
function initializeContentScript() {
  if (!isPlaylistPage()) return;

  waitForPlaylist().then(() => {
    injectOverlayButton();
    observePlaylistChanges();
  });
}

/**
 * Check if current page is a YouTube playlist
 */
function isPlaylistPage() {
  return window.location.href.includes('youtube.com/playlist') && window.location.search.includes('list=');
}

/**
 * Wait until playlist items are loaded in the DOM
 */
function waitForPlaylist() {
  return new Promise((resolve) => {
    const check = () => {
      const videos = document.querySelectorAll('#contents ytd-playlist-video-renderer, #contents ytd-video-renderer');
      if (videos.length > 0) {
        resolve();
      } else {
        setTimeout(check, 500);
      }
    };
    check();
  });
}

/**
 * Inject the floating "Sort Playlist" button
 */
function injectOverlayButton() {
  if (document.getElementById('yt-playlist-sorter-btn')) return;

  overlayButton = document.createElement('div');
  overlayButton.id = 'yt-playlist-sorter-btn';
  overlayButton.innerHTML = `
    <div class="sorter-btn-content">
      <span class="sorter-icon">📋</span>
      <span class="sorter-text">Sort Playlist</span>
    </div>
  `;
  overlayButton.addEventListener('click', toggleOverlayPanel);
  document.body.appendChild(overlayButton);
}

/**
 * Toggle the overlay modal panel
 */
function toggleOverlayPanel() {
  if (overlayPanel && overlayPanel.parentNode) {
    overlayPanel.remove();
    overlayPanel = null;
  } else {
    createOverlayPanel();
  }
}

/**
 * Create the overlay modal with sorting options
 * (only Title and Duration)
 */
function createOverlayPanel() {
  overlayPanel = document.createElement('div');
  overlayPanel.id = 'yt-playlist-sorter-panel';
  overlayPanel.innerHTML = `
    <div class="sorter-panel-header">
      <h3>Sort Playlist</h3>
      <button class="sorter-close-btn">×</button>
    </div>
    <div class="sorter-panel-content">
      <button class="sorter-option-btn" data-sort="title">📝 Sort by Title</button>
      <button class="sorter-option-btn" data-sort="duration">⏱️ Sort by Duration</button>
      <button class="sorter-action-btn" id="applySortBtn">✅ Apply Sorting</button>
    </div>
  `;
  document.body.appendChild(overlayPanel);

  // Close button
  overlayPanel.querySelector('.sorter-close-btn').addEventListener('click', () => {
    overlayPanel.remove();
    overlayPanel = null;
  });

  // Sort option buttons
  overlayPanel.querySelectorAll('.sorter-option-btn').forEach(btn => {
    btn.addEventListener('click', () => handleSort(btn.dataset.sort));
  });

  // Apply button
  overlayPanel.querySelector('#applySortBtn').addEventListener('click', applySorting);
}

/**
 * Store user's selected sort option
 */
function handleSort(type) {
  window.playlistSortChoice = type;
  showNotification(`Selected sort: ${type}`);
}

/**
 * Apply the selected sorting
 */
function applySorting() {
  if (!window.playlistSortChoice) {
    showNotification('Please select a sort option first.', 'error');
    return;
  }

  extractAndSort(window.playlistSortChoice);
  showNotification('Sorting applied!');
}

/**
 * Extract video data and sort accordingly
 */
function extractAndSort(type) {
  const container = document.querySelector('#contents');
  if (!container) return;

  const videos = Array.from(container.querySelectorAll('ytd-playlist-video-renderer, ytd-video-renderer'));
  if (videos.length === 0) return;

  let parsed = videos.map(vid => {
    // Extract Title
    const title = vid.querySelector('#video-title, #video-title-link')?.textContent.trim() || '';

    // Extract Duration
    const durationText = vid.querySelector('span#text.ytd-thumbnail-overlay-time-status-renderer')?.textContent.trim() || '';
    const durationSeconds = parseDuration(durationText);

    return {
      element: vid,
      title,
      durationSeconds
    };
  });

  // Perform sorting
  if (type === 'title') {
    parsed.sort((a, b) => naturalCompare(a.title, b.title));
  } 
  else if (type === 'duration') {
    parsed.sort((a, b) => a.durationSeconds - b.durationSeconds);
  }

  // Replace videos in the page
  container.innerHTML = '';
  parsed.forEach(v => container.appendChild(v.element));
}

/**
 * Observe YouTube dynamic navigation (SPA)
 */
function observePlaylistChanges() {
  observer = new MutationObserver(() => {
    if (isPlaylistPage()) {
      injectOverlayButton();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * Show a floating notification
 */
function showNotification(message, type = 'success') {
  const n = document.createElement('div');
  n.className = `yt-playlist-sorter-notification ${type}`;
  n.textContent = message;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 3000);
}

/**
 * Natural sorting for titles with numbers
 * E.g. "1.1" < "1.11" < "2.23"
 */
function naturalCompare(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

/**
 * Parse duration text like "1:23:45" or "12:34" into seconds
 */
function parseDuration(text) {
  if (!text) return 0;
  const parts = text.split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
}
