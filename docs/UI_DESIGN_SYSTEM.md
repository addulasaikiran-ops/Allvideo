# UI Design System

The React UI uses semantic CSS custom properties and CSS Modules. The visual language combines storybook display typography, humanist sans-serif controls, ink surfaces, frosted-glass panels, mint progress, and amber focus accents.

## Typography
- `--font-display` is a serif display stack; `--font-body` is the HUD/body stack.
- Counters use tabular numerals.
- This repository avoids remote font requests. Add licensed source fonts under `assets/fonts/source/`, run `npm run fonts:subset` (requires FontTools with WOFF2 support), and add `@font-face` declarations for checked-in output in `public/fonts/`.
- Font attribution/licensing should accompany committed font assets.

## Components
`src/ui/design-system.jsx` exports Button, Panel, Slider, Toggle, Tabs, Modal, ToastProvider/useToast, ProgressBar, IconButton, Tooltip, HeartMeter, LoadingScreen, TitleScreen and ScreenOutlet. The modal traps keyboard focus, closes with Escape, and restores focus. Toasts use a polite live region. Tabs expose tablist/tab/selected semantics.

## Screens and loading
ScreenOutlet uses React.lazy for chapter select, settings, memory gallery, credits, error, offline and rotate-device screens. The app entry lazy-loads GameShell inside ErrorBoundary.

## Accessibility
Visible keyboard focus, reduced-motion/high-contrast media queries, polite live regions, touch targets, safe-area-aware layouts, and semantic dialog/tab/progress roles are part of the system. Keep ordinary transitions below 500ms; cinematic sequences must be skippable.