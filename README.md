# 🎬 YouTube Playlist Auto-Arranger - Chrome Extension

A powerful and lightweight Chrome extension that lets you **sort YouTube playlists right on the page** — by **Title** or **Duration**.  
✅ Natural sorting (handles chapter numbers like 1.1, 1.11, 2.23)  
✅ Fully **client-side** — no API calls, no servers, no reloads  
✅ Sleek, floating UI integrated directly into YouTube’s layout  

---

## ✨ Features

- 📝 **Sort by Title**
  - Smart numeric-aware sorting (e.g. 1.1, 1.11, 2.23)
  - Avoids alphabetical bugs like "1.11" appearing before "1.2"

- ⏱️ **Sort by Duration**
  - Understands HH:MM:SS and MM:SS formats
  - Sorts from shortest to longest (or modify for reverse)

- 📌 **Floating Overlay UI**
  - Non-intrusive button always available on playlist pages
  - Clean panel lets you apply sorting instantly

- ⚡ **Real-Time YouTube SPA Support**
  - Works with YouTube's single-page app navigation
  - Button auto-reappears when navigating to a new playlist

- 🔒 **Privacy First**
  - All logic runs in your browser
  - No external servers, tracking, or YouTube API writes

---

## 🚀 Installation

### ✅ Load as Unpacked Extension (Dev Mode)

1. Clone or download this repo  
2. Open Chrome and go to: `chrome://extensions/`  
3. Enable **Developer mode** (top right corner)  
4. Click **Load unpacked**  
5. Select your extension folder (e.g. `youtube-playlist-auto-arranger`)  

---

## 📖 How to Use

### 1️⃣ Navigate to a Playlist  
- Open any YouTube playlist (`youtube.com/playlist?list=...`)  
- A **Sort Playlist** button appears in the bottom-right corner  

### 2️⃣ Apply Sorting  
1. Click the floating button  
2. Choose a sort option:
   - 📝 Sort by Title
   - ⏱️ Sort by Duration  
3. Click ✅ **Apply Sorting**  
4. The videos reorder instantly **without reloading the page**

---

## 🎨 Example Use Case

**Before:**
1.11 Advanced Setup
1.1 Introduction
2.23 Final Build


**After Sorting by Title:**
1.1 Introduction
1.11 Advanced Setup
2.23 Final Build

---

## 💻 Technical Details

- **Manifest V3**: Chrome’s latest extension standard  
- **Content Script**:
  - Injected on `youtube.com/playlist` pages
  - Adds a persistent floating button
  - Observes YouTube’s SPA navigation with MutationObserver

- **Sorting Logic**:
  - `title`: Natural, numeric-aware comparison
  - `duration`: Parses time strings to seconds and sorts numerically

- **CSS Styling**:
  - `overlay.css` styles the button and modal
  - Responsive and animated UI

---

## 📂 Folder Structure

youtube-playlist-auto-arranger/
├── manifest.json # Extension metadata & permissions
├── content_script.js # Floating UI & sorting logic
├── overlay.css # Styling for floating button and panel
└── README.md # This file


---

## ✅ Permissions

- `storage` *(optional)*: For future saving of preferences  
- `scripting`: To inject content scripts  
- `https://www.youtube.com/*`: Required to run on playlist pages  

---

## 🛠️ Troubleshooting

- ❓ **Floating button not showing?**
  - Make sure you’re on a playlist page (`list=` in the URL)
  - Try refreshing the page

- ❓ **Sort by Title looks wrong?**
  - Make sure your titles use a consistent chapter format (e.g. 1.1, 1.2)

- ❓ **Videos didn’t change order?**
  - Playlist might be loaded dynamically — click Apply again after loading

- 🛠 Try these general fixes:
  - Refresh the YouTube page  
  - Reload extension in `chrome://extensions/`  
  - Check Developer Console for errors

---

## ✅ Browser Support

- ✅ Chrome 88+ (Manifest V3 required)  
- ✅ Microsoft Edge (Chromium-based)  
- ✅ Other Chromium-based browsers  

---

## 🎯 Who Can Use This?

- **Educators**: Sort chapters of a lecture series  
- **YouTubers**: Publish playlists in viewer-friendly order  
- **Students**: Arrange tutorials by topic or time  
- **Anyone**: Take control of how playlists play  

---

## 🔒 Privacy & Security

✅ Everything stays in your browser  
✅ No tracking or external server communication  
✅ YouTube’s servers are never modified  

---

## 🧪 Dev Setup

1. Clone the repo  
2. Visit `chrome://extensions/`  
3. Enable Dev Mode → Load Unpacked  
4. Select the extension folder  
5. Refresh YouTube and test 🎯

---

## 📝 License

© 2025 D S S Chaitanya Raju  
Free to use, customize, and share with attribution.  
See full terms in [license.txt](license.txt).

---

**Happy Sorting! 🎵📋**  
