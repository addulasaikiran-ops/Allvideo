/** Bridge engine state to a throttled UI snapshot; simulation never waits for React. */
export function createStoreBridge({store,eventBus,input,intervalMs=100,setTimer=globalThis.setTimeout?.bind(globalThis),clearTimer=globalThis.clearTimeout?.bind(globalThis),now=()=>Date.now()}={}){
 if(!store?.getState||!store?.subscribe)throw new TypeError('Store bridge requires an external store.');
 const listeners=new Set();let timer=null,dirty=true,lastPublish=0,disposed=false;
 let snapshot=selectSnapshot(store.getState(),input);
 function publish(force=false){
  if(disposed||(!force&&!dirty))return;const current=now();
  if(!force&&current-lastPublish<intervalMs&&typeof setTimer==='function'){
   if(timer===null)timer=setTimer(()=>{timer=null;publish(true);},intervalMs-(current-lastPublish));return;
  }
  snapshot=selectSnapshot(store.getState(),input);dirty=false;lastPublish=current;
  for(const listener of [...listeners])listener();
 }
 const unsubscribeStore=store.subscribe(()=>{dirty=true;publish();});
 const unsubscribeInput=eventBus?.on?.('input:device',()=>{dirty=true;publish();});
 return {
  getSnapshot:()=>snapshot,
  subscribe(listener){listeners.add(listener);return()=>listeners.delete(listener);},
  flush(){if(timer!==null&&typeof clearTimer==='function')clearTimer(timer);timer=null;publish(true);},
  dispose(){disposed=true;unsubscribeStore();unsubscribeInput?.();if(timer!==null&&typeof clearTimer==='function')clearTimer(timer);timer=null;listeners.clear();},
 };
}
function selectSnapshot(state,input){
 const player=state.player??{};
 return Object.freeze({
  hearts:state.hearts??state.save?.hearts??3,hp:state.hp??state.save?.hp??3,
  chapter:state.chapter??state.save?.chapter??'chapter-01',dialogue:state.dialogue??null,
  paused:state.status==='Paused'||state.status==='paused'||Boolean(state.paused),
  inputDevice:input?.device??state.inputDevice??'keyboard',status:state.status??'Boot',
  checkpointId:state.checkpointId??player.checkpointId??'start',elapsedSeconds:state.elapsedSeconds??0,
 });
}
