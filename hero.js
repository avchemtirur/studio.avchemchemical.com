/* ===================== AV CHEM — HERO ANIMATION ONLY =====================
   Story (seamless 20s loop):
   0.0–2.5s   Raw construction materials (particles settled, left/lower-left biased)
   2.5–5.0s   Material engineering (convergence toward center)
   5.0–7.5s   Polymer bonding (glowing bond lines form)
   7.5–10.0s  Engineered construction material (dense compressed plate)
   10.0–12.0s H4 BRAND formation (recognizable by ~11.5s)   <- H4 = brand
   12.0–14.0s "H4 Construction Solutions" (brand expands slightly)
   14.0–15.5s H4 Tile Adhesive     (tile / adhesive / base cross-section)
   15.5–17.0s H4 Waterproofing     (protected surface + droplet cue)
   17.0–18.2s H4 ShieldX Epoxy     (glossy dark plate + sheen cue)
   18.2–19.4s Final reveal: rises back into H4, ~0.7s readable hold
   19.4–20.0s Disperses left/lower-left back into raw materials (seamless)

   AV CHEM = manufacturer (communicated by the HTML hero text, always visible).
   H4 = the construction-solutions brand the animation itself renders.

   Scoped entirely to #hero / #heroCanvas. Does not touch app.js, other
   sections, business data, or navigation.
   =========================================================================== */
