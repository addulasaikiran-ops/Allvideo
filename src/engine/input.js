const DEFAULT_BINDINGS=Object.freeze({
 left:{keys:['ArrowLeft','KeyA'],axis:-1},right:{keys:['ArrowRight','KeyD'],axis:1},
 jump:{keys:['Space','ArrowUp','KeyW'],gamepadButtons:[0]},pause:{keys:['Escape','KeyP'],gamepadButtons:[9]},
 interact:{keys:['KeyE','Enter'],gamepadButtons:[2]},pulse:{keys:['ShiftLeft','ShiftRight','KeyE']},
 rest:{keys:['KeyR']},victory:{keys:['KeyV']},
});
export function createInput({target=globalThis.window,getGamepads=()=>globalThis.navigator?.getGamepads?.()??[],bufferSeconds=.12,onDeviceChange=()=>{}}={}){
 const bindings=new Map(Object.entries(DEFAULT_BINDINGS).map(([k,v])=>[k,{keys:[...(v.keys??[])],gamepadButtons:[...(v.gamepadButtons??[])],axis:v.axis}]));
 const downKeys=new Set(),buffers=new Map(),listeners=[],deviceListeners=new Set();
 let device='keyboard',touchAxis=0,touchJumpDown=false,previousGamepadButtons=new Set(),destroyed=false;
 function setDevice(next){if(device===next)return;device=next;onDeviceChange(next);for(const fn of [...deviceListeners])fn(next);}
 function actionsForKey(code){return [...bindings].filter(([,b])=>b.keys.includes(code)).map(([a])=>a);}
 function press(action){buffers.set(action,Math.max(bufferSeconds,buffers.get(action)??0));}
 function keydown(event){setDevice('keyboard');if([...bindings.values()].some(b=>b.keys.includes(event.code))||event.code==='F2')event.preventDefault?.();if(downKeys.has(event.code))return;downKeys.add(event.code);actionsForKey(event.code).forEach(press);}
 function keyup(event){downKeys.delete(event.code);}
 function blur(){downKeys.clear();touchAxis=0;touchJumpDown=false;buffers.clear();previousGamepadButtons.clear();}
 function listen(type,fn){if(!target?.addEventListener)return;target.addEventListener(type,fn);listeners.push(()=>target.removeEventListener(type,fn));}
 listen('keydown',keydown);listen('keyup',keyup);listen('blur',blur);listen('pointerdown',e=>{if(e.pointerType==='touch')setDevice('touch');});listen('gamepadconnected',()=>setDevice('gamepad'));
 function pollGamepad(){const pad=getGamepads()?.find?.(p=>p&&p.connected!==false)??null;if(!pad){previousGamepadButtons.clear();return null;}
  const pressed=new Set();(pad.buttons??[]).forEach((b,i)=>{if(b?.pressed||b?.value>.5)pressed.add(i);});let used=false;
  for(const [action,b] of bindings)if(b.gamepadButtons.some(i=>pressed.has(i)&&!previousGamepadButtons.has(i))){press(action);used=true;}
  if(pressed.size||Math.abs(pad.axes?.[0]??0)>.2)used=true;if(used)setDevice('gamepad');previousGamepadButtons=pressed;return pad;}
 return {
  get device(){return device;},get bindings(){return Object.fromEntries([...bindings].map(([k,v])=>[k,{...v,keys:[...v.keys],gamepadButtons:[...v.gamepadButtons]}]));},
  bind(action,binding){if(!action||!binding||typeof binding!=='object')throw new TypeError('bind expects an action and binding object.');bindings.set(action,{keys:[...(binding.keys??[])],gamepadButtons:[...(binding.gamepadButtons??[])],axis:binding.axis});},
  rebindKey(action,code){if(!bindings.has(action))throw new Error(`Unknown action: ${action}`);bindings.get(action).keys=[code];},
  read(){const pad=pollGamepad(),axis=pad?.axes?.[0]??0;const keyboard=[...bindings].reduce((sum,[,b])=>b.axis===-1&&b.keys.some(k=>downKeys.has(k))?sum-1:b.axis===1&&b.keys.some(k=>downKeys.has(k))?sum+1:sum,0);
   const held=action=>bindings.get(action)?.keys.some(k=>downKeys.has(k))??false;
   return {horizontal:Math.abs(axis)>.22?Math.sign(axis):Math.max(-1,Math.min(1,keyboard||touchAxis)),jumpPressed:this.isBuffered('jump'),jumpHeld:held('jump')||touchJumpDown||Boolean(pad?.buttons?.[0]?.pressed),
    pausePressed:this.isBuffered('pause'),interactPressed:this.isBuffered('interact'),pulsePressed:this.isBuffered('pulse'),restPressed:this.isBuffered('rest'),victoryPressed:this.isBuffered('victory')};},
  advance(dt){for(const [a,remaining] of buffers){const next=remaining-Math.max(0,dt);if(next<=0)buffers.delete(a);else buffers.set(a,next);}},
  isBuffered(action){return (buffers.get(action)??0)>0;},consume(action){return buffers.delete(action);},
  setTouchAxis(value){const next=Math.max(-1,Math.min(1,Number(value)||0));if(next!==0)setDevice('touch');touchAxis=next;},
  setTouchJump(value){const next=Boolean(value);if(next&&!touchJumpDown){setDevice('touch');press('jump');}touchJumpDown=next;},
  onDeviceChange(callback){deviceListeners.add(callback);return()=>deviceListeners.delete(callback);},
  destroy(){if(destroyed)return;destroyed=true;listeners.splice(0).forEach(fn=>fn());downKeys.clear();buffers.clear();previousGamepadButtons.clear();deviceListeners.clear();touchAxis=0;touchJumpDown=false;},
 };
}
