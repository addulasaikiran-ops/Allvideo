import {createEventBus} from './event-bus.js';
/** @typedef {import('./asset-manifest.js').AssetManifestEntry} AssetManifestEntry */
/** Concurrent loader with progress events; custom loaders can integrate Three.js loaders. */
export function createAssetLoader({manifest=[],fetchImpl=globalThis.fetch?.bind(globalThis),imageFactory=()=>new Image(),loaders={},eventBus=createEventBus(),concurrency=4}={}){
 const assets=new Map();let cancelled=false,loaded=0,failed=0;const total=manifest.length;
 async function defaultLoad(entry){
  if(entry.loader)return entry.loader(entry.url);if(loaders[entry.type])return loaders[entry.type](entry.url,entry);
  if(entry.type==='image')return new Promise((resolve,reject)=>{const image=imageFactory();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error(`Failed to load image: ${entry.url}`));image.src=entry.url;});
  if(typeof fetchImpl!=='function')throw new Error('fetch is unavailable for asset loading.');
  const response=await fetchImpl(entry.url);if(!response.ok)throw new Error(`Asset request failed (${response.status}): ${entry.url}`);
  if(entry.type==='json')return response.json();if(entry.type==='text')return response.text();
  if(entry.type==='arrayBuffer'||entry.type==='audio')return response.arrayBuffer();
  throw new Error(`Unsupported asset type: ${entry.type}`);
 }
 function progress(entry,status,error){eventBus.emit('assets:progress',{id:entry?.id??null,status,loaded,failed,total,progress:total?(loaded+failed)/total:1,error:error?.message});}
 async function loadOne(entry){
  if(cancelled)throw new Error('Asset loading cancelled.');progress(entry,'start');
  try{const value=await defaultLoad(entry);assets.set(entry.id,value);loaded++;progress(entry,'loaded');return{id:entry.id,ok:true,value};}
  catch(error){failed++;progress(entry,'error',error);if(entry.required)throw error;return{id:entry.id,ok:false,error};}
 }
 return {
  eventBus,get:id=>assets.get(id),has:id=>assets.has(id),entries:()=>new Map(assets),
  async load(){
   cancelled=false;loaded=0;failed=0;const results=new Array(manifest.length);let cursor=0;
   async function worker(){while(!cancelled){const i=cursor++;if(i>=manifest.length)return;results[i]=await loadOne(manifest[i]);}}
   await Promise.all(Array.from({length:Math.max(1,Math.min(concurrency,manifest.length||1))},worker));
   if(cancelled)throw new Error('Asset loading cancelled.');
   eventBus.emit('assets:complete',{loaded,failed,total,progress:1});return results;
  },
  cancel(){cancelled=true;},dispose(){cancelled=true;for(const value of assets.values())value?.close?.();assets.clear();},
 };
}