(function(){
  'use strict';

  const heroEl = document.getElementById('hero');
  const canvas = document.getElementById('heroCanvas');
  if(!heroEl || !canvas) return;

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const isMobile = window.innerWidth < 760 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  const lowPower = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
                    (navigator.deviceMemory && navigator.deviceMemory <= 4);

  let webglOK = false;
  try{
    const test = document.createElement('canvas');
    webglOK = !!(window.THREE && (test.getContext('webgl') || test.getContext('experimental-webgl')));
  }catch(e){ webglOK = false; }

  if(reduceMotion){ runReducedMotion(); return; }
  if(!webglOK){ runFallback2D(); return; }

  try{ runHero3D(); }
  catch(err){ console.warn('Hero 3D animation failed, using fallback:', err); runFallback2D(); }

  /* =====================================================================
     REDUCED MOTION — a single calm, static premium frame, no animation
     ===================================================================== */
  function runReducedMotion(){
    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    function draw(){
      const w = canvas.width = heroEl.clientWidth;
      const h = canvas.height = heroEl.clientHeight;
      canvas.style.width = w+'px'; canvas.style.height = h+'px';
      const g = ctx.createRadialGradient(w/2,h*0.42,10,w/2,h*0.42,Math.max(w,h)*0.6);
      g.addColorStop(0,'rgba(217,84,10,0.10)');
      g.addColorStop(1,'rgba(20,24,27,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,w,h);
    }
    draw();
    window.addEventListener('resize', draw, {passive:true});
  }

  /* =====================================================================
     LIGHTWEIGHT 2D FALLBACK (no WebGL / three.js unavailable)
     ===================================================================== */
  function runFallback2D(){
    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    let w,h,dots=[];
    const N = isMobile ? 70 : 160;
    const palette = ['43,52,58','105,113,119','166,170,172','239,240,238'];
    function size(){
      const dpr = Math.min(devicePixelRatio||1,1.5);
      w = canvas.width = heroEl.clientWidth * dpr;
      h = canvas.height = heroEl.clientHeight * dpr;
      canvas.style.width = heroEl.clientWidth+'px';
      canvas.style.height = heroEl.clientHeight+'px';
    }
    function seed(){
      dots = Array.from({length:N},()=>({
        x: Math.random()*w*0.55, // left/lower-left biased, like the 3D version
        y: h*0.4 + Math.random()*h*0.6,
        r: Math.random()*1.6+0.5,
        vx:(Math.random()-0.5)*0.12, vy:(Math.random()-0.5)*0.12,
        a: Math.random()*0.5+0.2,
        c: Math.random()<0.15 ? '217,84,10' : (Math.random()<0.5 ? palette[Math.floor(Math.random()*4)]:'240,169,59')
      }));
    }
    size(); seed();
    window.addEventListener('resize', ()=>{ size(); }, {passive:true});
    let raf=null, visible=true;
    const io = new IntersectionObserver(es=>{ visible = es[0].isIntersecting; if(visible && !raf) draw(); }, {threshold:0.05});
    io.observe(heroEl);
    function draw(){
      if(!visible){ raf=null; return; }
      ctx.clearRect(0,0,w,h);
      dots.forEach(d=>{
        d.x+=d.vx; d.y+=d.vy;
        if(d.x<0||d.x>w) d.vx*=-1;
        if(d.y<0||d.y>h) d.vy*=-1;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${d.c},${d.a})`;
        ctx.arc(d.x,d.y,d.r*(devicePixelRatio||1),0,Math.PI*2);
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
  }

  /* =====================================================================
     CINEMATIC 3D HERO (three.js)
     ===================================================================== */
  function runHero3D(){
    const THREE = window.THREE;
    const LOOP = 20; // seconds, seamless loop

    const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, isMobile?1.5:2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    camera.position.set(0,0,11);

    function fit(){
      const w = heroEl.clientWidth, h = heroEl.clientHeight;
      renderer.setSize(w,h,false);
      camera.aspect = w/h;
      camera.updateProjectionMatrix();
    }
    fit();

    /* ---------- particle count, adaptive ---------- */
    let N = isMobile ? 1200 : 4000;
    if(lowPower) N = Math.round(N*0.6);

    /* ---------- sample "H4" into 2D points for the brand-logo formation ---------- */
    function sampleH4(){
      const cw=640, ch=320;
      const c = document.createElement('canvas'); c.width=cw; c.height=ch;
      const cx = c.getContext('2d');
      cx.fillStyle='#000'; cx.fillRect(0,0,cw,ch);
      cx.fillStyle='#fff'; cx.textAlign='center'; cx.textBaseline='middle';
      cx.font = "700 230px Oswald, 'Arial Black', sans-serif";
      cx.fillText('H4', cw/2, ch/2+8);
      let data;
      try{ data = cx.getImageData(0,0,cw,ch).data; }catch(e){ return null; }
      const pts=[];
      for(let y=0;y<ch;y+=2){
        for(let x=0;x<cw;x+=2){
          if(data[(y*cw+x)*4] > 120) pts.push([ (x-cw/2)/cw*9.2, -(y-ch/2)/ch*4.4 ]);
        }
      }
      return pts.length ? pts : null;
    }
    const h4pts = sampleH4();

    /* ---------- colour palette (industrial grey + H4 orange/amber — no blue/purple/neon) ---------- */
    const G1=[0.169,0.204,0.227], G2=[0.412,0.443,0.465], G3=[0.651,0.667,0.675], G4=[0.937,0.941,0.933];
    const STEEL1=[0.125,0.153,0.173];
    const CERAMIC=[0.835,0.847,0.847];
    const AMBER=[0.941,0.663,0.231], ORANGE=[0.851,0.329,0.039];
    function lerp3(a,b,f){ return [a[0]+(b[0]-a[0])*f, a[1]+(b[1]-a[1])*f, a[2]+(b[2]-a[2])*f]; }

    /* ---------- per-particle stable identity ---------- */
    const rndA = new Float32Array(N);   // stable random 0..1 (grey bucket / override roll)
    const rndB = new Float32Array(N);   // stable random 0..1 (secondary roll, highlight)
    const phase = new Float32Array(N);  // flicker phase
    const glyphSide = new Float32Array(N); // -1 = left half of "H" (orange), +1 = right half of "4" (amber)
    for(let i=0;i<N;i++){
      rndA[i]=Math.random(); rndB[i]=Math.random(); phase[i]=Math.random();
      if(h4pts){ glyphSide[i] = h4pts[i % h4pts.length][0] < 0 ? -1 : 1; }
      else { glyphSide[i] = Math.random()<0.5 ? -1 : 1; }
    }

    function greyBase(i){
      const r=rndA[i];
      return r<0.30?G1 : r<0.55?G2 : r<0.80?G3 : G4;
    }
    function warmFor(i){ return glyphSide[i] < 0 ? ORANGE : AMBER; }

    // Colour keyframes — one Float32Array(N*3) per named mode, computed once at init.
    function buildColors(mode){
      const arr = new Float32Array(N*3);
      for(let i=0;i<N;i++){
        let col;
        switch(mode){
          case 'raw': {
            col = (rndB[i] < 0.08) ? AMBER : greyBase(i);
            break;
          }
          case 'bonded': {
            col = (rndB[i] < 0.30) ? warmFor(i) : (rndB[i] < 0.40 ? G4 : greyBase(i));
            break;
          }
          case 'plate': {
            col = (rndB[i] < 0.20) ? warmFor(i) : (rndA[i] < 0.6 ? G1 : G2);
            break;
          }
          case 'brand': {
            col = (rndB[i] < 0.12) ? G4 : warmFor(i);
            break;
          }
          case 'brandSoft': {
            col = (rndB[i] < 0.20) ? G4 : warmFor(i);
            break;
          }
          case 'tile': {
            col = (rndB[i] < 0.15) ? warmFor(i) : (rndA[i] < 0.5 ? CERAMIC : (rndA[i] < 0.8 ? G4 : G3));
            break;
          }
          case 'protect': {
            col = (rndB[i] < 0.18) ? warmFor(i) : (rndA[i] < 0.75 ? G4 : G3);
            break;
          }
          case 'epoxy': {
            col = (rndB[i] < 0.20) ? warmFor(i) : (rndA[i] < 0.7 ? STEEL1 : G1);
            break;
          }
          default: col = greyBase(i);
        }
        arr[i*3]=col[0]; arr[i*3+1]=col[1]; arr[i*3+2]=col[2];
      }
      return arr;
    }
    const colorRaw    = buildColors('raw');
    const colorBonded = buildColors('bonded');
    const colorPlate  = buildColors('plate');
    const colorBrand  = buildColors('brand');
    const colorBrandSoft = buildColors('brandSoft');
    const colorTile   = buildColors('tile');
    const colorProtect= buildColors('protect');
    const colorEpoxy  = buildColors('epoxy');

    /* ---------- position keyframes ---------- */
    function makeArr(){ return new Float32Array(N*3); }
    const posCloud   = makeArr(); // raw materials — left / lower-left biased
    const posVortexL = makeArr(); // material engineering — loose convergence
    const posVortexT = makeArr(); // polymer bonding — tighter convergence
    const posPlate   = makeArr(); // engineered material — dense compressed disc
    const posH4      = makeArr(); // H4 brand formation
    const posH4Wide  = makeArr(); // "H4 Construction Solutions" — brand gently expands
    const posTile    = makeArr(); // H4 Tile Adhesive — layered cross-section
    const posProtect = makeArr(); // H4 Waterproofing — protected flat surface
    const posEpoxy   = makeArr(); // H4 ShieldX Epoxy — glossy dense plate

    const golden = 2.399963;
    const CX=-2.3, CY=-1.15, CZ=-0.9; // "enter from left + lower-left"

    for(let i=0;i<N;i++){
      // --- raw material cloud, biased left/lower-left ---
      const r = 2.6 + Math.random()*4.6;
      const th = Math.random()*Math.PI*2;
      const ph = Math.acos(2*Math.random()-1);
      posCloud[i*3]   = CX + r*Math.sin(ph)*Math.cos(th)*0.85;
      posCloud[i*3+1] = CY + r*Math.sin(ph)*Math.sin(th)*0.55;
      posCloud[i*3+2] = CZ + r*Math.cos(ph)*0.5;

      // --- material engineering: loose spiral, centred ---
      let rr = Math.sqrt((i+0.5)/N) * 4.3;
      let ang = i*golden;
      posVortexL[i*3]   = rr*Math.cos(ang);
      posVortexL[i*3+1] = rr*Math.sin(ang)*0.8;
      posVortexL[i*3+2] = Math.sin(i*0.37)*1.1;

      // --- polymer bonding: tighter spiral ---
      let rr2 = rr*0.55;
      posVortexT[i*3]   = rr2*Math.cos(ang+0.5);
      posVortexT[i*3+1] = rr2*Math.sin(ang+0.5)*0.8;
      posVortexT[i*3+2] = Math.sin(i*0.51)*0.5;

      // --- engineered material: dense flat compressed disc ---
      const rp = Math.sqrt((i+0.5)/N) * 2.0;
      const angp = i*golden*1.3;
      posPlate[i*3]   = rp*Math.cos(angp);
      posPlate[i*3+1] = rp*Math.sin(angp)*0.9;
      posPlate[i*3+2] = -0.3 + (Math.random()-0.5)*0.18;

      // --- H4 brand formation (canvas-sampled glyph) ---
      if(h4pts){
        const p = h4pts[i % h4pts.length];
        const rep = i >= h4pts.length;
        const jx = rep ? (Math.random()-0.5)*0.05 : 0;
        const jy = rep ? (Math.random()-0.5)*0.05 : 0;
        posH4[i*3]   = p[0]+jx;
        posH4[i*3+1] = p[1]+jy;
        posH4[i*3+2] = (Math.random()-0.5)*0.12;
        posH4Wide[i*3]   = p[0]*1.12+jx;
        posH4Wide[i*3+1] = p[1]*1.12+jy;
        posH4Wide[i*3+2] = (Math.random()-0.5)*0.28;
      } else {
        posH4[i*3]=posPlate[i*3]; posH4[i*3+1]=posPlate[i*3+1]; posH4[i*3+2]=posPlate[i*3+2];
        posH4Wide[i*3]=posH4[i*3]*1.1; posH4Wide[i*3+1]=posH4[i*3+1]*1.1; posH4Wide[i*3+2]=posH4[i*3+2];
      }

      // --- H4 Tile Adhesive: tile / adhesive / base cross-section (3 bands) ---
      const band = i % 3;
      const bx = (Math.random()-0.5)*6.2;
      const bz = (Math.random()-0.5)*2.0;
      if(band===0){ // tile (top)
        posTile[i*3]=bx; posTile[i*3+1]=0.95+(Math.random()-0.5)*0.08; posTile[i*3+2]=bz;
      } else if(band===1){ // adhesive (middle, dotty)
        posTile[i*3]=bx; posTile[i*3+1]=0.0+(Math.random()-0.5)*0.35; posTile[i*3+2]=bz;
      } else { // base (bottom)
        posTile[i*3]=bx; posTile[i*3+1]=-0.95+(Math.random()-0.5)*0.08; posTile[i*3+2]=bz;
      }

      // --- H4 Waterproofing: unified protected flat surface ---
      posProtect[i*3]   = (Math.random()-0.5)*6.4;
      posProtect[i*3+1] = (Math.random()-0.5)*0.5;
      posProtect[i*3+2] = (Math.random()-0.5)*2.0;

      // --- H4 ShieldX Epoxy: wide dense glossy plate ---
      posEpoxy[i*3]   = (Math.random()-0.5)*6.8;
      posEpoxy[i*3+1] = (Math.random()-0.5)*0.16;
      posEpoxy[i*3+2] = (Math.random()-0.5)*2.4;
    }

    const baseSize = new Float32Array(N);
    for(let i=0;i<N;i++){ baseSize[i] = (rndB[i]>0.9 ? 2.4:1.2) + Math.random()*1.6; }

    const positions = new Float32Array(posCloud); // mutated per frame
    const colorsLive = new Float32Array(colorRaw);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions,3));
    geo.setAttribute('color', new THREE.BufferAttribute(colorsLive,3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(baseSize,1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phase,1));

    const mat = new THREE.ShaderMaterial({
      uniforms:{ uTime:{value:0}, uOpacity:{value:0.92} },
      vertexShader:`
        attribute float aSize;
        attribute float aPhase;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;
        void main(){
          vColor = color;
          vAlpha = 0.72 + 0.28*sin(uTime*1.5 + aPhase*6.2831853);
          vec4 mv = modelViewMatrix * vec4(position,1.0);
          gl_PointSize = aSize * (320.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader:`
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uOpacity;
        void main(){
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          if(d > 0.5) discard;
          float edge = smoothstep(0.5, 0.1, d);
          gl_FragColor = vec4(vColor, edge * vAlpha * uOpacity);
        }`,
      transparent:true, depthWrite:false, vertexColors:true,
      blending:THREE.AdditiveBlending
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    /* ---------- bonding lines (polymer cohesion cue, 5.0–7.5s only) ---------- */
    const bondN = isMobile ? 60 : 160;
    const bondStep = Math.max(1, Math.floor(N/bondN));
    const bondIdx = []; for(let i=0;i<N;i+=bondStep) bondIdx.push(i);
    const maxSeg = Math.min(200, bondIdx.length*2);
    const linePos = new Float32Array(maxSeg*2*3);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos,3));
    lineGeo.setDrawRange(0,0);
    const lineMat = new THREE.LineBasicMaterial({color:0xF0A93B, transparent:true, opacity:0, blending:THREE.AdditiveBlending});
    const bondLines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(bondLines);

    /* ---------- surface-cue plane: sequential tile grid / droplet / sheen ---------- */
    const planeGeo = new THREE.PlaneGeometry(15,8,1,1);
    const planeMat = new THREE.ShaderMaterial({
      uniforms:{ uTime:{value:0}, uGrid:{value:0}, uDrop:{value:0}, uSheen:{value:0}, uOpacity:{value:0} },
      vertexShader:`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader:`
        varying vec2 vUv;
        uniform float uTime,uGrid,uDrop,uSheen,uOpacity;
        void main(){
          vec2 uv=vUv;
          vec2 g=fract(uv*9.0);
          float gridLine=clamp(step(g.x,0.03)+step(g.y,0.03),0.0,1.0);
          vec2 c=uv-0.5; float d=length(c);
          float ring=1.0-smoothstep(0.0,0.06,abs(fract(d*6.0-uTime*0.32)-0.5)*2.0);
          float sheen=smoothstep(0.0,0.16,1.0-abs(fract(uv.x+uv.y*0.4-uTime*0.09)-0.5)*2.0);
          vec3 col = vec3(0.63,0.65,0.66)*gridLine*uGrid
                   + vec3(0.94,0.94,0.93)*ring*uDrop
                   + vec3(0.94,0.66,0.24)*sheen*uSheen;
          float a=(gridLine*uGrid*0.5 + ring*uDrop*0.55 + sheen*uSheen*0.55)*uOpacity;
          gl_FragColor=vec4(col,a);
        }`,
      transparent:true, depthWrite:false, blending:THREE.AdditiveBlending
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.position.z = -3.0;
    scene.add(plane);

    /* ---------- timeline: seconds -> fractions of the 20s loop ---------- */
    function smooth(t){ return t*t*(3-2*t); }
    const S = s => s/LOOP;
    // 13 stops -> 12 segments, matching the brief's second-by-second story
    const stopsT = [S(0),S(2.5),S(5.0),S(7.5),S(10.0),S(11.5),S(12.0),S(14.0),S(15.5),S(17.0),S(18.2),S(18.7),S(19.4),S(20.0)];
    const posStops   = [posCloud,posCloud,posVortexL,posVortexT,posPlate,posH4,posH4,posH4Wide,posTile,posProtect,posEpoxy,posH4,posH4,posCloud];
    const colStops    = [colorRaw,colorRaw,colorRaw,colorBonded,colorPlate,colorBrand,colorBrand,colorBrandSoft,colorTile,colorProtect,colorEpoxy,colorBrand,colorBrand,colorRaw];
    // easing per segment: front-load the H4-formation segment (10.0-11.5s) so it reads by ~11.5s
    const segEase = [smooth,smooth,smooth,smooth,smooth,(x)=>Math.pow(smooth(x),0.55),smooth,smooth,smooth,smooth,smooth,smooth,smooth];

    function segmentFor(t){
      for(let s=0;s<stopsT.length-1;s++){ if(t>=stopsT[s] && t<=stopsT[s+1]) return s; }
      return stopsT.length-2;
    }

    let raf = null;
    const clock = new THREE.Clock();
    let bondFrame = 0;

    function updateBondLines(t, seg, idxA, idxB, f){
      const active = (t>=S(5.0) && t<=S(7.5));
      if(!active){ lineGeo.setDrawRange(0,0); lineMat.opacity = Math.max(0,lineMat.opacity-0.05); return; }
      lineMat.opacity = Math.min(0.55, lineMat.opacity+0.03);
      bondFrame++;
      if(bondFrame % 4 !== 0) return;
      let segCount=0;
      const A=posStops[idxA], B=posStops[idxB];
      const thresh = 0.8;
      for(let a=0;a<bondIdx.length && segCount<maxSeg;a++){
        const ia=bondIdx[a], ia3=ia*3;
        const pax=A[ia3]+(B[ia3]-A[ia3])*f, pay=A[ia3+1]+(B[ia3+1]-A[ia3+1])*f, paz=A[ia3+2]+(B[ia3+2]-A[ia3+2])*f;
        for(let b=a+1;b<bondIdx.length && segCount<maxSeg;b++){
          const ib=bondIdx[b], ib3=ib*3;
          const pbx=A[ib3]+(B[ib3]-A[ib3])*f, pby=A[ib3+1]+(B[ib3+1]-A[ib3+1])*f, pbz=A[ib3+2]+(B[ib3+2]-A[ib3+2])*f;
          const dx=pax-pbx, dy=pay-pby, dz=paz-pbz;
          if(dx*dx+dy*dy+dz*dz < thresh*thresh){
            const o=segCount*6;
            linePos[o]=pax; linePos[o+1]=pay; linePos[o+2]=paz;
            linePos[o+3]=pbx; linePos[o+4]=pby; linePos[o+5]=pbz;
            segCount++;
          }
        }
      }
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.setDrawRange(0, segCount*2);
    }

    function windowEnv(t, a, b){
      if(t<a || t>b) return 0;
      const p = (t-a)/(b-a);
      return smooth(Math.min(1,p*6)) * smooth(Math.min(1,(1-p)*6));
    }
    function updatePlane(t){
      const gA=S(14.0), gB=S(15.5), dA=S(15.5), dB=S(17.0), sA=S(17.0), sB=S(18.2);
      const gEnv = windowEnv(t,gA,gB), dEnv = windowEnv(t,dA,dB), sEnv = windowEnv(t,sA,sB);
      planeMat.uniforms.uGrid.value = gEnv;
      planeMat.uniforms.uDrop.value = dEnv;
      planeMat.uniforms.uSheen.value = sEnv;
      planeMat.uniforms.uOpacity.value = 0.34;
      planeMat.uniforms.uTime.value = t*LOOP;
    }

    function render(){
      const el = clock.getElapsedTime();
      const t = (el % LOOP) / LOOP;

      const seg = segmentFor(t);
      const t0=stopsT[seg], t1=stopsT[seg+1];
      const raw = t1>t0 ? (t-t0)/(t1-t0) : 0;
      const f = (segEase[seg]||smooth)(Math.min(1,Math.max(0,raw)));

      const A = posStops[seg], B = posStops[seg+1];
      const CA = colStops[seg], CB = colStops[seg+1];

      // jitter shrinks near brand/final-hold windows so H4 stays legible
      const holdEnv = Math.max(windowEnv(t,S(10.0),S(12.5)), windowEnv(t,S(18.2),S(19.4)));
      const jitterAmt = 0.15*(1-holdEnv) + 0.02*holdEnv;

      for(let i=0;i<N;i++){
        const i3=i*3;
        const px = A[i3]   + (B[i3]-A[i3])*f;
        const py = A[i3+1] + (B[i3+1]-A[i3+1])*f;
        const pz = A[i3+2] + (B[i3+2]-A[i3+2])*f;
        const ph = phase[i];
        positions[i3]   = px + Math.sin(el*0.6+ph*10)*jitterAmt*0.4;
        positions[i3+1] = py + Math.cos(el*0.5+ph*9)*jitterAmt*0.4;
        positions[i3+2] = pz + Math.sin(el*0.4+ph*7)*jitterAmt*0.25;

        colorsLive[i3]   = CA[i3]   + (CB[i3]-CA[i3])*f;
        colorsLive[i3+1] = CA[i3+1] + (CB[i3+1]-CA[i3+1])*f;
        colorsLive[i3+2] = CA[i3+2] + (CB[i3+2]-CA[i3+2])*f;
      }
      geo.attributes.position.needsUpdate = true;
      geo.attributes.color.needsUpdate = true;
      mat.uniforms.uTime.value = el;

      updateBondLines(t, seg, seg, seg+1, f);
      updatePlane(t);

      // camera: raw materials (pulled back) -> slow push-in through engineering/bonding
      // -> closest at H4 formation -> eased back out for the product surfaces -> settle for hold -> back to start
      const zRaw=11.2, zEng=9.2, zPlate=7.6, zBrand=7.2, zProducts=9.0, zHold=10.0;
      let camZ;
      if(t<=S(2.5)) camZ = zRaw;
      else if(t<=S(5.0)) camZ = zRaw + (zEng-zRaw)*smooth((t-S(2.5))/(S(5.0)-S(2.5)));
      else if(t<=S(7.5)) camZ = zEng + (zPlate-zEng)*smooth((t-S(5.0))/(S(7.5)-S(5.0)));
      else if(t<=S(10.0)) camZ = zPlate + (zBrand-zPlate)*smooth((t-S(7.5))/(S(10.0)-S(7.5)));
      else if(t<=S(12.0)) camZ = zBrand;
      else if(t<=S(14.0)) camZ = zBrand + (zProducts-zBrand)*smooth((t-S(12.0))/(S(14.0)-S(12.0)));
      else if(t<=S(18.2)) camZ = zProducts;
      else if(t<=S(19.4)) camZ = zProducts + (zHold-zProducts)*smooth((t-S(18.2))/(S(19.4)-S(18.2)));
      else camZ = zHold + (zRaw-zHold)*smooth((t-S(19.4))/(S(20.0)-S(19.4)));

      camera.position.x = Math.sin(t*Math.PI*2*0.5)*0.5;
      camera.position.y = Math.cos(t*Math.PI*2*0.33)*0.28;
      camera.position.z = camZ;
      camera.lookAt(0,0,0);

      renderer.render(scene,camera);
      raf = requestAnimationFrame(render);
    }

    /* ---------- visibility pause + resize + cleanup ---------- */
    const io = new IntersectionObserver(es=>{
      const visible = es[0].isIntersecting;
      if(visible && !raf) raf = requestAnimationFrame(render);
      if(!visible && raf){ cancelAnimationFrame(raf); raf=null; }
    }, {threshold:0.05});
    io.observe(heroEl);

    let resizeTO=null;
    window.addEventListener('resize', ()=>{
      clearTimeout(resizeTO);
      resizeTO=setTimeout(fit,150);
    }, {passive:true});

    raf = requestAnimationFrame(render);
  }
})();
