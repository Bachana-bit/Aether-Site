'use strict';
/* Aether — vanilla JS: layout, WebGL background, cursor, scroll + pointer effects */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v)),RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const page=document.body.dataset.page,seg=p=>p.split('/').pop()||'index.html';
const ss={get(){try{return sessionStorage.getItem('ae')}catch(e){return null}},set(){try{sessionStorage.setItem('ae','1')}catch(e){}}};
const svg=(i,s=18)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${i}</svg>`;
const ARW=svg('<path d="M7 17 17 7M8 7h9v9"/>');
const IC={code:'<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',palette:'<circle cx="12" cy="12" r="9"/><circle cx="8.5" cy="10" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="15.5" cy="10" r="1"/><path d="M12 21a2 2 0 0 1 0-4h2a3 3 0 0 0 3-3"/>',film:'<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M3 12h18M7 8 5 3M13 8l-2-5M19 8l-2-5"/>',bulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z"/>',orbit:'<circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(45 12 12)"/>',bag:'<path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'};
const NAV=[['home','index.html','Home','#7c6cff'],['about','about.html','About','#ff7aa2'],['services','services.html','Services','#f1d5a0'],['portfolio','portfolio.html','Work','#7fe6ff'],['contact','contact.html','Contact','#c084fc']];
const HUE={home:0,about:.25,services:.5,portfolio:.75,contact:1};
const PROJECTS=[
{id:'orion',t:'Orion Maison',c:'Web',y:2026,d:'A cinematic launch site for a fine-jewellery house, with a real-time gemstone shader.',m:[['+64%','Conversion'],['1.2s','Load time'],['3.1M','Visitors']],tags:['WebGL','Art direction'],g:'radial-gradient(55% 55% at 28% 30%,#f1d5a0cc,transparent 70%),radial-gradient(60% 60% at 80% 78%,#7c6cffd0,transparent 70%),#0c0a18'},
{id:'solene',t:'Solène',c:'Film',y:2025,d:'A perfume launch film that doubles as an interactive scent journey on mobile.',m:[['12M','Views'],['4.8x','Return on spend'],['2','Industry awards']],tags:['Film','Motion'],g:'radial-gradient(60% 60% at 70% 25%,#ff7aa2cc,transparent 70%),radial-gradient(55% 55% at 20% 80%,#5b3dff,transparent 70%),#0a0812'},
{id:'halcyon',t:'Halcyon',c:'Installation',y:2025,d:'A 14-metre light sculpture that responds to the movement of museum visitors.',m:[['14m','Span'],['900','LEDs'],['210k','Visitors']],tags:['Light','Sensors'],g:'conic-gradient(from 200deg at 50% 60%,#0a0a10,#7fe6ff99,#0a0a10 45%,#c084fcaa,#0a0a10)'},
{id:'noctis',t:'Noctis',c:'Brand',y:2025,d:'Identity, signage and a motion language for a hotel that only opens after dark.',m:[['38','Touchpoints'],['6wk','Delivery'],['+41%','Bookings']],tags:['Identity','Motion'],g:'radial-gradient(50% 50% at 50% 45%,#f1d5a0,#ff7aa288 35%,transparent 70%),#0a0810'},
{id:'vertex',t:'Vertex',c:'Web',y:2024,d:'A 3D configurator for an electric aircraft, built to run smoothly on a phone.',m:[['60fps','On mobile'],['−38%','Bounce rate'],['9k','Configurations']],tags:['3D','Product'],g:'linear-gradient(135deg,#0d1b2a,#1b3a5c 40%,#7fe6ff66),radial-gradient(40% 40% at 75% 25%,#fff5,transparent)'},
{id:'arcadia',t:'Arcadia',c:'Installation',y:2024,d:'A generative projection that turns a shopping arcade into a living aurora at night.',m:[['4','Projectors'],['24h','Daily cycle'],['1.4M','Passers-by']],tags:['Projection','Generative'],g:'radial-gradient(70% 70% at 30% 70%,#c084fcbb,transparent 70%),radial-gradient(50% 50% at 80% 20%,#f1d5a0aa,transparent 70%),#0b0911'}];

const FRAG=`uniform float uT,uH,uS;uniform vec2 uR,uM;uniform vec2 uTr[14];
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*n(p);p=p*2.03+7.1;a*=.5;}return s;}
void main(){
  vec2 p=(gl_FragCoord.xy-.5*uR)/uR.y,m=uM;float t=uT*.04;p.y+=uS*.00022;
  vec2 q=vec2(fbm(p*1.3+t),fbm(p*1.3-t+4.));
  float f=fbm(p*1.1+q*2.2+m*.25);
  vec3 a=mix(vec3(.16,.1,.55),vec3(.5,.16,.6),uH),b=mix(vec3(1.,.42,.6),vec3(.96,.78,.5),uH),c=mix(vec3(.25,.8,1.),vec3(.45,.4,1.),uH);
  vec3 col=vec3(.012,.012,.02)+a*smoothstep(.35,.85,f)*.55+b*smoothstep(.55,.95,fbm(p*2.+q*3.-t))*.26+c*smoothstep(.6,1.,q.x)*.14;
  for(int k=0;k<2;k++){float z=float(k)+1.;vec2 g=p*(14.*z)+m*z*.6+vec2(0.,uT*.01*z);vec2 id=floor(g),fr=fract(g)-.5;float r=h(id+z);
    col+=vec3(.9,.85,1.)*step(.965,r)*smoothstep(.12,0.,length(fr+(h(id)-.5)*.5))*(.5+.5*sin(uT*1.5+r*60.))*.8/z;}
  for(int i=0;i<14;i++){float d=length(p-uTr[i]);float w=1.-float(i)/14.;col+=vec3(1.,.8,.62)*w*w*.0014/(d*d+.0014);}
  col*=1.-.55*dot(p*.7,p*.7);col=1.-exp(-col*1.25);gl_FragColor=vec4(col,1.);}`;

/* ---------- shared layout (header, menu, footer, cursor, loader) ---------- */
function split(el){const t=el.textContent.trim();el.setAttribute('aria-label',t);el.innerHTML=t.split(' ').map((w,i)=>`<span class="wm" aria-hidden="true"><span style="transition-delay:${i*.07}s">${w}&nbsp;</span></span>`).join('')}
function layout(){
  const cur=NAV.findIndex(n=>n[0]===page),b=document.body;
  b.insertAdjacentHTML('afterbegin',`<canvas class="bg"></canvas><div class="grid"></div><div class="grain"></div><div class="cs"></div><div class="cb"></div><div class="cr"><i></i><span></span></div><div class="cd"></div><i class="curtain"></i>`
    +(ss.get()||RM?'':'<div class="loader" aria-hidden="true"><b>0</b><span>%</span><i style="transform:scaleX(0)"></i></div>')
    +`<header class="top"><a href="index.html" class="logo" data-cursor="Home">Aether</a><button class="menu" aria-expanded="false" aria-label="Toggle menu"></button></header>
    <div class="ov" inert><div>${NAV.map((n,i)=>`<div class="pv${i===cur?' on':''}" style="background:radial-gradient(60% 60% at 72% 40%,${n[3]}55,transparent 70%)"></div>`).join('')}</div>
    <nav>${NAV.map((n,i)=>`<div class="lm"><div class="li" style="--i:${i}"><a href="${n[1]}"${i===cur?' class="on"':''}>${n[2]}</a></div></div>`).join('')}</nav>
    <a class="mail" href="mailto:studio@aether.studio">studio@aether.studio ${ARW}</a></div>`);
  b.insertAdjacentHTML('beforeend',`<footer class="ft"><a href="contact.html" class="cta2" data-cursor="Talk">Have a vision?<br><span class="g">Let’s make it real.</span></a>
    <div class="fl">${NAV.map(n=>`<a href="${n[1]}">${n[2]}</a>`).join('')}<a href="mailto:studio@aether.studio">studio@aether.studio</a></div>
    <div class="flash" data-flash aria-hidden="true">Aether</div><p>© 2026 Aether Studio. Made with light.</p></footer>`);
  $$('[data-words]').forEach(split);
  $$('[data-icon]').forEach(el=>el.innerHTML=svg(IC[el.dataset.icon],34));
  $$('[data-arw]').forEach(el=>el.outerHTML=ARW);
}
layout();

/* ---------- menu + page transitions ---------- */
const ov=$('.ov'),mb=$('.menu'),curtain=$('.curtain');
function setMenu(o){ov.classList.toggle('open',o);ov.inert=!o;mb.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':'';
  mb.innerHTML=`<span>${o?'Close':'Menu'}</span>${svg(o?'<path d="M5 5l14 14M19 5 5 19"/>':'<path d="M4 8h16M4 16h16"/>',16)}`}
setMenu(false);mb.onclick=()=>setMenu(!ov.classList.contains('open'));
$$('.li a').forEach((a,i)=>{a.onmouseenter=a.onfocus=()=>$$('.pv').forEach((p,j)=>p.classList.toggle('on',i===j))});
addEventListener('keydown',e=>{if(e.key==='Escape'){setMenu(false);closeModal&&closeModal()}});
document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a||e.metaKey||e.ctrlKey||e.shiftKey||a.target)return;
  const h=a.getAttribute('href');if(!/\.html$/.test(h))return;e.preventDefault();
  if(seg(a.pathname)===seg(location.pathname)){setMenu(false);return}
  curtain.classList.remove('out');curtain.classList.add('leave');setTimeout(()=>location.href=a.href,RM?0:700)});
addEventListener('pageshow',e=>{if(e.persisted){curtain.classList.remove('leave');curtain.classList.add('out')}});

/* ---------- reveal on scroll, counters ---------- */
function count(el){const n=+el.dataset.count,s=el.dataset.suffix||'',t0=performance.now();
  const f=t=>{const p=RM?1:clamp((t-t0)/2000);el.textContent=Math.round(n*(1-Math.pow(1-p,3)))+s;if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
function reveal(){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');io.unobserve(e.target);if(e.target.dataset.count)count(e.target)}),{threshold:.15});
  $$('[data-words],[data-fade],[data-count]').forEach(el=>io.observe(el));
}

/* ---------- tilt + magnetic buttons ---------- */
function bindFx(){
  $$('.tilt').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;
    el.style.transform=`perspective(900px) rotateX(${-py*14}deg) rotateY(${px*14}deg)`;el.style.setProperty('--gx',(px+.5)*100+'%');el.style.setProperty('--gy',(py+.5)*100+'%')});
    el.addEventListener('pointerleave',()=>el.style.transform='')});
  $$('[data-mag]').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.3}px,${(e.clientY-r.top-r.height/2)*.3}px)`});
    el.addEventListener('pointerleave',()=>el.style.transform='')});
}

