/** All controller tuning values live here. Times are seconds; distances are world units. */
export const PLAYER_CONFIG = Object.freeze({
 moveSpeed:5.4, groundAcceleration:34, airAcceleration:17, groundFriction:42, airFriction:2.4, directionChangeBoost:1.18,
 jumpVelocity:8.9, doubleJumpVelocity:8.1, gravity:23, fallGravityMultiplier:1.32, jumpCutGravityMultiplier:2.15, maxFallSpeed:15,
 coyoteTime:.1, jumpBufferTime:.12, apexHangTime:.095, apexVelocityThreshold:1.15, jumpHoldGravityScale:.62, jumpHoldMaxTime:.18,
 softLandingSpeed:5.5, landingSquash:.2, jumpStretch:.13,
 pulseCooldown:.65, pulseRadius:3.2, pulseDuration:.42, pulseLightIntensity:2.2,
 deathY:-5.5, respawnDuration:.72, respawnBurstDuration:.42, cameraLandDip:.22, cameraLandDipDuration:.18,
 dustCount:7, footstepInterval:.29, trailBaseScale:.65, trailPerHeart:.12, maxTrailScale:1.8, heartCountForTrail:8,
 worldStart:-10, worldEnd:54, groundY:0, platformSnapTolerance:.28
});
export const PLAYER_CONFIG_LIMITS=Object.freeze({
 moveSpeed:[2,9],groundAcceleration:[5,70],airAcceleration:[2,45],groundFriction:[5,80],airFriction:[0,12],
 jumpVelocity:[5,13],doubleJumpVelocity:[4,12],gravity:[10,38],fallGravityMultiplier:[1,2.5],jumpCutGravityMultiplier:[1,4],
 coyoteTime:[0,.2],jumpBufferTime:[0,.25],apexHangTime:[0,.22],pulseCooldown:[.2,2],pulseRadius:[1,7],
 softLandingSpeed:[1,10],landingSquash:[0,.35],jumpStretch:[0,.3],respawnDuration:[.25,1],cameraLandDip:[0,.6],footstepInterval:[.12,.6]
});