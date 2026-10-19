# Stability regression procedure

## Automated checks — latest observed CI

Latest inspected GitHub Actions run: [Verify #416](https://github.com/addulasaikiran-ops/Allvideo/actions/runs/39254325160), run ID `39254325160`. It completed with failure at **Install dependencies** (`npm ci`); the `Verify` step was skipped. The run checked out PR merge commit `38f7c1e548b61bef130b736ffa30eeafd2870faa`, which merged head `48e04a6d50ea46cbccdc87906caee9a4926daea8` into base `20beff6a09a88abf8c8c3d9076a2d3d342813b98`.

Exact error from the job log:

```
npm error code EUSAGE
npm error The `npm ci` command can only install with an existing package-lock.json or
npm error npm-shrinkwrap.json with lockfileVersion >= 1. Run an install with npm@5 or
npm error later to generate a package-lock.json file, then try again.
...
##[error]Process completed with exit code 1.
```

The CI run did **not** reach lint, tests, asset verification, or build. Their status is **not verified** in this run; do not infer a pass or failure. At the time of this documentation update, the branch contents API also returned the zero-byte blob for `public/audio/music/cc0-cathedral-forest-loop.ogg` (SHA `e69e29bb2d1d6434b8b29ae775ad8c2e48c5391`) and returned 404 for `package-lock.json` on `step-23-stability-fixes`. Re-check the branch and a newer CI run before treating either item as resolved.

When a lockfile is visible on the PR branch, the expected CI command sequence is `npm ci` followed by `npm run verify`. The verify script runs lint, tests, asset verification, and build; the asset verifier should fail for manifest paths that are missing or zero bytes.

## Deploy twice, reload an old tab

This browser regression procedure has **not been verified against the Vercel preview**. The preview previously redirected to Vercel authentication, preventing browser inspection.

1. Deploy commit A to a Vercel preview and open it in a normal browser tab. Wait until the game shell and its CSS are loaded; leave this tab open.
2. Deploy commit B with a changed build (the generated Vite asset hashes and service-worker build hash should differ).
3. Without closing the old tab, reload it. In DevTools → Network, preserve the log; do not clear site data or unregister the service worker before this test.
4. Confirm document navigation is requested from the network first. If offline, the worker may fall back to cached `/index.html`.
5. Confirm the active worker uses new `allvideo-shell-<build-hash>` and `allvideo-audio-<build-hash>` cache names, and old `allvideo-*` caches are removed on activation.
6. Confirm no stale hashed `GameShell-*.css` request fails. If Vite dispatches `vite:preloadError`, the app may reload once; a repeated failure must not cause a reload loop.
7. Check the console and Network panel for failed requests, then tap/click once and verify the soundtrack begins playing. Browser console errors, failed network requests, and audio playback after the first tap remain **not verified** until observed on the preview in a real browser.

## Expected result

After the second deployment, the old tab should obtain current HTML on navigation and the new HTML should reference current hashed assets. Offline navigation may use the last cached shell; that fallback is not a substitute for validating online deployment updates.
