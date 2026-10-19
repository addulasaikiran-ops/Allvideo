import {createStore} from './store.js';
import {createInput} from './input.js';
import {createPlayerState,stepPlayer} from './physics.js';
import {createGameLoop} from './game-loop.js';
import {createGameStateMachine} from './game-state.js';
import {createEventBus} from './event-bus.js';
import {createStoreBridge} from './store-bridge.js';

const initialState={status:'Title',elapsedSeconds:0,checkpointId:'start',assistMode:false,inputDevice:'keyboard',player:createPlayerState()};
const copyPlayer=player=>({...player});
function interpolatePlayer(previous,current,alpha){return{...current,x:previous.x+(current.x-previous.x)*alpha,y:previous.y+(current.y-previous.y)*alpha};}

/** Owns simulation lifecycle. Fixed 60Hz updates; rendering receives interpolated player state. */
export function createGameEngine({onFrame=()=>{},now=()=>globalThis.performance?.now?.()??Date.now(),inputTarget,requestFrame,cancelFrame}={}){
 const eventBus=createEventBus(),store=createStore({...initialState,player:createPlayerState()}),stateMachine=createGameStateMachine({initialState:'Title',eventBus});
 const input=createInput({target:inputTarget??globalThis.window,onDeviceChange:device=>{
  store.setState(state=>({...state,inputDevice:device}));eventBus.emit('input:device',{device});
 }});
 const uiBridge=createStoreBridge({store,eventBus,input});
 let elapsedSeconds=0,publishSecond=0,previousPlayer=copyPlayer(store.getState().player);
 stateMachine.subscribe(({current})=>store.setState(state=>({...state,status:current})));
 const loop=createGameLoop({
  now,...(requestFrame?{requestFrame}:{}),...(cancelFrame?{cancelFrame}:{}),
  update(dt){
   input.advance(dt);const current=store.getState();previousPlayer=copyPlayer(current.player);const controls=input.read();
   if(controls.pausePressed&&current.status==='Playing'){input.consume('pause');stateMachine.transition('Paused');loop.stop();return;}
   if(controls.jumpPressed)input.consume('jump');if(controls.interactPressed)input.consume('interact');
   stepPlayer(current.player,controls,dt,current.assistMode);elapsedSeconds+=dt;
   if(Math.floor(elapsedSeconds)>publishSecond){publishSecond=Math.floor(elapsedSeconds);store.setState(state=>({...state,elapsedSeconds:publishSecond,checkpointId:state.player.checkpointId}));}
  },
  render(alpha,frame){const state=store.getState();onFrame({...frame,elapsedSeconds,player:interpolatePlayer(previousPlayer,state.player,alpha),simulationPlayer:state.player,state,interpolationAlpha:alpha});},
 });
 function transition(next,metadata){
  const result=stateMachine.transition(next,metadata);
  if(['Paused','Cutscene','Title','ChapterComplete','Ending'].includes(next))loop.stop();
  else if(next==='Playing')loop.start();
  return result;
 }
 return {
  store,input,eventBus,stateMachine,uiBridge,loop,
  start(){
   const state=stateMachine.getState();
   if(state==='Title')transition('Playing',{source:'start-button'});
   else if(state==='Paused')transition('Playing',{source:'resume'});
   else if(state==='Loading')transition('Playing',{source:'load-complete'});
   else if(state!=='Playing')return;
   loop.start();
  },
  stop(){loop.stop();if(stateMachine.getState()==='Playing')stateMachine.transition('Paused',{source:'stop'});},
  transition,
  resetToCheckpoint(){
   const player=store.getState().player;player.x=player.checkpointX;player.y=0;player.velocityY=0;player.grounded=true;player.respawnFlash=.45;
   if(stateMachine.getState()==='Paused')transition('Playing',{source:'checkpoint-reset'});
   store.setState(state=>({...state,checkpointId:player.checkpointId}));
  },
  setAssistMode(enabled){store.setState(state=>({...state,assistMode:Boolean(enabled)}));},
  destroy(){loop.stop();input.destroy();uiBridge.dispose();eventBus.clear();},
 };
}
