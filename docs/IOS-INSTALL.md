# Add Allvideo to an iPhone or iPad Home Screen

Allvideo can be installed as a web app from Safari when served over HTTPS.

1. Open the deployed Allvideo URL in **Safari** (not an in-app browser).
2. Tap **Share**.
3. Choose **Add to Home Screen**. If offered, enable **Open as Web App**.
4. Edit the label if desired, then tap **Add**.
5. Launch it from the new Home Screen icon. Reopen it online occasionally so the app shell and recently used audio can refresh.

Notes:
- iOS does not expose the same install prompt event as many Chromium browsers, so an in-page Install button may not appear; use the Share menu.
- Offline availability is best-effort and depends on what has already been cached. The first visit requires a network connection.
- If the icon or app name looks stale after a deployment, remove the Home Screen shortcut and add it again after visiting the updated site.
