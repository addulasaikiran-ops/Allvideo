import { PLAYER_CONFIG } from './player/player.config.js';
export const PHYSICS=Object.freeze({moveSpeed:PLAYER_CONFIG.moveSpeed,jumpSpeed:PLAYER_CONFIG.jumpVelocity,gravity:PLAYER_CONFIG.gravity,groundY:PLAYER_CONFIG.groundY,worldStart:PLAYER_CONFIG.worldStart,worldEnd:PLAYER_CONFIG.worldEnd});
export function createPlayerState(){return{x:-6,y:0,velocityX:0,velocityY:0,grounded:true,facing:1,checkpointX:-6,checkpointY:0,checkpointId:'start',respawnFlash:0,
 coyoteTimer:PLAYER_CONFIG.coyoteTime,jumpBuffer:0,jumpHoldTimer:0,jumpsUsed:0,animationState:'idle',animationTime:0,squash:1,stretch:1,pulseTimer:0,pulseCooldown:0,pulseRadius:0,landDip:0,landingTimer:0,footstepTimer:0,heartsCollected:0,trailScale:PLAYER_CONFIG.trailBaseScale,deathTimer:0,hurtTimer:0,restTimer:0,victory:false,events:[]};}
const approach=(v,t,a)=>v<t?Math.min(v+a,t):Math.max(v-a,t),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const emit=(p,type,detail={})=>p.events.push({type,...detail});
export function stepPlayer(p,input,deltaSeconds,assistMode=false,config=PLAYER_CONFIG,platforms=[]){
 const dt=Math.min(Math.max(deltaSeconds,0),1/30);p.events=[];p.animationTime+=dt;
 p.pulseCooldown=Math.max(0,p.pulseCooldown-dt);p.pulseTimer=Math.max(0,p.pulseTimer-dt);p.pulseRadius=p.pulseTimer>0?config.pulseRadius*(1-p.pulseTimer/config.pulseDuration):0;
 p.landDip=Math.max(0,p.landDip-dt);p.landingTimer=Math.max(0,p.landingTimer-dt);p.hurtTimer=Math.max(0,p.hurtTimer-dt);p.respawnFlash=Math.max(0,p.respawnFlash-dt);
 p.jumpBuffer=input.jumpPressed?config.jumpBufferTime:Math.max(0,p.jumpBuffer-dt);
 if(input.pulsePressed&&p.pulseCooldown<=0){p.pulseCooldown=config.pulseCooldown;p.pulseTimer=config.pulseDuration;p.animationState='pulse';emit(p,'warm-light:pulse',{x:p.x,y:p.y,radius:config.pulseRadius});}
 if(input.restPressed&&p.grounded)p.restTimer=.7;else p.restTimer=Math.max(0,p.restTimer-dt);
 if(input.victoryPressed)p.victory=true;
 if(p.deathTimer>0){p.deathTimer=Math.max(0,p.deathTimer-dt);p.velocityX=approach(p.velocityX,0,config.groundFriction*dt);if(p.deathTimer===0){p.x=p.checkpointX;p.y=p.checkpointY??config.groundY;p.velocityX=0;p.velocityY=0;p.grounded=true;p.jumpsUsed=0;p.respawnFlash=config.respawnBurstDuration;p.animationState='idle';emit(p,'player:respawn',{checkpointId:p.checkpointId});}return p;}
 const wasGrounded=p.grounded,axis=clamp(input.horizontal??0,-1,1);
 if(axis){const reversing=Math.sign(axis)!==Math.sign(p.velocityX)&&Math.abs(p.velocityX)>.1;p.velocityX=approach(p.velocityX,axis*config.moveSpeed,(p.grounded?config.groundAcceleration:config.airAcceleration)*dt*(reversing?config.directionChangeBoost:1));p.facing=Math.sign(axis);}
 else p.velocityX=approach(p.velocityX,0,(p.grounded?config.groundFriction:config.airFriction)*dt);
 p.x=clamp(p.x+p.velocityX*dt,config.worldStart,config.worldEnd);
 if(p.grounded){p.coyoteTimer=config.coyoteTime;p.jumpsUsed=0;}else p.coyoteTimer=Math.max(0,p.coyoteTimer-dt);
 if(p.jumpBuffer>0&&(p.grounded||p.coyoteTimer>0)){p.velocityY=config.jumpVelocity*(assistMode?1.16:1);p.grounded=false;p.jumpsUsed=1;p.coyoteTimer=0;p.jumpBuffer=0;p.jumpHoldTimer=0;p.apexHangTimer=0;p.animationState='jump';p.stretch=1+config.jumpStretch;p.squash=1;emit(p,'player:jump',{kind:'first'});}
 else if(p.jumpBuffer>0&&!p.grounded&&p.jumpsUsed===1){p.velocityY=config.doubleJumpVelocity;p.jumpsUsed=2;p.jumpBuffer=0;p.jumpHoldTimer=0;p.apexHangTimer=0;p.animationState='double-jump';p.stretch=1+config.jumpStretch*1.15;emit(p,'player:jump',{kind:'double'});}
 if(!p.grounded){
  const rising=p.velocityY>0,holding=input.jumpHeld&&p.jumpHoldTimer<config.jumpHoldMaxTime;
  if(holding&&rising)p.jumpHoldTimer+=dt;
  const nearApex=Math.abs(p.velocityY)<config.apexVelocityThreshold;
  if(nearApex)p.apexHangTimer=Math.min(config.apexHangTime,(p.apexHangTimer??0)+dt);else if(p.velocityY< -config.apexVelocityThreshold)p.apexHangTimer=0;
  let gravityScale=p.velocityY<0?config.fallGravityMultiplier:1;
  if(!input.jumpHeld&&rising)gravityScale=config.jumpCutGravityMultiplier;else if(holding&&rising)gravityScale*=config.jumpHoldGravityScale;
  if(nearApex&&p.apexHangTimer<config.apexHangTime)gravityScale*=.08;
  p.velocityY=Math.max(-config.maxFallSpeed,p.velocityY-config.gravity*gravityScale*dt);
  const previousY=p.y;p.y+=p.velocityY*dt;let landed=null;
  if(p.velocityY<=0&&previousY>=config.groundY&&p.y<=config.groundY)landed={surface:'meadow',y:config.groundY};
  if(p.velocityY<=0)for(const plat of platforms){const left=plat.x-plat.width/2,right=plat.x+plat.width/2;if(p.x>=left&&p.x<=right&&previousY>=plat.y&&p.y<=plat.y&&previousY-plat.y<config.platformSnapTolerance+Math.abs(p.velocityY)*dt){if(!landed||plat.y>landed.y)landed={surface:plat.surface??'stone',y:plat.y};}}
  if(landed){p.y=landed.y;p.velocityY=0;p.grounded=true;p.jumpsUsed=0;p.landingTimer=.18;p.squash=1-config.landingSquash;p.stretch=1+config.landingSquash*.35;p.landDip=config.cameraLandDip;p.footstepTimer=0;p.animationState='land';emit(p,'player:land',{surface:landed.surface,soft:Math.abs(previousY-p.y)<=config.softLandingSpeed*dt+.15});emit(p,'effects:dust',{count:config.dustCount,surface:landed.surface});}
 } else if(wasGrounded&&Math.abs(p.velocityX)>.1){p.footstepTimer-=dt;if(p.footstepTimer<=0){const surf=platforms.find(a=>p.x>=a.x-a.width/2&&p.x<=a.x+a.width/2)?.surface??'meadow';emit(p,'player:footstep',{surface:surf,x:p.x});p.footstepTimer=config.footstepInterval;}}
 if(p.y<config.deathY){p.deathTimer=Math.min(config.respawnDuration,.95);p.animationState='hurt';p.respawnFlash=config.respawnBurstDuration;p.velocityX=0;p.velocityY=0;p.grounded=false;emit(p,'player:death-burst',{x:p.x,y:p.y});}
 if(p.checkpointId==='start'&&p.x>=2){p.checkpointId='meadow';p.checkpointX=2;p.checkpointY=config.groundY;emit(p,'checkpoint:reached',{checkpointId:'meadow'});}
 if(p.checkpointId!=='lantern-bridge'&&p.x>=12){p.checkpointId='lantern-bridge';p.checkpointX=12;p.checkpointY=config.groundY;emit(p,'checkpoint:reached',{checkpointId:'lantern-bridge'});}
 p.trailScale=Math.min(config.maxTrailScale,config.trailBaseScale+Math.min(p.heartsCollected,config.heartCountForTrail)*config.trailPerHeart);
 if(p.victory)p.animationState='victory';else if(p.restTimer>0)p.animationState='rest';else if(p.pulseTimer>0)p.animationState='pulse';else if(p.landingTimer>0)p.animationState='land';else if(!p.grounded)p.animationState=p.velocityY>.25?(p.jumpsUsed===2?'double-jump':'jump'):'fall';else p.animationState=Math.abs(p.velocityX)>.3?'run':'idle';
 p.squash=approach(p.squash,1,7*dt);p.stretch=approach(p.stretch,1,7*dt);return p;
}
