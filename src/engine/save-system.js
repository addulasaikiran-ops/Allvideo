import {createEventBus} from './event-bus.js';
export const SAVE_VERSION=2;
export const SAVE_KEY='allvideo.save';
/** @typedef {{version:number,updatedAt:number,chapter:string,checkpointId:string,hearts:number,hp:number,progress:object,settings:object}} GameSave */
const DEFAULT_SAVE=Object.freeze({version:SAVE_VERSION,updatedAt:0,chapter:'chapter-01',checkpointId:'start',hearts:3,hp:3,progress:{},settings:{}});
export const SAVE_MIGRATIONS=Object.freeze({
 0:old=>({...old,version:1,chapter:old.chapter??'chapter-01',checkpointId:old.checkpointId??'start',hearts:old.hearts??3,hp:old.hp??old.hearts??3}),
 1:old=>({...old,version:2,progress:old.progress??{},settings:old.settings??{},updatedAt:old.updatedAt??0}),
});
function validSave(value){const version=value?.version??0;return value&&typeof value==='object'&&!Array.isArray(value)&&Number.isInteger(version)&&version>=0&&version<=SAVE_VERSION&&typeof(value.chapter??'chapter-01')==='string'&&typeof(value.checkpointId??'start')==='string';}
export function migrateSave(value){
 if(!validSave(value))throw new TypeError('Invalid or unsupported save data.');
 let save={...value,version:value.version??0};
 while(save.version<SAVE_VERSION){const migration=SAVE_MIGRATIONS[save.version];if(!migration)throw new Error(`Missing save migration from version ${save.version}.`);save=migration(save);}
 return {...DEFAULT_SAVE,...save,version:SAVE_VERSION,updatedAt:Number(save.updatedAt)||0};
}
/** Versioned localStorage save, migration, JSON file transfer and checkpoint autosave hooks. */
export function createSaveSystem({storage=globalThis.localStorage,key=SAVE_KEY,eventBus=createEventBus(),now=()=>Date.now()}={}){
 function save(data,reason='manual'){const normalized=migrateSave({...DEFAULT_SAVE,...data,version:SAVE_VERSION,updatedAt:now()});storage?.setItem(key,JSON.stringify(normalized));eventBus.emit('save:written',{reason,timestamp:normalized.updatedAt});return normalized;}
 function load(){const raw=storage?.getItem(key);if(!raw)return {...DEFAULT_SAVE};try{return migrateSave(JSON.parse(raw));}catch(error){eventBus.emit('save:error',{error,key});throw error;}}
 function clear(){storage?.removeItem(key);}
 function exportSave(data=load(),filename='allvideo-save.json'){
  const json=JSON.stringify(migrateSave(data),null,2);
  if(typeof Blob==='undefined'||!globalThis.URL?.createObjectURL||!globalThis.document)return json;
  const url=URL.createObjectURL(new Blob([json],{type:'application/json'}));const anchor=document.createElement('a');anchor.href=url;anchor.download=filename;anchor.click();URL.revokeObjectURL(url);return json;
 }
 function importSave(input){const parsed=typeof input==='string'?JSON.parse(input):input;const normalized=migrateSave(parsed);storage?.setItem(key,JSON.stringify(normalized));eventBus.emit('save:written',{reason:'import',timestamp:normalized.updatedAt});return normalized;}
 async function importSaveFile(file){if(!file||typeof file.text!=='function')throw new TypeError('Import requires a JSON save file.');return importSave(await file.text());}
 function attachAutosave({getSaveData,eventBus:source=eventBus}={}){
  if(typeof getSaveData!=='function')throw new TypeError('Autosave requires getSaveData().');
  return [source.on('checkpoint:reached',()=>save(getSaveData(),'checkpoint')),source.on('chapter:complete',()=>save(getSaveData(),'chapter-end'))].reduce((off,unsubscribe)=>()=>{off();unsubscribe();},()=>{});
 }
 return {key,eventBus,save,load,clear,exportSave,importSave,importSaveFile,attachAutosave};
}
