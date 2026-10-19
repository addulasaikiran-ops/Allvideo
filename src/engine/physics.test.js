import { describe, expect, it } from 'vitest';
import { createPlayerState, stepPlayer } from './physics.js';
import { PLAYER_CONFIG } from './player/player.config.js';

const idle={horizontal:0,jumpPressed:false,jumpHeld:false,pulsePressed:false,restPressed:false,victoryPressed:false};
describe('premium player controller',()=>{
 it('accelerates smoothly and records checkpoints',()=>{const p=createPlayerState();stepPlayer(p,{...idle,horizontal:1},1/30);expect(p.x).toBeGreaterThan(-6);expect(p.velocityX).toBeGreaterThan(0);p.x=2.1;stepPlayer(p,idle,1/60);expect(p.checkpointId).toBe('meadow');});
 it('supports variable-height jump and a double jump',()=>{const p=createPlayerState();stepPlayer(p,{...idle,jumpPressed:true,jumpHeld:true},1/60);expect(p.grounded).toBe(false);expect(p.y).toBeGreaterThan(0);stepPlayer(p,{...idle,jumpPressed:true},1/60);expect(p.jumpsUsed).toBe(2);expect(p.events.some(e=>e.type==='player:jump'&&e.kind==='double')).toBe(true);});
 it('allows coyote time and buffers jumps',()=>{const p=createPlayerState();p.grounded=false;p.y=.1;p.coyoteTimer=PLAYER_CONFIG.coyoteTime;stepPlayer(p,{...idle,jumpPressed:true},1/60);expect(p.velocityY).toBeGreaterThan(0);});
 it('emits a Warm Light pulse and honors its cooldown',()=>{const p=createPlayerState();stepPlayer(p,{...idle,pulsePressed:true},1/60);expect(p.events.some(e=>e.type==='warm-light:pulse')).toBe(true);expect(p.pulseCooldown).toBeGreaterThan(0);stepPlayer(p,{...idle,pulsePressed:true},1/60);expect(p.events.some(e=>e.type==='warm-light:pulse')).toBe(false);});
 it('respawns gently in less than one second',()=>{const p=createPlayerState();p.y=PLAYER_CONFIG.deathY-.1;stepPlayer(p,idle,1/60);expect(p.deathTimer).toBeLessThan(1);expect(p.events.some(e=>e.type==='player:death-burst')).toBe(true);});
 it('lands on a platform and emits surface-aware effects',()=>{const p=createPlayerState();p.x=4;p.y=1.3;p.grounded=false;p.velocityY=-3;stepPlayer(p,idle,1/30, false,PLAYER_CONFIG,[{x:4,y:1.2,width:3,surface:'moss'}]);expect(p.grounded).toBe(true);expect(p.events.some(e=>e.type==='player:land'&&e.surface==='moss')).toBe(true);});
});
