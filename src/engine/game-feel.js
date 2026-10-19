/** Optional event-driven game-feel feedback; simulation remains authoritative. */
const JUICE = Object.freeze({ Off: 0, Low: 0.35, Full: 1 });
const IMPACTS = new Set(['player:land', 'hazard:contact', 'enemy:calmed', 'knot:untangled']);
const PARTICLES = new Set(['warm-light:pulse', 'checkpoint:reached', 'collectible:collected', 'knot:untangled', 'bridge:formed']);
function rumble(scale) { try { for (const pad of (globalThis.navigator?.getGamepads?.() ?? [])) { const actuator=pad?.vibrationActuator; if (actuator?.playEffect) actuator.playEffect('dual-rumble',{duration:45+35*scale,strongMagnitude:0.25*scale,weakMagnitude:0.45*scale}); else if (actuator?.pulse) actuator.pulse(0.35*scale,55); } } catch { /* Optional browser/device capability. */ } }
function touchBuzz(scale) { try { if (globalThis.navigator?.vibrate && scale>0) globalThis.navigator.vibrate(Math.round(12+12*scale)); } catch { /* Optional browser/device capability. */ } }
export function createGameFeel({eventBus,getJuice=()=> 'Full',reducedMotion=false,onEffect=()=>{},onHitStop=()=>{},onSlowMoment=()=>{}}={}) {
 if(!eventBus?.on) throw new TypeError('Game feel requires an event bus.');
 const offs=[]; const scale=()=>reducedMotion?0:(JUICE[getJuice()]??1);
 const effect=(type,event={})=>{const amount=scale();if(amount<=0)return;onEffect({type,x:event.x,y:event.y,shake:(type==='player:land'||type==='hazard:contact')&&amount>=0.3,particles:PARTICLES.has(type),label:type==='collectible:collected'?'+1':''});if(IMPACTS.has(type)){onHitStop((type==='hazard:contact'?0.075:0.045)*amount);rumble(amount);}else if(['collectible:collected','checkpoint:reached','warm-light:pulse'].includes(type))rumble(amount*0.75);};
 for(const type of new Set([...IMPACTS,...PARTICLES,'player:jump','mirror:boss-cracked','rest:activated','dialogue:trigger'])) offs.push(eventBus.on(type,event=>{if(['dialogue:trigger','rest:activated','mirror:boss-cracked'].includes(type)){if(type!=='dialogue:trigger'&&!reducedMotion&&scale()>0){onEffect({type:'emotional-beat',slow:true,particles:false,shake:false});onSlowMoment(0.45,0.68);}return;}effect(type,event);}));
 const pointer=e=>{if(e.pointerType==='touch'&&e.target?.closest?.('[aria-label="Move left"],[aria-label="Move right"],[aria-label="Jump"],[aria-label="Warm Light pulse"]'))touchBuzz(scale());};
 globalThis.window?.addEventListener?.('pointerdown',pointer,{passive:true});
 return {destroy(){offs.forEach(off=>off());globalThis.window?.removeEventListener?.('pointerdown',pointer);}};
}