/* ---------- WebGL light-field background (raw WebGL, no libraries) ---------- */
function initGL(){
  const c=$('.bg'),gl=c.getContext('webgl',{antialias:false});if(!gl)return null;
  const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o},p=gl.createProgram();
  gl.attachShader(p,sh(gl.VERTEX_SHADER,'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}'));
  gl.attachShader(p,sh(gl.FRAGMENT_SHADER,'precision highp float;'+FRAG));gl.linkProgram(p);
  if(!gl.getProgramParameter(p,gl.LINK_STATUS))return null;gl.useProgram(p);
  gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  const l=gl.getAttribLocation(p,'a');gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,2,gl.FLOAT,false,0,0);
  const U=n=>gl.getUniformLocation(p,n),uT=U('uT'),uH=U('uH'),uS=U('uS'),uR=U('uR'),uM=U('uM'),uTr=U('uTr');
  const tr=new Float32Array(28);let m=[0,0],tg=[0,0],h=0;
  const rs=()=>{const s=.65*Math.min(devicePixelRatio,1);c.width=innerWidth*s;c.height=innerHeight*s;gl.viewport(0,0,c.width,c.height);draw(0)};
  function draw(t){h+=((HUE[page]||0)-h)*.03;m[0]+=(tg[0]-m[0])*.1;m[1]+=(tg[1]-m[1])*.1;tr[0]=m[0];tr[1]=m[1];
    for(let i=1;i<14;i++){tr[i*2]+=(tr[i*2-2]-tr[i*2])*.32;tr[i*2+1]+=(tr[i*2-1]-tr[i*2+1])*.32}
    gl.uniform1f(uT,t);gl.uniform1f(uH,h);gl.uniform1f(uS,scrollY);gl.uniform2f(uR,c.width,c.height);gl.uniform2f(uM,m[0],m[1]);gl.uniform2fv(uTr,tr);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)}
  addEventListener('resize',rs);rs();
  return{draw,target:(x,y)=>{tg=[(x/innerWidth-.5)*innerWidth/innerHeight,.5-y/innerHeight]}};
}
const gl=initGL();

