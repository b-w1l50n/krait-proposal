import * as THREE from 'three';
import { OrbitControls } from 'three/addons/OrbitControls.js';

// Presentation-only artwork. No confidential engineering data is loaded.
// Board outlines, tracks, packages and all proportions are invented.
// Transducer silhouette references IMG_9085, without assuming a supplier or size.
const copy = {
  family: ['A shared language', 'FOLLOWER & MOTHERSHIP', 'Two modem roles. A connected underwater team.'],
  follower: ['The underwater endpoint', 'FOLLOWER MODEM', 'Receive commands. Return an emergency message.'],
  mothership: ['The coordinating node', 'MOTHERSHIP MODEM', 'Send direction. Listen for emergency returns.'],
  buoy: ['Below meets beyond', 'SURFACE GATEWAY', 'An acoustic connection with optional RF backhaul.'],
};
const container = document.querySelector('#viewport');
const status = document.querySelector('#render-status');
let selected = 'family', labelsOn = true, view;
function choose(role) {
  selected = role;
  ['study-title','role-label','role-description'].forEach((id,i)=>document.getElementById(id).textContent=copy[role][i]);
  document.querySelectorAll('[data-role]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.role===role)));
  view?.select(role);
}
document.querySelectorAll('[data-role]').forEach(b=>b.addEventListener('click',()=>choose(b.dataset.role)));
document.querySelector('#info').addEventListener('click',e=>{const panel=document.querySelector('#about');panel.hidden=!panel.hidden;e.currentTarget.setAttribute('aria-expanded',String(!panel.hidden));});

function build() {
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.setClearColor(0xeeede8,0);
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
  container.append(renderer.domElement);
  renderer.domElement.setAttribute('role','img');renderer.domElement.setAttribute('aria-label','Original rectangular PCBs, each with one cabled TX transducer and a separate receive-only hydrophone. Drag to orbit.');
  const camera=new THREE.OrthographicCamera(-9,9,6,-6,.1,100);
  const controls=new OrbitControls(camera,renderer.domElement);
  controls.enableDamping=false;controls.enablePan=true;controls.minZoom=.65;controls.maxZoom=2.5;
  controls.minPolarAngle=.2;controls.maxPolarAngle=1.43;
  scene.add(new THREE.HemisphereLight(0xffffff,0x8b9586,2.6));
  const key=new THREE.DirectionalLight(0xfff9ea,3.3);key.position.set(-5,12,7);key.castShadow=true;
  key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-13;key.shadow.camera.right=13;key.shadow.camera.top=11;key.shadow.camera.bottom=-11;key.shadow.normalBias=.025;key.shadow.bias=-.0001;key.shadow.radius=5;scene.add(key);
  const fill=new THREE.DirectionalLight(0xd9e5eb,1.3);fill.position.set(6,6,-7);scene.add(fill);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.075}));ground.rotation.x=-Math.PI/2;ground.position.y=-.03;ground.receiveShadow=true;scene.add(ground);
  const material=(color,metalness=0,roughness=.6)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
  const green=material(0x204b36,.16,.39), edge=material(0x8e9b7c,.3,.6), chip=material(0x202622,.13,.57), silver=material(0xc1c6be,.78,.26), gold=material(0xa58b55,.55,.44), ceramic=material(0xa59c82,.12,.65), ivory=material(0xd6d4c3,.1,.62), rubber=material(0x202925,.08,.48), copper=material(0x927359,.48,.48);
  // Procedural surface microtexture; no board photograph or real layout used.
  const grain=document.createElement('canvas');grain.width=128;grain.height=128;
  const gx=grain.getContext('2d');const pixels=gx.createImageData(128,128);
  for(let i=0;i<pixels.data.length;i+=4){const v=155+((i*13+i%97)%45);pixels.data[i]=v;pixels.data[i+1]=v;pixels.data[i+2]=v;pixels.data[i+3]=255;}gx.putImageData(pixels,0,0);
  const roughness=new THREE.CanvasTexture(grain);roughness.wrapS=roughness.wrapT=THREE.RepeatWrapping;roughness.repeat.set(5,5);green.roughnessMap=roughness;
  function mesh(parent,geo,mat,x=0,y=0,z=0){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  function box(p,w,h,d,x,y,z,m=chip){return mesh(p,new THREE.BoxGeometry(w,h,d),m,x,y,z);}
  function cyl(p,r,h,x,y,z,m= silver,n=32){return mesh(p,new THREE.CylinderGeometry(r,r,h,n),m,x,y,z);}
  function ring(p,r,t,x,y,z,m=silver){const obj=mesh(p,new THREE.TorusGeometry(r,t,8,40),m,x,y,z);obj.rotation.x=Math.PI/2;return obj;}
  function text(p,word,x,y,z,w=.8){const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#d8d9c5';ctx.textAlign='center';ctx.font='36px Arial';ctx.fillText(word,256,72);const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;const m=mesh(p,new THREE.PlaneGeometry(w,w/4),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}),x,y,z);m.rotation.x=-Math.PI/2;m.castShadow=false;return m;}
  function board(p,w,d,y,variant=0){
    const group=new THREE.Group();group.position.y=y;p.add(group);
    // Rectangular boards with rounded corners and actual mounting cutouts.
    const shape=new THREE.Shape();const a=w/2,b=d/2,r=.08;
    shape.moveTo(-a+r,-b);shape.lineTo(a-r,-b);shape.quadraticCurveTo(a,-b,a,-b+r);shape.lineTo(a,b-r);shape.quadraticCurveTo(a,b,a-r,b);shape.lineTo(-a+r,b);shape.quadraticCurveTo(-a,b,-a,b-r);shape.lineTo(-a,-b+r);shape.quadraticCurveTo(-a,-b,-a+r,-b);
    for(const x of [-a+.16,a-.16])for(const z of [-b+.16,b-.16]){const hole=new THREE.Path();hole.absarc(x,z,.065,0,Math.PI*2,true);shape.holes.push(hole);}
    const geo=new THREE.ExtrudeGeometry(shape,{depth:.055,bevelEnabled:false});geo.rotateX(-Math.PI/2);
    mesh(group,geo,[green,edge]);
    // Decorative traces are deliberately disconnected motifs, not a netlist.
    const traceMat=new THREE.LineBasicMaterial({color:0x93aa87,transparent:true,opacity:.5});
    for(let i=0;i<26;i++){
      const x=-a+.25+(i%13)*(w-.5)/13,z=-b+.3+Math.floor(i/13)*(d-.7);
      const direction=i%2?1:-1;const points=[new THREE.Vector3(x,.062,z),new THREE.Vector3(x,.062,z+direction*.15),new THREE.Vector3(x+.09,.062,z+direction*.24),new THREE.Vector3(x+.09,.062,z+direction*.38)];
      const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),traceMat);group.add(line);
      cyl(group,.013,.004,x,.063,z,gold,8);
    }
    // An invented central package and generic leads.
    const cx=variant?-.32:-.28,cz=variant?.05:-.1;
    box(group,.77,.115,.76,cx,.12,cz);
    box(group,.67,.012,.66,cx,.184,cz,material(0x384039,.18,.55));
    text(group,'K R A I T',cx,.192,cz,.6);
    for(let i=0;i<12;i++){
      const o=-.33+i*.06;
      box(group,.026,.025,.13,cx+o,.082,cz-.425,silver);box(group,.026,.025,.13,cx+o,.082,cz+.425,silver);
      box(group,.13,.025,.026,cx-.425,.082,cz+o,silver);box(group,.13,.025,.026,cx+.425,.082,cz+o,silver);
    }
    // Fictional auxiliary packages, passives and plated pads.
    for(let i=0;i<5;i++){
      const px=-a+.37+i*.37,pz=b-.42;
      box(group,.2,.07,.13,px,.1,pz,chip);
      for(const sign of [-1,1])box(group,.026,.023,.14,px+sign*.095,.081,pz,silver);
    }
    for(let i=0;i<19;i++){
      const x=.39+(i%3)*.18,z=-b+.36+Math.floor(i/3)*.2;
      box(group,.075,.055,.12,x,.086,z,i%3?ceramic:chip);
      box(group,.077,.018,.03,x,.07,z-.061,silver);box(group,.077,.018,.03,x,.07,z+.061,silver);
    }
    // White board-edge connectors: shapes only, no real pin or connector counts.
    for(let i=0;i<3;i++){
      const x=-a+.42+i*.5;
      box(group,.35,.2,.23,x,.15,-b+.1,ivory);box(group,.25,.08,.14,x,.22,-b+.11,chip);
      for(let j=0;j<3;j++)box(group,.03,.1,.03,x-.075+j*.075,.2,-b+.11,gold);
    }
    box(group,.25,.12,.7,-a+.17,.13,0,chip);
    for(let i=0;i<7;i++)cyl(group,.025,.11,-a+.17,.22,-.27+i*.09,gold,8);
    text(group,'CONCEPT / '+(variant?'B':'A'),.0,.062,b-.12,.8);
    // Additional generic package types and solder fillets make the artwork
    // plausible without mapping its geometry to any real circuit.
    const can=box(group,.37,.075,.15,-.36,.103,-.77,silver);
    const seam=new THREE.LineSegments(new THREE.EdgesGeometry(can.geometry),new THREE.LineBasicMaterial({color:0x7b847a}));can.add(seam);
    box(group,.22,.012,.12,-.36,.146,-.77,material(0xa2aaa0,.55,.45));
    box(group,.22,.095,.42,a-.4,.12,-.37,chip);
    for(let i=0;i<5;i++)for(const side of [-1,1]){
      box(group,.105,.028,.032,a-.4+side*.14,.085,-.52+i*.075,silver);
      const solder=mesh(group,new THREE.SphereGeometry(.03,8,6),silver,a-.4+side*.19,.075,-.52+i*.075);solder.scale.set(1,.5,.72);
    }
    const silk=new THREE.LineBasicMaterial({color:0xd3d8bd,transparent:true,opacity:.68});
    for(const [x,z,sw,sd]of [[cx,cz,1.02,1.0],[a-.4,-.37,.49,.57],[-.36,-.77,.45,.23]]){
      const pts=[[-sw/2,-sd/2],[sw/2,-sd/2],[sw/2,sd/2],[-sw/2,sd/2],[-sw/2,-sd/2]].map(([u,v])=>new THREE.Vector3(x+u,.064,z+v));group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),silk));
    }
    text(group,'U·A',cx-.35,.067,cz-.6,.19);text(group,'X·A',-.65,.067,-.77,.18);
    for(let i=0;i<18;i++){
      const vx=-a+.25+(i%9)*.12,vz=b-.15-Math.floor(i/9)*.105;
      ring(group,.018,.005,vx,.061,vz,gold);cyl(group,.009,.003,vx,.06,vz,chip,8);
    }
    for(const x of [-a+.16,a-.16])for(const z of [-b+.16,b-.16])ring(group,.075,.014,x,.068,z,gold);
    return group;
  }
  function populatedBoard(parent,large=false){
    const w=large?3.3:2.8,d=large?2.65:2.25;
    // One flat fabricated PCB. Any internal copper layers are not resolved.
    const top=board(parent,w,d,.08,0);
    // One large fictional magnetic package is a visual cue, not a selected part.
    const tor=mesh(top,new THREE.TorusGeometry(.28,.09,12,36),copper,w/2-.57,.18,.52);tor.rotation.x=Math.PI/2;
    for(let i=0;i<26;i++){
      const angle=i/26*Math.PI*2;
      const winding=mesh(top,new THREE.TorusGeometry(.091,.012,6,14),gold,w/2-.57+Math.cos(angle)*.28,.18,.52+Math.sin(angle)*.28);
      winding.rotation.y=-angle;
    }
    box(top,.48,.14,.49,w/2-.57,.19,.52,chip);box(top,.18,.17,.54,w/2-.57,.21,.52,material(0x3e4741));
    cyl(top,.14,.37,-w/2+.42,.24,.62,chip);cyl(top,.127,.012,-w/2+.42,.432,.62,silver);
    box(top,.17,.003,.008,-w/2+.42,.44,.62,chip);box(top,.008,.003,.17,-w/2+.42,.44,.62,chip);
    return {w,d};
  }
  function transducer(parent,x,z){
    const t=new THREE.Group();t.position.set(x,.6,z);t.rotation.y=-.13;parent.add(t);
    // Photo reference: black elongated molded cylinder, softly rounded ends,
    // tapered rear cable boot. No invented front grille or acoustic rings.
    const profile=[new THREE.Vector2(0,-.99),new THREE.Vector2(.43,-.99),new THREE.Vector2(.51,-.94),new THREE.Vector2(.55,-.84),new THREE.Vector2(.55,.75),new THREE.Vector2(.52,.85),new THREE.Vector2(.46,.89),new THREE.Vector2(0,.89)];
    const body=mesh(t,new THREE.LatheGeometry(profile,64),rubber);body.rotation.x=Math.PI/2;
    const front=mesh(t,new THREE.CircleGeometry(.46,64),material(0x242c27,.04,.59),0,0,.895);front.rotation.y=0;
    const boot=mesh(t,new THREE.ConeGeometry(.29,.54,40),rubber,0,0,-1.16);boot.rotation.x=-Math.PI/2;
    const exit=mesh(t,new THREE.CylinderGeometry(.07,.11,.22,24),rubber,0,0,-1.46);exit.rotation.x=Math.PI/2;
    return new THREE.Vector3(x+.19,.6,z-1.43);
  }
  const assemblies={},labelAnchors={};
  for(const role of ['follower','mothership','buoy']){
    const g=new THREE.Group();scene.add(g);assemblies[role]=g;
    const large=role!=='follower';const dimensions=populatedBoard(g,large);
    const end=transducer(g,-3.0,1.35);
    const socket=new THREE.Vector3(-dimensions.w/2+.18,.18,.5);
    // Broad loose cable loop evokes the bench photo; artwork lengths only.
    const curve=new THREE.CatmullRomCurve3([socket,new THREE.Vector3(-2.0,.34,.3),new THREE.Vector3(-2.05,.16,-.8),new THREE.Vector3(-3.7,.12,-1.1),new THREE.Vector3(-3.6,.31,-.25),end]);
    mesh(g,new THREE.TubeGeometry(curve,80,.043,10,false),rubber);
    // A separate receive-only hydrophone per modem, as requested. Its slender
    // form and dimensions are illustrative; it is not a selected product model.
    const hydro=new THREE.Group();hydro.position.set(-1.85,.25,2.75);g.add(hydro);
    const hydroBody=cyl(hydro,.21,.88,0,0,0,rubber,48);hydroBody.rotation.x=Math.PI/2;
    mesh(hydro,new THREE.SphereGeometry(.21,32,16),rubber,0,0,.43).scale.z=.45;
    const collar=cyl(hydro,.215,.08,0,0,-.34,silver,32);collar.rotation.x=Math.PI/2;
    const hydroBoot=mesh(hydro,new THREE.ConeGeometry(.15,.28,32),rubber,0,0,-.55);hydroBoot.rotation.x=-Math.PI/2;
    const receiveCable=new THREE.CatmullRomCurve3([
      new THREE.Vector3(-.64,.17,dimensions.d/2-.08),
      new THREE.Vector3(-.62,.14,1.65),new THREE.Vector3(-.9,.09,2.0),
      new THREE.Vector3(-1.65,.12,1.85),new THREE.Vector3(-1.85,.25,2.06)]);
    mesh(g,new THREE.TubeGeometry(receiveCable,64,.028,8,false),rubber);
    if(role==='buoy'){
      const radio=new THREE.Group();g.add(radio);radio.position.set(2.45,.1,-.2);
      box(radio,1.08,.055,1.62,0,.17,0,green);box(radio,.74,.25,.72,0,.34,.2,silver);
      for(let i=0;i<5;i++)box(radio,.09,.06,.13,-.32+i*.15,.23,-.48,chip);
      const antenna=cyl(radio,.045,1.2,.3,.92,-.49,rubber);antenna.rotation.z=-.15;
    }
    labelAnchors[role]=new THREE.Vector3(0,.48,-dimensions.d/2-.13);
  }
  const labelNodes={};
  const acousticLabels=[];
  for(const role of Object.keys(assemblies)){
    const el=document.createElement('span');el.className='model-label';el.textContent=role==='buoy'?'GATEWAY / CONCEPT PCB':`${role.toUpperCase()} / CONCEPT PCB`;container.append(el);labelNodes[role]=el;
    for(const [caption,anchor]of [['TX TRANSDUCER',new THREE.Vector3(-3,.6,2.55)],['RX HYDROPHONE',new THREE.Vector3(-1.85,.25,3.45)]]){
      const label=document.createElement('span');label.className='model-label';label.textContent=caption;container.append(label);acousticLabels.push({role,label,anchor});
    }
  }
  let family=true;
  function home(){camera.position.set(8,10,14);controls.target.set(-.8,.3,0);camera.zoom=1;controls.update();camera.updateProjectionMatrix();resize();}
  function select(role){
    family=role==='family';
    for(const [key,g]of Object.entries(assemblies)){
      g.visible=family?key!=='buoy':key===role;
      g.position.set(0,0,0);g.rotation.y=0;
      if(family){if(key==='follower'){g.position.set(-1.3,0,2.15);g.rotation.y=.08;}if(key==='mothership'){g.position.set(2.65,0,-2.1);g.rotation.y=.08;}}
    }
    home();
  }
  function render(){
    renderer.render(scene,camera);const w=container.clientWidth,h=container.clientHeight;
    for(const [role,el]of Object.entries(labelNodes)){
      const p=assemblies[role].localToWorld(labelAnchors[role].clone()).project(camera);
      el.hidden=!labelsOn||!assemblies[role].visible||p.z>1;
      el.style.left=`${THREE.MathUtils.clamp((p.x*.5+.5)*w,70,w-70)}px`;el.style.top=`${THREE.MathUtils.clamp((-p.y*.5+.5)*h,20,h-20)}px`;
    }
    for(const {role,label,anchor}of acousticLabels){
      const p=assemblies[role].localToWorld(anchor.clone()).project(camera);
      label.hidden=!labelsOn||!assemblies[role].visible||p.z>1;
      label.style.left=`${THREE.MathUtils.clamp((p.x*.5+.5)*w,60,w-60)}px`;label.style.top=`${THREE.MathUtils.clamp((-p.y*.5+.5)*h,20,h-20)}px`;
    }
  }
  function resize(){const w=container.clientWidth,h=container.clientHeight;if(!w||!h)return;const aspect=w/h;
    const width=family?14.6:10.3;const height=Math.max(family?6.5:4.7,width/aspect);
    camera.left=-height*aspect/2;camera.right=-camera.left;camera.top=height/2;camera.bottom=-height/2;camera.updateProjectionMatrix();renderer.setSize(w,h);render();
  }
  controls.addEventListener('change',render);new ResizeObserver(resize).observe(container);
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();status.textContent='3D paused — reload to restore. Role descriptions remain available.';});
  select(selected);status.textContent='DRAG TO ORBIT · SCROLL TO ZOOM · SHIFT + DRAG TO PAN';
  return {select,home,render,camera,controls};
}
try{view=build();}catch(error){container.replaceChildren();const p=document.createElement('p');p.className='fallback';p.textContent='3D unavailable. Select a modem role to read its description.';container.append(p);status.textContent='STATIC ROLE DESCRIPTIONS AVAILABLE';console.warn('3D fallback:',error.message);}
document.querySelector('#labels').addEventListener('click',e=>{labelsOn=!labelsOn;e.currentTarget.setAttribute('aria-pressed',String(labelsOn));view?.render();});
document.querySelector('#home').addEventListener('click',()=>view?.home());
for(const[id,factor]of[['zoom-in',1.15],['zoom-out',1/1.15]])document.getElementById(id).addEventListener('click',()=>{if(!view)return;view.camera.zoom=THREE.MathUtils.clamp(view.camera.zoom*factor,.65,2.5);view.camera.updateProjectionMatrix();view.render();});
for(const[id,angle]of[['orbit-left',.2],['orbit-right',-.2]])document.getElementById(id).addEventListener('click',()=>{if(!view)return;view.camera.position.sub(view.controls.target).applyAxisAngle(new THREE.Vector3(0,1,0),angle).add(view.controls.target);view.controls.update();view.render();});

