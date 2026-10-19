# Player Feel Tuning

All controller values live in `src/engine/player/player.config.js`. The F2 panel edits a live copy for this session; refresh restores defaults. Times are seconds, distances are world units, and multipliers are unitless.

## Movement
- `moveSpeed`: target horizontal speed.
- `groundAcceleration` / `airAcceleration`: responsiveness on ground/in air; higher is snappier.
- `groundFriction` / `airFriction`: braking when no direction is held. Low air friction preserves momentum.
- `directionChangeBoost`: extra acceleration while reversing direction.
- `worldStart` / `worldEnd`: horizontal bounds.

## Jump
- `jumpVelocity`: first-jump upward velocity; `doubleJumpVelocity`: second-jump upward velocity.
- `gravity`: base downward acceleration.
- `fallGravityMultiplier`: extra gravity while falling.
- `jumpCutGravityMultiplier`: stronger gravity after releasing jump early for a short hop.
- `jumpHoldGravityScale` / `jumpHoldMaxTime`: reduced gravity while holding jump, and maximum time for that effect.
- `maxFallSpeed`: terminal downward velocity.
- `coyoteTime`: grace after leaving a ledge; default 0.1s (100ms).
- `jumpBufferTime`: remember a jump pressed shortly before landing; default 0.12s (120ms).
- `apexHangTime`: intended extra float around the jump apex.
- `apexVelocityThreshold`: vertical speed considered near the apex.

## Landings and motion
- `softLandingSpeed`: threshold used to tag soft landings.
- `landingSquash`: squash on impact and related counter-stretch.
- `jumpStretch`: stretch on takeoff and double-jump.
- `cameraLandDip` / `cameraLandDipDuration`: camera dip strength and recovery time.

## Warm Light and juice
- `pulseCooldown`: time before Warm Light can pulse again.
- `pulseRadius`: maximum ring radius.
- `pulseDuration`: expansion/fade time.
- `pulseLightIntensity`: target intensity for the pulse glow.
- `dustCount`: landing dust particle count.
- `footstepInterval`: time between footstep events.
- `trailBaseScale`: glow size with zero hearts.
- `trailPerHeart`: size added per collected heart.
- `maxTrailScale`: cap on trailing glow.
- `heartCountForTrail`: number of hearts counted toward the cap.

## Recovery and platforms
- `deathY`: falling below this height triggers a gentle light-burst and respawn.
- `respawnDuration`: recovery delay, kept below one second.
- `respawnBurstDuration`: length of the burst effect.
- `groundY`: base meadow surface.
- `platformSnapTolerance`: forgiving platform-top crossing tolerance.

## Feel-test room
Choose **Feel test room** in-game for close, medium, long, high, and double-jump platforms. F2 opens the live tuning panel; values apply immediately. Arrows/A-D move, Space/W/Up jump, Shift or E emits Warm Light, R rests, and V strikes a victory pose.