/* ---------- cursor, spotlight, delayed follower, depth parallax (single rAF loop) ---------- */
const dot=$('.cd'),ring=$('.cr'),blob=$('.cb'),lb=$('span',ring),root=document.documentElement;
const st={x:innerWidth/2,y:innerHeight/2};st.rx=st.bx=st.x;st.ry=st.by=st.y;
const deps=$$('[data-depth]').map(el=>({el,d:+el.dataset.depth,x:0,y:0}));
addEventListener('pointermove',e=>{st.x=e.clientX;st.y=e.clientY;dot.style.transform=`translate(${st.x}px,${st.y}px)`;
  root.style.setProperty('--x',st.x+'px');root.style.setProperty('--y',st.y+'px');gl&&gl.target(st.x,st.y);
  $$('[data-flash]').forEach(el=>{const r=el.getBoundingClientRect();el.style.setProperty('--fx',st.x-r.left+'px');el.style.setProperty('--fy',st.y-r.top+'px')});
  const t=e.target,c=t.closest('[data-cursor]');lb.textContent=c?c.dataset.cursor:'';
  ring.classList.toggle('lab',!!c);ring.classList.toggle('big',!!t.closest('a,button,[data-hover],input,textarea,.tilt'))});
function loop(t){
  st.rx+=(st.x-st.rx)*.18;st.ry+=(st.y-st.ry)*.18;st.bx+=(st.x-st.bx)*.035;st.by+=(st.y-st.by)*.035;
  ring.style.transform=`translate(${st.rx}px,${st.ry}px)`;blob.style.transform=`translate(${st.bx}px,${st.by}px)`;
  const nx=st.x/innerWidth-.5,ny=st.y/innerHeight-.5;
  if(!RM)deps.forEach(o=>{o.x+=(nx*o.d-o.x)*.06;o.y+=(ny*o.d-o.y)*.06;o.el.style.transform=`translate3d(${o.x}px,${o.y}px,0)`});
  if(gl&&!RM)gl.draw(t/1000);requestAnimationFrame(loop)}
