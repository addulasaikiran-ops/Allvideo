import {createStore} from './store.js';
import {createInput} from './input.js';
import {createPlayerState,stepPlayer} from './physics.js';
import {createGameLoop} from './game-loop.js';
import {createGameStateMachine} from './game-state.js';
import {createEventBus} from './event-bus.js';
import {createStoreBridge} from './store-bridge.js';
import {createSaveSystem} from './save-system.js';
import {PLAYER_CONFIG,PLAYER_CONFIG_LIMITS} from './player/player.config.js';
import {createLevelManager} from './level-manager.js';
import chapterOne from '../levels/chapter-01.json';
const initialState={status:'Title',elapsedSeconds:0,checkpointId:'start',chapter:'chapter-01',hearts:3,hp:3,assistMode:false,inputDevice:'keyboard',player:createPlayerState(),playerTuning:{...PLAYER_CONFIG},playerDebug:false,levelDebug:false,feelTestRoom:false,levelSnapshot:null,activeHint:null,fps:0};
const copyPlayer=player=>({...player});
function interpolatePlayer(previous,current,alpha){return{...current,x:previous.x+(current.x-previous.x)*alpha,y:previous.y+(current.y-previous.y)*alpha};}
export const FEEL_TEST_PLATFORMS=[
 {x:22,y:.55,width:2.2,surface:'stone'},{x:26,y:.85,width:1.8,surface:'moss'},{x:30.8,y:.65,width:1.7,surface:'wood'},
 {x:36,y:1.6,width:2,surface:'crystal'},{x:42.2,y:1.1,width:1.8,surface:'stone'},{x:47.5,y:2.1,width:2.1,surface:'moss'},{x:52,y:.6,width:2.4,surface:'wood'}
];
export function createGameEngine({onFrame=()=>{},now=()=>globalThis.performance?.now?.()??Date.now(),inputTarget,requestFrame,cancelFrame,storage}={}){
 const eventBus=createEventBus(),store=createStore({...initialState,player:createPlayerState()}),stateMachine=createGameStateMachine({initialState:'Title',eventBus});
 const saveSystem=createSaveSystem({storage,eventBus});
 const detachAutosave=saveSystem.attachAutosave({getSaveData:()=>{const state=store.getState();return{chapter:state.chapter,checkpointId:state.player.checkpointId,hearts:state.hearts,hp:state.hp,progress:state.progress??{},settings:state.settings??{}};}});
 const input=createInput({target:inputTarget??globalThis.window,onDeviceChange:device=>{store.setState(state=>({...state,inputDevice:device}));eventBus.emit('input:device',{device});}});
 const uiBridge=createStoreBridge({store,eventBus,input});
 let elapsedSeconds=0,publishSecond=0,previousPlayer=copyPlayer(store.getState().player),fpsFrames=0,fpsElapsed=0,fps=0;
 const levelManager=createLevelManager(chapterOne,{onEvent:event=>eventBus.emit(event.type,event)});
 store.setState(state=>({...state,levelSnapshot:levelManager.getSnapshot()}));
 stateMachine.subscribe(({current})=>store.setState(state=>({...state,status:current})));
 const loop=createGameLoop({now,...(requestFrame?{requestFrame}:{}),...(cancelFrame?{cancelFrame}:{}),
 update(dt){input.advance(dt);const current=store.getState();previousPlayer=copyPlayer(current.player);const controls=input.read();
  if(controls.pausePressed&&current.status==='Playing'){input.consume('pause');stateMachine.transition('Paused');loop.stop();return;}
  for(const action of ['jump','interact','pulse','rest','victory'])if(controls[action+'Pressed'])input.consume(action);
  if(current.status==='Playing'||current.status==='Title')stepPlayer(current.player,controls,dt,current.assistMode,current.playerTuning,current.feelTestRoom?FEEL_TEST_PLATFORMS:levelManager.getPlatforms());
  const levelEvents=levelManager.update(dt,current.player,{interactPressed:controls.interactPressed,pulseActive:current.player.pulseTimer>0});
  for(const event of current.player.events??[]){eventBus.emit(event.type,event);if(event.type==='player:jump'){const skill=event.kind==='double'?'double-jump':'jump';levelManager.markSkillUsed(skill);store.setState(s=>({...s,activeHint:s.activeHint?.skill===skill?null:s.activeHint}));}if(event.type==='warm-light:pulse'){levelManager.markSkillUsed('pulse');store.setState(s=>({...s,activeHint:s.activeHint?.skill==='pulse'?null:s.activeHint}));}}
  if(Math.abs(controls.horizontal)>.05)levelManager.markSkillUsed('move');
  if(controls.interactPressed)levelManager.markSkillUsed('interact');
  const hintEvent=[...levelEvents].reverse().find(event=>event.type==='hint:show'&&!levelManager.completedHints.has(event.skill));
  fpsFrames+=1;fpsElapsed+=dt;
  if(hintEvent)store.setState(state=>({...state,activeHint:{skill:hintEvent.skill,text:hintEvent.text,input:hintEvent.input}}));
  if(fpsElapsed>=0.5){fps=fpsFrames/fpsElapsed;fpsFrames=0;fpsElapsed=0;store.setState(state=>({...state,levelSnapshot:levelManager.getSnapshot(),fps}));}
  elapsedSeconds+=dt;if(Math.floor(elapsedSeconds)>publishSecond){publishSecond=Math.floor(elapsedSeconds);store.setState(state=>({...state,elapsedSeconds:publishSecond,checkpointId:state.player.checkpointId}));}
 },
 render(alpha,frame){const state=store.getState();onFrame({...frame,elapsedSeconds,player:interpolatePlayer(previousPlayer,state.player,alpha),simulationPlayer:state.player,state:{...state,levelSnapshot:levelManager.getSnapshot(),fps},interpolationAlpha:alpha});}});
 function transition(next,metadata){const result=stateMachine.transition(next,metadata);if(next==='ChapterComplete')eventBus.emit('chapter:complete',{chapter:store.getState().chapter,metadata});if(['Paused','Cutscene','Title','ChapterComplete','Ending'].includes(next))loop.stop();else if(next==='Playing')loop.start();return result;}
 return {store,input,eventBus,stateMachine,uiBridge,loop,saveSystem,levelManager,
 start(){const state=stateMachine.getState();if(state==='Title')transition('Playing',{source:'start-button'});else if(state==='Paused')transition('Playing',{source:'resume'});else if(state==='Loading')transition('Playing',{source:'load-complete'});else if(state!=='Playing')return;loop.start();},
 stop(){loop.stop();if(stateMachine.getState()==='Playing')stateMachine.transition('Paused',{source:'stop'});},transition,
 resetToCheckpoint(){const p=store.getState().player;p.x=p.checkpointX;p.y=p.checkpointY??0;p.velocityY=0;p.velocityX=0;p.grounded=true;p.deathTimer=0;p.respawnFlash=.45;if(stateMachine.getState()==='Paused')transition('Playing',{source:'checkpoint-reset'});store.setState(s=>({...s,checkpointId:p.checkpointId}));},
 setAssistMode(enabled){store.setState(s=>({...s,assistMode:Boolean(enabled)}));},
 setPlayerDebug(enabled){store.setState(s=>({...s,playerDebug:Boolean(enabled)}));},togglePlayerDebug(){store.setState(s=>({...s,playerDebug:!s.playerDebug}));},
 setLevelDebug(enabled){store.setState(s=>({...s,levelDebug:Boolean(enabled)}));},toggleLevelDebug(){store.setState(s=>({...s,levelDebug:!s.levelDebug}));},
 async hotReloadLevel(){let nextLevel=chapterOne;try{const response=await fetch('/src/levels/chapter-01.json?hot='+Date.now());if(response.ok)nextLevel=await response.json();}catch{ /* Use the bundled JSON when the development endpoint is unavailable. */ }levelManager.hotReload(nextLevel);store.setState(s=>({...s,levelSnapshot:levelManager.getSnapshot(),activeHint:null}));eventBus.emit('level:reloaded',{levelId:nextLevel.id});},
 setFeelTestRoom(enabled){const active=Boolean(enabled);store.setState(s=>({...s,feelTestRoom:active}));if(active){const p=store.getState().player;p.x=20;p.y=0;p.checkpointX=20;p.checkpointY=0;p.checkpointId='feel-test';p.velocityX=0;p.velocityY=0;p.grounded=true;}},
 setPlayerTuning(key,value){if(!(key in PLAYER_CONFIG_LIMITS))return;const range=PLAYER_CONFIG_LIMITS[key];store.setState(s=>({...s,playerTuning:{...s.playerTuning,[key]:Math.max(range[0],Math.min(range[1],Number(value)))}}));},
 resetPlayerTuning(){store.setState(s=>({...s,playerTuning:{...PLAYER_CONFIG}}));},
 destroy(){loop.stop();input.destroy();uiBridge.dispose();detachAutosave();eventBus.clear();}
 };
}
