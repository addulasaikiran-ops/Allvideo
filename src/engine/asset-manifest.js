/**
 * @typedef {'image'|'json'|'text'|'audio'|'arrayBuffer'|'custom'} AssetType
 * @typedef {{id:string,type:AssetType,url:string,required?:boolean,loader?:(url:string)=>Promise<any>}} AssetManifestEntry
 * @type {readonly AssetManifestEntry[]}
 */
export const ASSET_MANIFEST=Object.freeze([
 {id:'world.atlas',type:'image',url:'/assets/placeholders/world-atlas.png',required:false},
 {id:'story.chapters',type:'json',url:'/story/chapters.json',required:false},
]);
