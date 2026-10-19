# Stability regression procedure

## Automated checks

Run `npm ci`, then `npm run verify`. The asset verifier intentionally fails for any path referenced by either asset manifest that is missing or zero bytes.

## Deploy twice, reload an old tab

1. Deploy commit A to a Vercel preview and open it in a normal browser tab. Wait until the game shell and its CSS are loaded; leave this tab open.
2. Deploy commit B with a changed build (the generated Vite asset hashes and service-worker build hash should differ).
3. Without closing the old tab, reload it. In DevTools → Network, preserve the log; do not clear site data or unregister the service worker before this test.
4. Confirm document navigation is requested from the network first. If offline, the worker may fall back to cached `/index.html`.
5. Confirm the active worker uses new `allvideo-shell-<build-hash>` and `allvideo-audio-<build-hash>` cache names, and old `allvideo-*` caches are removed on activation.
6. Confirm no stale hashed `GameShell-*.css` request fails. If Vite dispatches `vite:preloadError`, the app may reload once; a repeated failure must not cause a reload loop.
7. Check the console and Network panel for failed requests, then tap/click once and verify the soundtrack begins playing. Audio playback is not considered verified until observed in a real browser.

## Expected result

After the second deployment, the old tab should obtain current HTML on navigation and the new HTML should reference current hashed assets. Offline navigation may use the last cached shell; that fallback is not a substitute for validating online deployment updates.
