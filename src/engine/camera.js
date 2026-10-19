const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const lerp=(a,b,t)=>a+(b-a)*t;
/** Renderer-independent camera pose with follow, look-ahead, bounds, zoom and optional shake. */
export function createCameraController({
  followSharpness=7,lookAheadSeconds=.22,lookAheadMax=2.5,
  bounds={left:-Infinity,right:Infinity,top:Infinity,bottom:-Infinity},
  softMargin=1.5,baseZoom=1,emotionalZoom=1.18,shakeIntensity=.35,reducedMotion=false,random=Math.random,
}={}) {
  const position={x:0,y:0}; let zoom=baseZoom,emotional=false,shakeTime=0,shakeDuration=0,shakeAmount=0;
  const pose={x:0,y:0,zoom:1,shakeX:0,shakeY:0};
  return {
    get pose(){return {...pose};},
    setBounds(next){bounds={...bounds,...next};},
    setEmotionalMoment(enabled){emotional=Boolean(enabled);},
    shake(intensity=1,duration=.2){if(reducedMotion)return;shakeAmount=clamp(intensity,0,1)*clamp(shakeIntensity,0,1);shakeDuration=Math.max(0,duration);shakeTime=shakeDuration;},
    update(target,deltaSeconds){
      const dt=Math.max(0,deltaSeconds),vx=target.velocityX??target.velocity?.x??0,vy=target.velocityY??target.velocity?.y??0;
      const dx=target.x+clamp(vx*lookAheadSeconds,-lookAheadMax,lookAheadMax),dy=target.y+clamp(vy*lookAheadSeconds,-lookAheadMax,lookAheadMax);
      const m=Math.max(0,softMargin),l=bounds.left+m,r=bounds.right-m,b=bounds.bottom+m,t=bounds.top-m;
      const tx=l<=r?clamp(dx,l,r):dx,ty=b<=t?clamp(dy,b,t):dy,a=1-Math.exp(-Math.max(0,followSharpness)*dt);
      position.x=lerp(position.x,tx,a);position.y=lerp(position.y,ty,a);zoom=lerp(zoom,emotional?emotionalZoom:baseZoom,a);
      Object.assign(pose,{x:position.x,y:position.y,zoom});
      if(shakeTime>0){shakeTime=Math.max(0,shakeTime-dt);const e=shakeDuration?shakeTime/shakeDuration:0;pose.shakeX=(random()*2-1)*shakeAmount*e;pose.shakeY=(random()*2-1)*shakeAmount*e;}
      else{pose.shakeX=0;pose.shakeY=0;}
      return {...pose};
    },
  };
}
