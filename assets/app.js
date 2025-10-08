// REPLACE START: /assets/app.js 現代化互動（可直接覆蓋）
(function(){const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);const LS_THEME='site_theme',LS_LANG='site_lang';
/* ===== 語系 ===== */
const i18n={zh:{brand:'衣衫新生｜傳統服飾轉型',home:'首頁',clothing:'服裝',men:'男裝',women:'女裝',kids:'童裝',seniors:'老人裝',services:'服務',about:'關於我們',contact:'聯繫我們',lang:'中/英',theme:'日夜',heroTitle:'讓你的傳統實體店，<strong>無痛升級</strong>直播與線上銷售',heroLead:'一套模組：蝦皮、抖音、小紅書 同步導流｜直播腳本｜上架範本｜倉庫流程｜金物流接軌',filterStyle:'風格',filterSearch:'搜尋商品',styles:'全部,休閒,街頭,正式,運動,傳統',badge:'轉型中',add:'加入詢問車',empty:'無符合條件的商品'},en:{brand:'ReNew Threads｜Retail-to-Live Commerce',home:'Home',clothing:'Clothing',men:'Men',women:'Women',kids:'Kids',seniors:'Seniors',services:'Services',about:'About',contact:'Contact',lang:'ZH/EN',theme:'Theme',heroTitle:'Transform your brick-and-mortar into <strong>live-commerce ready</strong>',heroLead:'One toolkit: Shopee, TikTok, RED routing｜Live scripts｜Listing templates｜Ops playbooks｜Payments & Logistics',filterStyle:'Style',filterSearch:'Search products',styles:'All,Casual,Street,Formal,Sport,Traditional',badge:'Transition',add:'Add to Inquiry',empty:'No matching products'}};
/* ===== 狀態 ===== */
const state={lang:localStorage.getItem(LS_LANG)||'zh',theme:localStorage.getItem(LS_THEME)||'light'};
/* ===== 主題初始化 ===== */
function applyTheme(){document.documentElement.setAttribute('data-theme',state.theme==='dark'?'dark':'');}
function toggleTheme(){state.theme=state.theme==='dark'?'light':'dark';localStorage.setItem(LS_THEME,state.theme);applyTheme();shortVibe();}
applyTheme();
/* ===== 語系渲染 ===== */
function applyLang(){const t=i18n[state.lang];$$('[data-i18n]').forEach(el=>{const k=el.getAttribute('data-i18n');if(k&&t[k])el.innerHTML=t[k]});const sel=$('#styleSelect');if(sel){sel.innerHTML=(t.styles||'').split(',').map(v=>`<option>${v}</option>`).join('');}}
function setLang(lang){state.lang=lang;localStorage.setItem(LS_LANG,lang);applyLang();refreshFilters();}
window.Site={setLang,toggleTheme};
/* ===== 手機抽屜＋遮罩 ===== */
const overlay=document.createElement('div');overlay.className='site-overlay';document.body.appendChild(overlay);
document.addEventListener('click',e=>{const m=$('.mobile-drawer');if(!m) return;if(e.target.matches('#btn-hamburger')){m.classList.add('open');overlay.classList.add('show');document.body.classList.add('drawer-open');}else if(e.target.matches('.mobile-close')||e.target===overlay){m.classList.remove('open');overlay.classList.remove('show');document.body.classList.remove('drawer-open');}});
/* ===== Header 捲動陰影 ===== */
let lastY=0, ticking=false;function onScroll(){if(!ticking){window.requestAnimationFrame(()=>{document.body.classList.toggle('is-scrolled',window.scrollY>6);ticking=false});ticking=true}}window.addEventListener('scroll',onScroll,{passive:true});onScroll();
/* ===== 商品篩選 Demo（首頁） ===== */
const data=[{id:1,name:'街頭寬版 T',style:'街頭',cat:'男裝',img:'https://picsum.photos/seed/a/800/560'},{id:2,name:'復古旗袍上衣',style:'傳統',cat:'女裝',img:'https://picsum.photos/seed/b/800/560'},{id:3,name:'親子運動套裝',style:'運動',cat:'童裝',img:'https://picsum.photos/seed/c/800/560'},{id:4,name:'亞麻休閒襯衫',style:'休閒',cat:'男裝',img:'https://picsum.photos/seed/d/800/560'},{id:5,name:'商務西裝外套',style:'正式',cat:'男裝',img:'https://picsum.photos/seed/e/800/560'},{id:6,name:'舒柔長裙',style:'休閒',cat:'女裝',img:'https://picsum.photos/seed/f/800/560'},{id:7,name:'涼感運動衣',style:'運動',cat:'老人裝',img:'https://picsum.photos/seed/g/800/560'},{id:8,name:'峇迪花紋襯衫',style:'傳統',cat:'男裝',img:'https://picsum.photos/seed/h/800/560'}];
function refreshFilters(){const sSel=$('#styleSelect');const qInp=$('#q');const grid=$('#productGrid');const catChk=$$('[name="cat"]');if(!grid||!sSel||!qInp) return;const lang=state.lang,t=i18n[lang];function mapStyle(s){const map={All:'全部',Casual:'休閒',Street:'街頭',Formal:'正式',Sport:'運動',Traditional:'傳統'};return (state.lang==='en'&&map[s])?map[s]:s}
function render(){let s=sSel.value||'全部';s=mapStyle(s);let q=(qInp.value||'').trim().toLowerCase();let cats=[...catChk].filter(x=>x.checked).map(x=>x.value);let list=data.filter(it=>s==='全部'||it.style===s).filter(it=>cats.length?cats.includes(it.cat):true).filter(it=>!q||it.name.toLowerCase().includes(q));grid.innerHTML=list.length?list.map(it=>`<div class="card reveal tilt"><img src="${it.img}" alt=""><div class="p"><div class="badge" data-i18n="badge">${t.badge}</div><h4>${it.name}</h4><div style="display:flex;gap:8px;color:var(--muted);font-size:12px"><span>${it.style}</span><span>·</span><span>${it.cat}</span></div><div style="margin-top:10px;display:flex;gap:8px"><button class="btn rippleable" aria-label="${t.add}">${t.add}</button></div></div></div>`).join(''):`<div class="alert">${t.empty}</div>`;revealNow();initTilt();initRipples();}
render();sSel.addEventListener('change',render);qInp.addEventListener('input',render);catChk.forEach(c=>c.addEventListener('change',render));}
/* ===== Scroll Reveal ===== */
let io;function revealNow(){const items=$$('.reveal:not(.in)');if(!items.length) return;if(!('IntersectionObserver'in window)){items.forEach(el=>el.classList.add('in'));return}if(!io){io=new IntersectionObserver((ents)=>{ents.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'-10% 0px'}});}items.forEach(el=>io.observe(el));}
/* ===== Tilt 卡片傾斜 ===== */
let rafId=null;function initTilt(){const cards=$$('.tilt');cards.forEach(card=>{card.onmousemove=e=>{const r=card.getBoundingClientRect();const cx=e.clientX-r.left,cy=e.clientY-r.top;const rx=((cy/r.height)-.5)*-6;const ry=((cx/r.width)-.5)*6;cancelAnimationFrame(rafId);rafId=requestAnimationFrame(()=>{card.style.transform=`translateY(-4px) rotateX(${rx}deg) rotateY(${ry}deg)`})};card.onmouseleave=()=>{cancelAnimationFrame(rafId);card.style.transform='translateY(0) rotateX(0) rotateY(0)'};});}
/* ===== Ripple 漣漪 ===== */
function initRipples(){document.querySelectorAll('.rippleable').forEach(btn=>{btn.onclick=function(ev){const r=document.createElement('span');r.className='ripple';const rect=this.getBoundingClientRect();r.style.left=(ev.clientX-rect.left)+'px';r.style.top=(ev.clientY-rect.top)+'px';this.appendChild(r);setTimeout(()=>r.remove(),600)};});}
/* ===== 輕微氣氛動畫 ===== */
function shortVibe(){const kv=$('.kv .illus');if(!kv) return;kv.animate([{filter:'saturate(1) brightness(1)'},{filter:'saturate(1.08) brightness(1.04)'}],{duration:380,iterations:1,direction:'alternate',easing:'ease-out'});}
/* ===== 初始化 ===== */
document.addEventListener('DOMContentLoaded',()=>{applyLang();refreshFilters();revealNow();initTilt();initRipples();shortVibe();});
/* 便利按鈕：與既有 HTML 的按鈕相容 */
document.addEventListener('click',e=>{if(e.target.matches('[data-i18n="lang"],.btn-lang')){setLang(localStorage.getItem(LS_LANG)==='en'?'zh':'en')}if(e.target.matches('[data-i18n="theme"],.btn-theme')){toggleTheme()}});
})();
// REPLACE END: /assets/app.js
