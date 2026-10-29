# Mindful Moments — Mental Health Support Website

A beginner-friendly college/internship project made with HTML, CSS, and JavaScript.

## Pages
- `index.html` — Home
- `about.html` — About the project
- `resources.html` — Self-help resources
- `dashboard.html` — Mood tracker and guided breathing exercise
- `style.css` — Shared visual design and responsive layout
- `script.js` — Navigation, mood tracker, local browser storage, and breathing timer

## Run it on your computer
1. Download and extract this project ZIP.
2. Install Visual Studio Code from https://code.visualstudio.com/.
3. In VS Code, choose **File → Open Folder** and select the extracted `mindful-moments-website` folder.
4. Open `index.html`.
5. If you have the Live Server extension installed, right-click `index.html` and choose **Open with Live Server**. Otherwise, double-click `index.html` in File Explorer to open it in a browser.
6. Click through the navigation and test the mood tracker and breathing exercise on the Dashboard.

## Publish using GitHub Pages
1. Create/sign in to GitHub at https://github.com/.
2. Click **New repository**. Name it `mindful-moments-website`. For a public class project, choose Public unless your instructor says otherwise.
3. Create the repository.
4. On the repository page, choose **Add file → Upload files**.
5. Upload the six project files (`index.html`, `about.html`, `resources.html`, `dashboard.html`, `style.css`, `script.js`) and this README. If uploading a ZIP, extract it first so `index.html` is at the repository's top level.
6. Click **Commit changes**.
7. Open **Settings → Pages**. Under the build/deployment source, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
8. Wait a minute or two and refresh the Pages screen. GitHub will show your website URL. Open it and test all four pages.

## Important limitations
- Mood entries are stored in `localStorage` in the current browser on the current device. They are not synced between devices and are not suitable for highly sensitive personal information.
- This is an educational self-help website, not a diagnosis, therapy, or crisis service.
- No real user accounts or server/database are included in this beginner version.
