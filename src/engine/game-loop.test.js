import {describe,expect,it,vi} from 'vitest';
import {createGameLoop,FIXED_STEP} from './game-loop.js';
function fakeFrames(){let callback,id=0;return{requestFrame:vi.fn(next=>{callback=next;return ++id;}),cancelFrame:vi.fn(),tick(time){callback?.(time);}};}
describe('fixed timestep game loop',()=>{
 it('updates at 60Hz and renders interpolation alpha',()=>{
  const frames=fakeFrames(),update=vi.fn(),render=vi.fn(),loop=createGameLoop({update,render,...frames});
  loop.start();frames.tick(0);frames.tick(1000/30);
  expect(update).toHaveBeenCalledTimes(2);expect(update).toHaveBeenCalledWith(FIXED_STEP);expect(render.mock.lastCall[0]).toBeCloseTo(0,5);loop.stop();
 });
 it('caps a long frame gap and reports dropped time',()=>{
  const frames=fakeFrames(),update=vi.fn(),render=vi.fn(),loop=createGameLoop({update,render,...frames});
  loop.start();frames.tick(0);frames.tick(1000);
  expect(update.mock.calls.length).toBeLessThanOrEqual(8);expect(loop.droppedTime).toBeGreaterThan(.7);expect(render).toHaveBeenCalled();loop.stop();
 });
});