requestAnimationFrame(loop);

/* ---------- scroll-linked effects ---------- */
const stories=$$('.story p').map(p=>{p.innerHTML=p.textContent.trim().split(' ').map(w=>`<span class="sw">${w} </span>`).join('');return{p,w:$$('.sw',p)}});
function sizeHz(){const z=$('.hzw'),tk=$('.track');if(!z)return;
  if(innerWidth>=900){z.style.height=(tk.scrollWidth-innerWidth+innerHeight)+'px'}else{z.style.height='';tk.style.transform=''}}
function onScroll(){
  const vh=innerHeight;
  stories.forEach(({p,w})=>{const r=p.getBoundingClientRect(),pr=clamp((vh*.8-r.top)/(vh*.45+r.height*.6));w.forEach((s,i)=>s.style.opacity=.12+.88*clamp(pr*w.length*1.15-i))});
  const mq=$('.mq');if(mq){const r=mq.parentNode.getBoundingClientRect();mq.style.transform=`translateX(${-clamp((vh-r.top)/(vh+r.height))*30}%)`}
  const tl=$('.tl');if(tl){const r=tl.getBoundingClientRect();$('.tlp').style.transform=`scaleY(${clamp((vh*.65-r.top)/r.height)})`}
  const z=$('.hzw');if(z&&innerWidth>=900){const tk=$('.track'),r=z.getBoundingClientRect();tk.style.transform=`translateX(${-clamp(-r.top/(z.offsetHeight-vh))*(tk.scrollWidth-innerWidth)}px)`}
  const sk=$$('.sk');sk.forEach((el,i)=>{if(i===sk.length-1)return;const p=clamp((vh*.8-sk[i+1].getBoundingClientRect().top)/(vh*.6)),n=$('.sk-in',el);n.style.transform=`scale(${1-.08*p})`;n.style.opacity=1-.55*p});
}
let tick=0;addEventListener('scroll',()=>{if(!tick){tick=1;requestAnimationFrame(()=>{tick=0;onScroll()})}},{passive:true});
addEventListener('resize',()=>{sizeHz();onScroll()});

