# 🎬 YouTube Playlist Auto-Arranger - Chrome Extension

A powerful Chrome extension that lets you **sort YouTube playlists right on the page**.  
✅ Natural sorting (handles chapter numbers like 1.1, 1.11, 2.23).  
✅ Approximate sorting by upload date and duration.  
✅ Fully **client-side** – no server calls, no YouTube API writes.  
✅ Single, elegant **floating button** integrated directly into YouTube's UI.  

---

## ✨ Features

- **Smart Sorting**
  - **Title**: Natural order, including decimal numbers in chapters
    - Example: 1.1, 1.11, 2.23 sort in logical order
  - **Upload Date**: Parses YouTube's relative dates ("5 years ago")
  - **Duration**: Supports formats like HH:MM:SS and MM:SS

- **Floating Overlay Interface**
  - Always-visible **Sort Playlist** button on YouTube playlist pages
  - Opens a clean overlay panel with sorting options

- **Real-Time SPA Support**
  - Automatically works with YouTube’s single-page navigation
  - Reinserts the overlay button on navigation

- **Client-Side Only**
  - All changes are local to your browser
  - No server communication, no YouTube API writes

---

## 🚀 Installation

### ✅ Load as Unpacked Extension

1️⃣ Download or clone this repo.  
2️⃣ Open Chrome and navigate to `chrome://extensions/`.  
3️⃣ Enable **Developer mode** (toggle in top right).  
4️⃣ Click **Load unpacked**.  
5️⃣ Select your **extension folder**.

---

## 📖 How to Use

### ✅ Navigate to a Playlist
- Open **any YouTube playlist** (URL includes `/playlist?list=`).
- The floating **Sort Playlist** button appears in the bottom-right corner.

### ✅ Sort In-Page
1️⃣ Click the **Sort Playlist** button.  
2️⃣ The overlay panel opens with options:
   - 📝 **Sort by Title**
   - 📅 **Sort by Upload Date**
   - ⏱️ **Sort by Duration**
3️⃣ Choose your sorting option.  
4️⃣ Click ✅ **Apply Sorting**.  
5️⃣ The playlist reorders instantly **without a page reload**.

---

## 🎨 Example Use Case

> ✅ Chaptered lecture playlist:
1.1 Introduction
1.11 Deeper Dive
2.23 Advanced Topic

✅ Sorted *naturally*, not alphabetically.

---

## 💻 Technical Details

- **Manifest V3**
  - Defines permissions, matches, and scripts
- **Content Script**
  - Injected only on YouTube playlist pages
  - Adds the floating button and overlay
  - Uses `MutationObserver` to handle YouTube SPA navigation
- **Sorting Logic**
  - **Title Sorting**: Natural, numeric-aware order
  - **Upload Date Sorting**: Parses "x years ago" text to approximate dates
  - **Duration Sorting**: Converts HH:MM:SS or MM:SS to seconds for sorting
- **Styling**
  - `overlay.css` handles the floating button and modal styles

---

## 📂 File Structure

youtube-playlist-auto-arranger/
├── manifest.json # Extension metadata & permissions
├── content_script.js # Main injected script for YouTube
├── overlay.css # Styling for floating button & overlay
└── README.md # This file

---

## ✅ Permissions

- **`storage`**: To save user's sorting choice locally (if extended)
- **`scripting`**: Required for content script injection
- **`https://www.youtube.com/*`**: Runs only on YouTube playlist pages

---

## ✅ How It Works

1. On visiting a YouTube playlist page (`/playlist?list=`), the extension:
   - Injects a **floating Sort Playlist button** at bottom-right.
2. Button opens a **sorting overlay panel** with:
   - Sort by Title
   - Sort by Upload Date
   - Sort by Duration
3. User selects a sort option and clicks **Apply Sorting**.
4. The extension reorders the visible playlist videos **in-place**.
5. No page reload, no server calls — everything is local and instant.

---

## 🛠️ Troubleshooting

✅ Floating button not showing?
- Make sure you're on a **playlist page** (URL includes `list=`).
- Refresh the page.

✅ Sort by Date not perfect?
- YouTube only shows *relative* dates ("5 years ago"), so sorting is approximate.

✅ Weird Title sort?
- Extension uses natural, decimal-aware sorting. If your titles aren't chapter-style, results may vary.

✅ General fixes:
- Refresh the YouTube page.
- Reload the extension in `chrome://extensions/`.
- Check Developer Tools console for errors.

---

## ✅ Browser Support

- **Chrome** 88+ (Manifest V3 required)
- **Edge** 88+ (Chromium-based)
- Other Chromium browsers with Manifest V3 support should also work

---

## 🎯 Use Cases

- **Educators**: Organize lecture videos by chapter numbers
- **Content Creators**: Ensure playlists match intended order
- **Music Lovers**: Sort playlists by track duration
- **Researchers**: Arrange by upload age
- **Anyone**: Make any playlist easier to navigate

---

## 🔒 Privacy & Security

✅ All changes are **local to your browser**  
✅ No server communication  
✅ No personal data collected  
✅ YouTube’s servers are **never modified**

---

## 🤝 Contributing

✅ Fork this repo  
✅ Create a new branch  
✅ Make your changes & test  
✅ Submit a Pull Request

---

## 🛠️ Dev Setup

1️⃣ Clone the repo.  
2️⃣ Load unpacked in Chrome (`chrome://extensions/`).  
3️⃣ Make changes.  
4️⃣ Reload the extension in `chrome://extensions/`.  
5️⃣ Test on YouTube playlist pages.

---

## 📝 License

✅ Free to use, modify, and share.

---

## 🙏 Acknowledgments

- YouTube for the platform
- Chrome Extension APIs
- The open-source community for inspiration

---

**Happy Sorting! 🎵📋**  
