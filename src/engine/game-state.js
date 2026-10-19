export const GAME_STATES = Object.freeze(['Boot','Loading','Title','Playing','Paused','Cutscene','ChapterComplete','Ending']);
const TRANSITIONS = Object.freeze({
  Boot:['Loading','Title'], Loading:['Title','Playing'], Title:['Loading','Playing'],
  Playing:['Paused','Cutscene','ChapterComplete','Ending','Title'], Paused:['Playing','Title'],
  Cutscene:['Playing','Paused','ChapterComplete','Ending'], ChapterComplete:['Loading','Playing','Ending','Title'], Ending:['Title'],
});
/** @typedef {'Boot'|'Loading'|'Title'|'Playing'|'Paused'|'Cutscene'|'ChapterComplete'|'Ending'} GameState */
export function createGameStateMachine({initialState='Boot',eventBus}={}) {
  if (!GAME_STATES.includes(initialState)) throw new TypeError(`Unknown game state: ${initialState}`);
  let current=initialState; const listeners=new Set();
  return {
    getState:()=>current,
    canTransition:next=>TRANSITIONS[current]?.includes(next)??false,
    transition(next,metadata={}) {
      if (!GAME_STATES.includes(next)) throw new TypeError(`Unknown game state: ${next}`);
      if (next===current) return current;
      if (!TRANSITIONS[current]?.includes(next)) throw new Error(`Invalid game state transition: ${current} -> ${next}`);
      const previous=current; current=next; const event={previous,current,metadata,timestamp:Date.now()};
      for (const listener of [...listeners]) listener(event);
      eventBus?.emit('state:changed',event); return current;
    },
    subscribe(listener){listeners.add(listener);return()=>listeners.delete(listener);},
  };
}
