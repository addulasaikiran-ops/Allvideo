import {describe,expect,it} from 'vitest';
import {createSaveSystem,migrateSave,SAVE_VERSION} from './save-system.js';
function memoryStorage(){const data=new Map();return{getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,String(value)),removeItem:key=>data.delete(key)};}
describe('save migrations',()=>{
 it('migrates an unversioned legacy save to the current schema',()=>{
  const migrated=migrateSave({chapter:'loneliness',hearts:2});
  expect(migrated.version).toBe(SAVE_VERSION);expect(migrated.chapter).toBe('loneliness');expect(migrated.hp).toBe(2);expect(migrated.checkpointId).toBe('start');expect(migrated.settings).toEqual({});
 });
 it('round-trips saves and rejects malformed imports',()=>{
  const saves=createSaveSystem({storage:memoryStorage(),now:()=>123});const saved=saves.save({chapter:'fear',checkpointId:'cave',hearts:1});
  expect(saves.load()).toEqual(saved);expect(()=>saves.importSave('{"version":99}')).toThrow();
 });
});
