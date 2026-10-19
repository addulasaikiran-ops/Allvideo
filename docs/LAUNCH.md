# Allvideo pre-launch checklist

Use this list for the final release pass. Check items only after validating them on the deployed target.

## Build and repository
- [ ] Pull the intended release commit and install dependencies from the lockfile.
- [ ] Run `npm run lint`, `npm test`, and `npm run build`.
- [ ] Review browser console, failed requests, and bundle output on desktop and mobile.
- [ ] Confirm there are no private photos, secrets, tokens, or unlicensed assets in the release.

## PWA and offline
- [ ] Serve over HTTPS and verify `/manifest.webmanifest`, icon URLs, and `/sw.js`.
- [ ] Verify installation where supported; test iOS Safari Add to Home Screen separately.
- [ ] Visit online, load a chapter and audio, then use airplane mode to test shell and previously requested audio.
- [ ] Confirm a new deployment shows the update toast and reloads cleanly after approval.
- [ ] Check cache refresh and old-cache cleanup after two consecutive deployments.

## Vercel
- [ ] Confirm the project is linked to the intended Git repository and production branch is `main`.
- [ ] Verify SPA fallback, asset cache headers, HTML revalidation, and custom 404 behavior.
- [ ] Enable Preview Deployments for pull requests in Vercel project settings and verify a PR receives a preview URL.
- [ ] Set only environment variables actually needed; this static build currently requires none.
- [ ] Decide whether to enable Vercel Web Analytics only after explicit owner consent.
- [ ] Test final public URL, canonical host, robots policy, Open Graph preview, and social-card image.

## Gameplay, accessibility, and safety
- [ ] Test keyboard, touch, landscape phones, safe areas, and reduced-motion mode.
- [ ] Test assist toggles, checkpoint respawn, audio controls, Photo Mode, and New Game+.
- [ ] Check focus visibility, semantic labels, contrast, and screen-reader navigation.
- [ ] Test fresh storage and returning-player storage.
- [ ] Confirm the gift moment and all personal messages/photos are correct and approved.

## Release and rollback
- [ ] Capture screenshots on supported browsers/devices and verify social sharing in a link preview debugger.
- [ ] Verify production deployment and record deployment URL and commit.
- [ ] Keep the previous healthy deployment available for rollback.
- [ ] Confirm an owner for post-launch fixes and feedback.
