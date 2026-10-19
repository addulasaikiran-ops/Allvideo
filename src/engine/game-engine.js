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
import chapterTwo from '../levels/chapter-02.json';
import chapterThree from '../levels/chapter-03.json';

const CHAPTERS = {'chapter-01': chapterOne, 'chapter-02': chapterTwo, 'chapter-03': chapterThree};
const initialPlayer=createPlayerState(); initialPlayer.levelManagedCheckpoints=true; initialPlayer.worldStart=chapterOne.world.start-2; initialPlayer.worldEnd=chapterOne.world.end+1;
const initialState={status:'Title',elapsedSeconds:0,checkpointId:'start',chapter:'chapter-01',hearts:3,hp:3,assistMode:false,inputDevice:'keyboard',player:initialPlayer,playerTuning:{...PLAYER_CONFIG},playerDebug:false,levelDebug:false,feelTestRoom:false,levelSnapshot:null,activeHint:null,activeDialogue:null,fps:0};
const copyPlayer=player=>({...player});
function interpolatePlayer(previous,current,alpha){return{...current,x:previous.x+(current.x-previous.x)*alpha,y:previous.y+(current.y-previous.y)*alpha};}
export function createGameEngine({onFrame=()=>{},now=()=>globalThis.performance?.now?.()??Date.now(),inputTarget,requestFrame,cancelFrame,storage}={}){
 const eventBus=createEventBus(),store=createStore({...initialState,player:createPlayerState()}),stateMachine=createGameStateMachine({initialState:'Title',eventBus});
 const saveSystem=createSaveSystem({storage,eventBus});
 const detachAutosave=saveSystem.attachAutosave({getSaveData:()=>{const state=store.getState();return{chapter:state.chapter,checkpointId:state.player.checkpointId,hearts:state.hearts,hp:state.hp,progress:state.progress??{},settings:state.settings??{}};}});
 const input=createInput({target:inputTarget??globalThis.window,onDeviceChange:device=>{store.setState(state=>({...state,inputDevice:device}));eventBus.emit('input:device',{device});}});
 const uiBridge=createStoreBridge({store,eventBus,input});
 let elapsedSeconds=0,publishSecond=0,previousPlayer=copyPlayer(store.getState().player),fpsFrames=0,fpsElapsed=0,fps=0;
 let activeLevel=chapterOne;
 const levelManager=createLevelManager(activeLevel,{onEvent:event=>{eventBus.emit(event.type,event);if(event.type==='dialogue:trigger')store.setState(s=>({...s,activeDialogue:{id:event.dialogueId,lines:event.lines??[],index:0,skippable:event.skippable!==false}}));if(event.type==='puzzle:hint')store.setState(s=>({...s,activeHint:{skill:'puzzle-'+event.id,text:event.text,input:event.input,visualCue:event.visualCue,audioCue:event.audioCue}}));}});
 store.setState(state=>({...state,levelSnapshot:levelManager.getSnapshot()}));
 stateMachine.subscribe(({current})=>store.setState(state=>({...state,status:current})));
 const loop=createGameLoop({now,...(requestFrame?{requestFrame}:{}),...(cancelFrame?{cancelFrame}:{}),
 update(dt){input.advance(dt);const current=store.getState();previousPlayer=copyPlayer(current.player);const controls=input.read();
  if(controls.pausePressed&&current.status==='Playing'){input.consume('pause');stateMachine.transition('Paused');loop.stop();return;}
  for(const action of ['jump','interact','pulse','rest','victory'])if(controls[action+'Pressed'])input.consume(action);
  if(current.status==='Playing'||current.status==='Title')stepPlayer(current.player,controls,dt,current.assistMode,current.playerTuning,current.feelTestRoom?FEEL_TEST_PLATFORMS:levelManager.getPlatforms());
  const levelEvents=levelManager.update(dt,current.player,{interactPressed:controls.interactPressed,pulsePressed:controls.pulsePressed,pulseActive:current.player.pulseTimer>0});
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
 function loadChapter(id){const next=CHAPTERS[id];if(!next)return false;activeLevel=next;levelManager.load(next);const player=createPlayerState();player.levelManagedCheckpoints=true;player.worldStart=(next.world?.start??-8)-2;player.worldEnd=(next.world?.end??54)+1;player.x=next.world?.spawn?.x??-6;player.y=next.world?.spawn?.y??0;player.checkpointX=player.x;player.checkpointY=player.y;player.checkpointId='start';elapsedSeconds=0;publishSecond=0;store.setState(s=>({...s,chapter:id,player,playerTuning:{...s.playerTuning,worldStart:player.worldStart,worldEnd:player.worldEnd},elapsedSeconds:0,checkpointId:'start',activeHint:null,activeDialogue:null,levelSnapshot:levelManager.getSnapshot()}));stateMachine.transition('Title',{source:'chapter-select'});return true;}
 return {store,input,eventBus,stateMachine,uiBridge,loop,saveSystem,levelManager,
 start(){const state=stateMachine.getState();if(state==='Title')transition('Playing',{source:'start-button'});else if(state==='Paused')transition('Playing',{source:'resume'});else if(state==='Loading')transition('Playing',{source:'load-complete'});else if(state!=='Playing')return;loop.start();},
 stop(){loop.stop();if(stateMachine.getState()==='Playing')stateMachine.transition('Paused',{source:'stop'});},transition,
 loadChapter,
 advanceDialogue(){store.setState(s=>{if(!s.activeDialogue)return s;const nextIndex=s.activeDialogue.index+1;if(nextIndex>=s.activeDialogue.lines.length)return{...s,activeDialogue:null};return{...s,activeDialogue:{...s.activeDialogue,index:nextIndex}};});},
 skipDialogue(){store.setState(s=>({...s,activeDialogue:null}));},
 resetToCheckpoint(){const p=store.getState().player;p.x=p.checkpointX;p.y=p.checkpointY??0;p.velocityY=0;p.velocityX=0;p.grounded=true;p.deathTimer=0;p.respawnFlash=.45;if(stateMachine.getState()==='Paused')transition('Playing',{source:'checkpoint-reset'});store.setState(s=>({...s,checkpointId:p.checkpointId}));},
 setAssistMode(enabled){store.setState(s=>({...s,assistMode:Boolean(enabled)}));},
 setPlayerDebug(enabled){store.setState(s=>({...s,playerDebug:Boolean(enabled)}));},togglePlayerDebug(){store.setState(s=>({...s,playerDebug:!s.playerDebug}));},
 setLevelDebug(enabled){store.setState(s=>({...s,levelDebug:Boolean(enabled)}));},toggleLevelDebug(){store.setState(s=>({...s,levelDebug:!s.levelDebug}));},
 async hotReloadLevel(){let nextLevel=activeLevel;try{const response=await fetch('/src/levels/'+activeLevel.id+'.json?hot='+Date.now());if(response.ok)nextLevel=await response.json();}catch{ /* Use bundled level data when the development endpoint is unavailable. */ }levelManager.hotReload(nextLevel);store.setState(s=>({...s,levelSnapshot:levelManager.getSnapshot(),activeHint:null}));eventBus.emit('level:reloaded',{levelId:nextLevel.id});},
 setFeelTestRoom(enabled){const active=Boolean(enabled);store.setState(s=>({...s,feelTestRoom:active}));if(active){const p=store.getState().player;p.x=20;p.y=0;p.checkpointX=20;p.checkpointY=0;p.checkpointId='feel-test';p.velocityX=0;p.velocityY=0;p.grounded=true;}},
 setPlayerTuning(key,value){if(!(key in PLAYER_CONFIG_LIMITS))return;const range=PLAYER_CONFIG_LIMITS[key];store.setState(s=>({...s,playerTuning:{...s.playerTuning,[key]:Math.max(range[0],Math.min(range[1],Number(value)))}}));},
 resetPlayerTuning(){store.setState(s=>({...s,playerTuning:{...PLAYER_CONFIG}}));},
 destroy(){loop.stop();input.destroy();uiBridge.dispose();detachAutosave();eventBus.clear();}
 };
}
