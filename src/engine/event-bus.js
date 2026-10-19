/** @template Events Event payloads are documented by event name at their emit sites. */
export function createEventBus(){
  /** @type {Map<string,Set<Function>>} */ const listeners=new Map();
  return {
    on(type,listener){if(typeof listener!=='function')throw new TypeError('Event listener must be a function.');if(!listeners.has(type))listeners.set(type,new Set());listeners.get(type).add(listener);return()=>this.off(type,listener);},
    once(type,listener){let off=()=>{};off=this.on(type,payload=>{off();listener(payload);});return off;},
    off(type,listener){const set=listeners.get(type);if(!set)return false;const removed=set.delete(listener);if(!set.size)listeners.delete(type);return removed;},
    emit(type,payload){const set=listeners.get(type);if(set)for(const listener of [...set])listener(payload);},
    clear(){listeners.clear();},
    listenerCount(type){return listeners.get(type)?.size??0;},
  };
}
