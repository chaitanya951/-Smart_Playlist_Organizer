// Global variables
let videos = [];
let originalOrder = [];
let currentSortMethod = null;
let sortDirection = 'asc'; // 'asc' or 'desc'

// DOM elements
const videoList = document.getElementById('videoList');
const status = document.getElementById('status');

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
    await initializePopup();
    setupEventListeners();
});

// Initialize popup functionality
async function initializePopup() {
    try {
        // Get current tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (!tab.url.includes('youtube.com/playlist')) {
            showStatus('Please navigate to a YouTube playlist page', 'error');
            return;
        }

        // Get videos from the page
        const result = await chrome.tabs.sendMessage(tab.id, { action: 'getVideos' });
        
        if (result && result.videos) {
            videos = result.videos;
            originalOrder = [...videos];
            renderVideoList();
            showStatus(`Found ${videos.length} videos in playlist`, 'success');
        } else {
            showStatus('No videos found. Please refresh the page and try again.', 'error');
        }
    } catch (error) {
        console.error('Error initializing popup:', error);
        showStatus('Error connecting to YouTube page. Please refresh and try again.', 'error');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Sort buttons
    document.getElementById('sortTitle').addEventListener('click', () => handleSort('title'));
    document.getElementById('sortDate').addEventListener('click', () => handleSort('date'));
    document.getElementById('sortDuration').addEventListener('click', () => handleSort('duration'));
    
    // Action buttons
    document.getElementById('applySort').addEventListener('click', applySorting);
    document.getElementById('saveOrder').addEventListener('click', saveOrder);
    document.getElementById('loadOrder').addEventListener('click', loadOrder);
    document.getElementById('resetOrder').addEventListener('click', resetOrder);
}

// Handle sort button clicks
function handleSort(method) {
    // Toggle direction if same method
    if (currentSortMethod === method) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortMethod = method;
        sortDirection = 'asc';
    }

    // Update button states
    document.querySelectorAll('.sort-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Sort videos
    sortVideos(method, sortDirection);
    renderVideoList();
    
    showStatus(`Sorted by ${method} (${sortDirection === 'asc' ? 'A-Z' : 'Z-A'})`, 'info');
}

// Sort videos based on method and direction
function sortVideos(method, direction) {
    const sortedVideos = [...videos];
    
    sortedVideos.sort((a, b) => {
        let comparison = 0;
        
        switch (method) {
            case 'title':
                comparison = a.title.localeCompare(b.title);
                break;
            case 'date':
                comparison = new Date(a.uploadDate) - new Date(b.uploadDate);
                break;
            case 'duration':
                comparison = a.durationSeconds - b.durationSeconds;
                break;
        }
        
        return direction === 'asc' ? comparison : -comparison;
    });
    
    videos = sortedVideos;
}

// Render video list for custom ordering
function renderVideoList() {
    if (videos.length === 0) {
        videoList.innerHTML = '<div class="placeholder">No videos found. Please navigate to a YouTube playlist page.</div>';
        return;
    }

    videoList.innerHTML = videos.map((video, index) => `
        <div class="video-item" draggable="true" data-index="${index}">
            <span class="drag-handle">⋮⋮</span>
            <div class="video-title" title="${video.title}">${video.title}</div>
        </div>
    `).join('');

    // Setup drag and drop
    setupDragAndDrop();
}

// Setup drag and drop functionality
function setupDragAndDrop() {
    const videoItems = document.querySelectorAll('.video-item');
    
    videoItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragend', handleDragEnd);
    });
}

// Drag and drop handlers
function handleDragStart(e) {
    e.target.classList.add('dragging');
    e.dataTransfer.setData('text/plain', e.target.dataset.index);
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const dropIndex = parseInt(e.target.closest('.video-item').dataset.index);
    
    if (draggedIndex !== dropIndex) {
        // Reorder videos array
        const draggedVideo = videos[draggedIndex];
        videos.splice(draggedIndex, 1);
        videos.splice(dropIndex, 0, draggedVideo);
        
        // Re-render list
        renderVideoList();
        showStatus('Video order updated', 'info');
    }
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

// Apply sorting to YouTube page
async function applySorting() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (!tab.url.includes('youtube.com/playlist')) {
            showStatus('Please navigate to a YouTube playlist page', 'error');
            return;
        }

        await chrome.tabs.sendMessage(tab.id, {
            action: 'applySort',
            videos: videos
        });

        showStatus('Playlist order applied successfully!', 'success');
    } catch (error) {
        console.error('Error applying sort:', error);
        showStatus('Error applying sort. Please refresh the page and try again.', 'error');
    }
}

// Save current order to Chrome Storage
async function saveOrder() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const playlistId = extractPlaylistId(tab.url);
        
        if (!playlistId) {
            showStatus('Could not identify playlist ID', 'error');
            return;
        }

        const orderData = {
            playlistId: playlistId,
            videos: videos,
            timestamp: Date.now()
        };

        await chrome.storage.local.set({ [`playlist_${playlistId}`]: orderData });
        showStatus('Order saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving order:', error);
        showStatus('Error saving order', 'error');
    }
}

// Load saved order from Chrome Storage
async function loadOrder() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const playlistId = extractPlaylistId(tab.url);
        
        if (!playlistId) {
            showStatus('Could not identify playlist ID', 'error');
            return;
        }

        const result = await chrome.storage.local.get(`playlist_${playlistId}`);
        const savedOrder = result[`playlist_${playlistId}`];

        if (!savedOrder) {
            showStatus('No saved order found for this playlist', 'info');
            return;
        }

        videos = savedOrder.videos;
        renderVideoList();
        showStatus('Saved order loaded successfully!', 'success');
    } catch (error) {
        console.error('Error loading order:', error);
        showStatus('Error loading saved order', 'error');
    }
}

// Reset to original YouTube order
async function resetOrder() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (!tab.url.includes('youtube.com/playlist')) {
            showStatus('Please navigate to a YouTube playlist page', 'error');
            return;
        }

        // Get original order from page
        const result = await chrome.tabs.sendMessage(tab.id, { action: 'getVideos' });
        
        if (result && result.videos) {
            videos = result.videos;
            originalOrder = [...videos];
            currentSortMethod = null;
            sortDirection = 'asc';
            
            // Clear active sort button
            document.querySelectorAll('.sort-btn').forEach(btn => btn.classList.remove('active'));
            
            renderVideoList();
            showStatus('Reset to original YouTube order', 'success');
        }
    } catch (error) {
        console.error('Error resetting order:', error);
        showStatus('Error resetting order. Please refresh the page and try again.', 'error');
    }
}

// Extract playlist ID from YouTube URL
function extractPlaylistId(url) {
    const match = url.match(/[?&]list=([^&]+)/);
    return match ? match[1] : null;
}

// Show status message
function showStatus(message, type = 'info') {
    status.textContent = message;
    status.className = `status ${type}`;
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        status.style.display = 'none';
    }, 3000);
} 