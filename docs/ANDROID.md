# Android wrapper (Capacitor)

Allvideo is currently a Vite web app. Capacitor can package the built app for Android; this guide does not add dependencies or a native project.

## Prerequisites
- Node.js 20+ and npm.
- Android Studio with a current Android SDK and supported JDK.
- A signed release keystore stored outside the repository.

## Add Capacitor locally
After the owner approves adding `@capacitor/core`, `@capacitor/cli`, and `@capacitor/android`, run:

```sh
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli
npx cap init "Allvideo" "com.example.allvideo" --web-dir dist
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

Replace the example application ID with the final reverse-domain identifier before publishing. Keep signing credentials out of Git and configure release signing in Android Studio or CI secrets. Review target SDK and Play policy requirements at release time.

## Test before release
- Verify first launch and offline launch after a successful online visit.
- Test audio playback after a user gesture, pause/resume, orientation, safe areas, touch input, and screen-reader labels.
- Test on a physical lower/mid-range Android device.
- Confirm personal photos and audio are licensed and intentionally included.
- Build a signed release and test its install/update path; do not distribute a debug APK as production.
- A remote URL instead of bundled `dist` makes the app network-dependent and changes the security model.