/* ---------- page content ---------- */
const feat=$('#featured');
if(feat)PROJECTS.slice(0,3).forEach(p=>feat.insertAdjacentHTML('beforeend',`<a class="pn" href="portfolio.html" data-cursor="View"><div class="art"><i style="background:${p.g}"></i></div><div><h3>${p.t}</h3><p>${p.d}</p><span class="meta">${p.c}, ${p.y}</span></div></a>`));
const grid=$('#pg'),dim=$('.dim');let closeModal=null;
if(grid){
  let cur=0;const dt=$('.detail');
  grid.innerHTML=PROJECTS.map((p,i)=>`<button class="pcard${i%3===1?' tall':''}" data-id="${p.id}" data-c="${p.c}" data-cursor="View"><div class="art"><i style="background:${p.g}"></i></div><div class="pt"><h3>${p.t}</h3><span>${p.c}, ${p.y}</span></div></button>`).join('');
  grid.addEventListener('pointermove',e=>{const c=e.target.closest('.pcard');if(!c)return;const r=c.getBoundingClientRect();c.style.setProperty('--px',(e.clientX-r.left)/r.width-.5);c.style.setProperty('--py',(e.clientY-r.top)/r.height-.5)});
  $('#chips').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;
    $$('.chip',$('#chips')).forEach(c=>c.classList.toggle('on',c===b));let n=0;
    $$('.pcard',grid).forEach(c=>{const show=b.dataset.f==='All'||c.dataset.c===b.dataset.f;c.classList.toggle('hide',!show);
      c.classList.remove('pop');if(show){void c.offsetWidth;c.style.animationDelay=(n++*.06)+'s';c.classList.add('pop')}})});
  const open=i=>{cur=i;const p=PROJECTS[i];
    dt.innerHTML=`<div class="art lg"><i style="background:${p.g}"></i></div><h2 class="h2 s">${p.t}</h2><p class="lead">${p.d}</p><div class="mets">${p.m.map(([v,l])=>`<div><b class="g">${v}</b><span>${l}</span></div>`).join('')}</div><div class="tg">${p.tags.map(t=>`<span>${t}</span>`).join('')}</div><div class="row"><button class="btn" data-close>Close</button><button class="btn p" data-next>Next project ${ARW}</button></div>`;
    dim.classList.add('open');dim.inert=false;document.body.style.overflow='hidden'};
  closeModal=()=>{dim.classList.remove('open');dim.inert=true;document.body.style.overflow=''};
  grid.addEventListener('click',e=>{const c=e.target.closest('.pcard');if(c)open(PROJECTS.findIndex(p=>p.id===c.dataset.id))});
  dim.addEventListener('click',e=>{if(e.target===dim||e.target.closest('[data-close]'))closeModal();else if(e.target.closest('[data-next]'))open((cur+1)%PROJECTS.length)});
}
const form=$('#form');
if(form){
  $$('.chip',form).forEach(c=>c.onclick=()=>{if(c.dataset.g==='bd')$$('[data-g=bd]',form).forEach(x=>{x.classList.remove('on');x.setAttribute('aria-pressed','false')});
    c.classList.toggle('on');c.setAttribute('aria-pressed',c.classList.contains('on'))});
  form.onsubmit=e=>{e.preventDefault();const f=new FormData(form),er=$('.er',form);
    if(!f.get('n').trim()||!/^\S+@\S+\.\S+$/.test(f.get('e'))||f.get('m').trim().length<10){er.textContent='Please add your name, a valid email and a message of at least 10 characters.';return}
    er.textContent='';form.classList.add('hide');$('.done').classList.add('show')};
  $('[data-again]').onclick=()=>{form.reset();$$('.chip',form).forEach(c=>{c.classList.remove('on');c.setAttribute('aria-pressed','false')});form.classList.remove('hide');$('.done').classList.remove('show')};
}

/* ---------- boot: loader → curtain reveal → animations ---------- */
bindFx();sizeHz();onScroll();document.fonts&&document.fonts.ready.then(()=>{sizeHz();onScroll()});
function go(){document.body.classList.add('ready');curtain.classList.add('out');reveal()}
const ld=$('.loader');
if(!ld){ss.set();requestAnimationFrame(go)}
else{let v=0;const b=$('b',ld),bar=$('i',ld),t=setInterval(()=>{v=Math.min(100,v+Math.ceil(Math.random()*8));b.textContent=v;bar.style.transform=`scaleX(${v/100})`;
  if(v>=100){clearInterval(t);ss.set();setTimeout(()=>{ld.classList.add('out');go();setTimeout(()=>ld.remove(),1300)},400)}},70)}
