import {describe,expect,it,vi} from 'vitest';
import {createInput} from './input.js';
function fakeTarget(){const handlers=new Map();return{addEventListener(type,fn){handlers.set(type,fn);},removeEventListener(type){handlers.delete(type);},dispatch(type,event){handlers.get(type)?.({preventDefault:vi.fn(),...event});}};}
describe('input buffering',()=>{
 it('buffers a keyboard press and consumes it once',()=>{
  const target=fakeTarget(),input=createInput({target,getGamepads:()=>[]});target.dispatch('keydown',{code:'Space'});
  expect(input.read().jumpPressed).toBe(true);expect(input.consume('jump')).toBe(true);expect(input.read().jumpPressed).toBe(false);input.destroy();
 });
 it('expires unconsumed presses and supports rebinding',()=>{
  const target=fakeTarget(),input=createInput({target,getGamepads:()=>[],bufferSeconds:.1});input.rebindKey('jump','KeyJ');target.dispatch('keydown',{code:'KeyJ'});
  expect(input.isBuffered('jump')).toBe(true);input.advance(.11);expect(input.isBuffered('jump')).toBe(false);input.destroy();
 });
});
