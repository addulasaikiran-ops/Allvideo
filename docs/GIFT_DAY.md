# Gift day: a calm, lovely handoff

The goal is to make the game feel like a small shared moment, not a tech demo. Give the recipient room to explore, and let them choose how much help they want.

## Before the moment

- **Best device:** use a laptop or desktop with a modern Chrome, Edge, or Firefox browser for the first play. A larger screen makes the 2.5D world, text, and controls easier to see. If the recipient prefers a phone, test the exact phone/browser in advance and have a charger and a stable stand ready.
- **Headphones:** offer comfortable headphones, not as a requirement. Set volume low before starting, then let them adjust. Confirm audio is audible without drowning out conversation; keep a speaker option available.
- **Time of day:** choose a quiet, unhurried window—often early evening after obligations, or a relaxed weekend afternoon. Avoid a rushed departure, a noisy gathering, or a time when the recipient must immediately multitask. The right time is when they can comfortably say “pause” or stop.
- **Room and comfort:** sit nearby only if they want company. Keep lighting comfortable and screen glare low. Let them know they can take breaks, skip dialogue, use assist options, or hand over the controls.
- **Content check:** run through the opening and ending yourself. Verify every name, caption, date, photo, and personal note; remove anything that feels too private or not quite right. Do not commit private photos to a public repository unless you deliberately choose to publish them.

## Test the link before sharing

1. Open the intended **production** URL in a fresh private/incognito window on the device you plan to use.
2. Confirm the title screen appears, the main button starts play, movement and jump work, the first audio cue plays after a user gesture, and the first chapter loads without a console error.
3. Check the ending and any gift-specific note. Verify links do not point to a preview deployment that may expire or be access-restricted.
4. If the recipient should have a private moment, configure and test Vercel Deployment Protection before the day. Password protection (if available on the plan) adds a password step; team-login protection requires the recipient to have account access; a bypass URL behaves like a secret bearer credential. An unlisted URL is not private. Send passwords separately from the URL and avoid placing personal content on an unprotected public deployment.
5. Keep the production URL copied into a note on your phone and another trusted device, so you can resend it without searching.

## How to send the link

- Send a short, personal message with the URL by the channel the recipient normally uses (for example, their usual messaging app or email). Keep the message warm and low-pressure: “I made a little world for you. Find a quiet moment, open this link, and take it at your own pace. Headphones are lovely but optional. No need to finish it in one sitting.”
- If you want the surprise to land in person, send the link when you are together and let them open it themselves. Avoid describing every feature or explaining the story before they experience it.
- Tell them the practical basics only: use a modern browser, sound is optional, and they can pause or use assist settings. Don’t turn the first minute into a tutorial.
- Ask before sharing screenshots or recording their reaction. Their response is theirs; do not make the gift depend on a particular reaction.

## First minute: stay quiet and observe

Let the recipient read the title screen and choose when to begin. Resist coaching. Notice whether the first instruction is understood, whether controls feel discoverable, whether text is readable at their distance, and whether they look delighted, confused, or overloaded. If they ask for help, offer one small hint rather than taking over.

## If the internet fails: offline PWA fallback

**Offline mode is best-effort, not guaranteed on a first visit.** The browser must first load the deployed app online so the service worker can cache the shell. Audio is cached after a successful request, so audio not yet played may not be available offline.

Before gift day:

1. On the actual recipient device and browser, visit the production URL while online.
2. Wait for the game to load fully. Start a chapter, allow the opening audio to play, and visit any scenes that matter to the gift. This warms the cache for requested assets/audio.
3. If supported, install the PWA or add it to the Home Screen. Installation alone does not guarantee every asset is cached.
4. With the app still open, test airplane mode or disable Wi-Fi, then reload and confirm the shell and the previously visited parts work. Restore connectivity after the test.
5. If the offline test fails, do not promise offline play. Prepare a phone hotspot or second known-good connection.

If the internet fails during the gift:

- If the app is already loaded, **don’t close the tab**. Let the recipient continue in the current session if it remains playable.
- If it was installed or previously visited, try reopening the app once; if it fails, reconnect or use a hotspot. Avoid repeatedly clearing site data or uninstalling the PWA, as that can remove cached resources.
- If neither connection nor cached play works, switch gracefully to the backup: show a few approved screenshots, read the note together, or say “we’ll open the world when the connection is back.” The gift is the thought and time, not a perfect network.

## After the gift

Give them space to talk or not talk. Ask one open question such as “What part stayed with you?” rather than fishing for praise. If they want to replay it, point out Chapters, Memories, Photo Mode, and optional assist settings without turning them into homework. Save feedback for another time unless they volunteer it.

---

## Owner's day-of checklist

- [ ] Production link tested on the actual device/browser.
- [ ] Correct names, photos, captions, and ending checked.
- [ ] Audio volume starts at a comfortable level; headphones are optional.
- [ ] Stable connection available; hotspot ready.
- [ ] Offline fallback tested on this device, or described honestly as unverified.
- [ ] Private deployment protection tested if the gift is meant to be private.
- [ ] Recipient has permission to pause, skip, use assists, or stop at any time.
