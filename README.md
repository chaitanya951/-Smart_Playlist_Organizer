# YouTube Playlist Auto-Arranger - Chrome Extension

A powerful Chrome extension that lets you sort YouTube playlists *right on the page* by Title (including decimal numbers like 1.11, 2.23), Upload Date (using "x years ago" parsing), or Duration. Works entirely in your browser — no server, no YouTube API writes.

-----

## ✨ Features

  * **Smart Sorting**
      * **Title**: Natural order, with support for decimal numbers
          * Example: 1.1, 1.11, 2.23 are sorted correctly
      * **Upload Date**: Parses YouTube's relative dates ("5 years ago")
      * **Duration**: Supports HH:MM:SS and MM:SS
  * **Floating Overlay**: Always-visible "Sort Playlist" button on YouTube playlist pages
  * **Popup Interface**: Access via the Chrome toolbar
  * **Real-Time YouTube SPA Support**: Automatically works with YouTube’s single-page navigation
  * **Client-Side Only**: All changes happen in your browser — no server communication

-----

## 🚀 Installation

### ✅ Load Unpacked Extension

1.  **Download or Clone** this repo.
2.  Open Chrome → go to `chrome://extensions/`.
3.  Enable **Developer mode** (top right).
4.  Click **Load unpacked**.
5.  Select your **extension folder**.

*(Optional)*: Add icons (`icons/icon16.png`, `icon48.png`, `icon128.png`) in an `icons/` folder.

-----

## 📖 How to Use

### ✅ Navigate to a Playlist

  * Open **any YouTube playlist** (URL includes `/playlist?list=`)

You’ll see:

  * A floating **Sort Playlist** button
  * The extension icon in your Chrome toolbar

### ✅ Open the Interface

✔️ Click the **floating button** on the YouTube page
✔️ Or use the **popup** from the Chrome toolbar

### ✅ Sorting Options

#### 📝 Sort by Title

  * Natural sorting, including decimals in chapter-style titles:
    ```
    1.1
    1.11
    2.23
    ```
  * No lexicographic mistakes like "1.11" before "1.2"

#### 📅 Sort by Upload Date

  * Uses YouTube's **relative dates** (e.g., "3 years ago")
  * Converts to approximate Date objects for sorting

#### ⏱️ Sort by Duration

  * Parses durations like "1:23:45" or "12:34"
  * Sorts videos by length

-----

### ✅ How to Sort

1.  Click **Sort Playlist** overlay or the popup.
2.  Choose the sort type (Title, Date, Duration).
3.  Click **Apply Sorting**.
4.  The playlist reorders instantly on the page.

✅ No page reload needed\!

-----

## 💻 Technical Details

This extension uses Chrome Manifest V3 and standard web technologies. All sorting happens *client-side*, modifying the YouTube page you see in your browser.

### ✅ How It Works

  * **Manifest V3**: Defines extension metadata, permissions, and script loading.
  * **Content Script**:
      * Runs on YouTube playlist pages (URLs containing `list=`).
      * Injects a floating "Sort Playlist" overlay button.
      * Uses `MutationObserver` to watch for YouTube's single-page app navigation and reinjects if needed.
      * Adds sorting UI directly onto YouTube pages.
  * **Sorting Logic**:
      * **Title Sorting**: Uses custom parsing to handle numbers and decimals naturally. Example: 1.1, 1.11, 2.23 sort in expected numeric order.
      * **Upload Date Sorting**: Extracts relative labels like "5 years ago" and converts them into approximate JavaScript Dates.
      * **Duration Sorting**: Converts HH:MM:SS and MM:SS formats into seconds, then sorts from shortest to longest.
  * **Popup**: Toolbar-accessible popup window offering sorting controls without navigating to YouTube pages.
  * **Overlay Button**: Always visible on playlist pages, opens a sorting panel with options for Title, Date, and Duration. Single-click Apply Sorting reorders the playlist in-place.
  * **SPA Support**: YouTube loads new pages without full reloads; MutationObserver ensures overlay button reappears on playlist navigation.
  * **Styling**: `overlay.css` for floating button and overlay panel, `popup.css` for popup window.

### 📂 File Structure

```
youtube-playlist-auto-arranger/
├── manifest.json         # Extension config
├── popup.html            # Popup interface
├── popup.css             # Popup styling
├── popup.js              # Popup logic
├── content_script.js     # Injected on YouTube pages
├── overlay.css           # Floating overlay styling
└── README.md             # This file
```

-----

### ✅ Chrome Storage API (Optional)

Extension can save/load custom orders locally:

```javascript
// Save order
await chrome.storage.local.set({ [`playlist_${playlistId}`]: order });

// Load order
const result = await chrome.storage.local.get(`playlist_${playlistId}`);
```

### ✅ Permissions

  * `storage`: Save/load orders locally
  * `activeTab`: Messaging to the current tab
  * `https://www.youtube.com/*`: Inject on YouTube playlist pages

### ✅ Content Script

  * Auto-injected on YouTube pages
  * Only activates on playlist pages (`list=` in URL)
  * Uses `MutationObserver` to detect SPA navigation
  * Adds a floating overlay button on playlist pages

-----

## 🛠️ Troubleshooting

### ✅ Floating button not showing?

  * Make sure you're on a playlist page (URL includes `list=`).
  * Refresh the page.

### ✅ Sort by Date not perfect?

  * YouTube only provides relative dates ("3 years ago"), so sorting is approximate.

### ✅ Sort by Title weird?

  * This extension uses decimal-aware parsing, so chapters sort naturally:
    ```
    1.1
    1.11
    2.23
    ```

### ✅ General fixes

  * Refresh YouTube page.
  * Reload the extension in `chrome://extensions/`.
  * Check the DevTools console for errors.

### ✅ Browser Support

  * **Chrome**: 88+ (Manifest V3)
  * **Edge**: 88+ (Chromium-based)
  * **Other Chromium browsers**: Should work if Manifest V3 is supported.

-----

## 🎯 Use Cases

  * **Educators**: Order lectures by chapter number.
  * **Content Creators**: Publish playlists in the right order.
  * **Music Lovers**: Sort by track duration.
  * **Researchers**: Arrange by upload age.
  * **Anyone**: Make any playlist easier to watch.

-----

## 🔒 Privacy & Security

  * ✅ All changes are local to your browser.
  * ✅ No server communication.
  * ✅ No personal data collected.
  * ✅ YouTube’s servers are never modified.

-----

## 🤝 Contributing

  * ✅ Fork this repo.
  * ✅ Create a new branch.
  * ✅ Make your changes and test.
  * ✅ Submit a pull request.

-----

## 🛠️ Dev Setup

1.  Clone the repo.
2.  Load unpacked in Chrome (`chrome://extensions/`).
3.  Make changes.
4.  Reload the extension in `chrome://extensions/`.
5.  Test on YouTube playlist pages.

-----

## 📝 License

Free to use, modify, and share.

-----

## 🙏 Acknowledgments

  * YouTube for the platform.
  * Chrome Extension APIs.
  * The open-source community for tools and inspiration.