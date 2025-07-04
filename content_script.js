// YouTube Playlist Auto-Arranger – FINAL VERSION with Decimal-Friendly Natural Sorting

let overlayButton = null;
let overlayPanel = null;
let observer = null;

initializeContentScript();

function initializeContentScript() {
  if (!isPlaylistPage()) return;

  waitForPlaylist().then(() => {
    injectOverlayButton();
    observePlaylistChanges();
  });
}

function isPlaylistPage() {
  return window.location.href.includes('youtube.com/playlist') && window.location.search.includes('list=');
}

function waitForPlaylist() {
  return new Promise((resolve) => {
    const checkForVideos = () => {
      const videos = document.querySelectorAll('#contents ytd-playlist-video-renderer, #contents ytd-video-renderer');
      if (videos.length > 0) {
        resolve();
      } else {
        setTimeout(checkForVideos, 500);
      }
    };
    checkForVideos();
  });
}

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

function toggleOverlayPanel() {
  if (overlayPanel && overlayPanel.parentNode) {
    overlayPanel.remove();
    overlayPanel = null;
  } else {
    createOverlayPanel();
  }
}

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
      <button class="sorter-option-btn" data-sort="date">📅 Sort by Date</button>
      <button class="sorter-option-btn" data-sort="duration">⏱️ Sort by Duration</button>
      <button class="sorter-action-btn" id="applySortBtn">✅ Apply Sorting</button>
    </div>
  `;
  document.body.appendChild(overlayPanel);

  overlayPanel.querySelector('.sorter-close-btn').addEventListener('click', () => {
    overlayPanel.remove();
    overlayPanel = null;
  });

  overlayPanel.querySelectorAll('.sorter-option-btn').forEach(btn => {
    btn.addEventListener('click', () => handleSort(btn.dataset.sort));
  });

  overlayPanel.querySelector('#applySortBtn').addEventListener('click', applySorting);
}

function handleSort(type) {
  window.playlistSortChoice = type;
  showNotification(`Selected sort: ${type}`);
}

function applySorting() {
  if (!window.playlistSortChoice) {
    showNotification('Please select a sort option first.', 'error');
    return;
  }

  extractAndSort(window.playlistSortChoice);
  showNotification('Sorting applied!');
}

function extractAndSort(type) {
  const container = document.querySelector('#contents');
  if (!container) return;

  const videos = Array.from(container.querySelectorAll('ytd-playlist-video-renderer, ytd-video-renderer'));
  if (videos.length === 0) return;

  let parsed = videos.map(vid => {
    // 1️⃣ Title
    const title = vid.querySelector('#video-title, #video-title-link')?.textContent.trim() || '';

    // 2️⃣ Duration
    let durationSeconds = 0;
    const durationElement = vid.querySelector('ytd-thumbnail-overlay-time-status-renderer span');
    if (durationElement) {
      const durationText = durationElement.textContent.trim();
      durationSeconds = parseDuration(durationText);
    }

    // 3️⃣ Upload Date
    let uploadDate = new Date(0);
    const metadataSpans = vid.querySelectorAll('#metadata-line span');
    if (metadataSpans && metadataSpans.length > 0) {
      for (let span of metadataSpans) {
        const text = span.textContent.trim().toLowerCase();
        if (text.includes('ago')) {
          uploadDate = parseUploadDate(text);
          break;
        }
      }
    }

    return {
      element: vid,
      title,
      durationSeconds,
      uploadDate
    };
  });

  // 4️⃣ Sorting
  if (type === 'title') {
    parsed.sort((a, b) => {
      const numA = parseNumberFromTitle(a.title);
      const numB = parseNumberFromTitle(b.title);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      // fallback natural string comparison
      return naturalCompare(a.title, b.title);
    });
  } else if (type === 'duration') {
    parsed.sort((a, b) => a.durationSeconds - b.durationSeconds);
  } else if (type === 'date') {
    parsed.sort((a, b) => a.uploadDate - b.uploadDate);
  }

  // 5️⃣ Apply new order
  container.innerHTML = '';
  parsed.forEach(v => container.appendChild(v.element));
}

function parseDuration(durationText) {
  const parts = durationText.split(':').map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}

function parseUploadDate(text) {
  if (!text) return new Date(0);

  text = text.toLowerCase();
  text = text.replace(/streamed|premiered|about/g, '').trim();

  const parts = text.split(' ');
  if (parts.length < 2) return new Date(0);

  const amount = parseInt(parts[0]);
  const unit = parts[1];

  if (isNaN(amount)) return new Date(0);

  const date = new Date();

  if (unit.includes('minute')) date.setMinutes(date.getMinutes() - amount);
  else if (unit.includes('hour')) date.setHours(date.getHours() - amount);
  else if (unit.includes('day')) date.setDate(date.getDate() - amount);
  else if (unit.includes('week')) date.setDate(date.getDate() - amount * 7);
  else if (unit.includes('month')) date.setMonth(date.getMonth() - amount);
  else if (unit.includes('year')) date.setFullYear(date.getFullYear() - amount);

  return date;
}

function parseNumberFromTitle(title) {
  const match = title.match(/[\d\.]+/);
  return match ? parseFloat(match[0]) : NaN;
}

function naturalCompare(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

function observePlaylistChanges() {
  observer = new MutationObserver(() => {
    if (isPlaylistPage()) {
      injectOverlayButton();
    }
  });

  const target = document.querySelector('body');
  if (target) {
    observer.observe(target, { childList: true, subtree: true });
  }
}

function showNotification(message, type = 'success') {
  const n = document.createElement('div');
  n.className = `yt-playlist-sorter-notification ${type}`;
  n.textContent = message;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 3000);
}
