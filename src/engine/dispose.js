/** Dispose Three.js-like resources without importing Three.js into the engine. */
export function disposeMaterial(material){
 if(!material)return;if(Array.isArray(material)){material.forEach(disposeMaterial);return;}
 for(const value of Object.values(material))if(value&&typeof value==='object'&&value.isTexture)value.dispose?.();
 material.dispose?.();
}
export function disposeObject3D(root,{disposeGeometry=true,disposeMaterials=true}={}){
 if(!root)return;
 root.traverse?.(object=>{if(disposeGeometry)object.geometry?.dispose?.();if(disposeMaterials)disposeMaterial(object.material);});
 if(!root.traverse){if(disposeGeometry)root.geometry?.dispose?.();if(disposeMaterials)disposeMaterial(root.material);}
 root.parent?.remove?.(root);
}
export function createDisposer(){
 const cleanups=new Set();let disposed=false;
 return {
  add(cleanup){if(typeof cleanup!=='function')throw new TypeError('Cleanup must be a function.');if(disposed){cleanup();return()=>{};}cleanups.add(cleanup);return()=>cleanups.delete(cleanup);},
  listen(target,type,listener,options){target?.addEventListener?.(type,listener,options);return this.add(()=>target?.removeEventListener?.(type,listener,options));},
  dispose(){if(disposed)return;disposed=true;for(const cleanup of [...cleanups].reverse())cleanup();cleanups.clear();},
  get disposed(){return disposed;},
 };
}
