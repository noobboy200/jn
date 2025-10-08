/* ====== Modern Retail App (Full) ====== */
(function(){
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);
  const LS_THEME='site_theme', LS_LANG='site_lang';

  /* i18n */
  const i18n={
    zh:{brand:'衣衫新生｜傳統服飾轉型',home:'首頁',clothing:'服裝',men:'男裝',women:'女裝',kids:'童裝',seniors:'老人裝',services:'服務',about:'關於我們',contact:'聯繫我們',lang:'中/英',theme:'日夜',heroTitle:'讓你的傳統實體店，<strong>無痛升級</strong>直播與線上銷售',heroLead:'一套模組：蝦皮、抖音、小紅書 同步導流｜直播腳本｜上架範本｜倉庫流程｜金物流接軌',filterStyle:'風格',filterSearch:'搜尋商品',styles:'全部,休閒,街頭,正式,運動,傳統',badge:'轉型中',add:'加入詢問車',empty:'無符合條件的商品'},
    en:{brand:'ReNew Threads｜Retail-to-Live Commerce',home:'Home',clothing:'Clothing',men:'Men',women:'Women',kids:'Kids',seniors:'Seniors',services:'Services',about:'About',contact:'Contact',lang:'ZH/EN',theme:'Theme',heroTitle:'Transform your brick-and-mortar into <strong>live-commerce ready</strong>',heroLead:'One toolkit: Shopee, TikTok, RED routing｜Live scripts｜Listing templates｜Ops playbooks｜Payments & Logistics',filterStyle:'Style',filterSearch:'Search products',styles:'All,Casual,Street,Formal,Sport,Traditional',badge:'Transition',add:'Add to Inquiry',empty:'No matching products'}
  };

  /* 狀態 */
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const state = {
    lang: localStorage.getItem(LS_LANG) || 'zh',
    theme: localStorage.getItem(LS_THEME) || (mq.matches ? 'dark' : 'light')
  };

  /* 主題與圖示 */
  function themeIconSVG(mode){
    return mode==='dark'
      ? '<svg class="theme-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l-1.5-1.5M20.5 20.5L19 19M5 19l-1.5 1.5M20.5 3.5L19 5" stroke-width="1.8" stroke-linecap="round"/></svg>'
      : '<svg class="theme-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.4A8.6 8.6 0 0 1 10.6 2a.8.8 0 0 0-.9 1.1A7 7 0 1 0 20 13.3a.8.8 0 0 0 1-0.9z"/></svg>';
  }
  function applyTheme(){
    document.documentElement.setAttribute('data-theme', state.theme==='dark' ? 'dark' : '');
    const btn = document.querySelector('[data-i18n="theme"],.btn-theme');
    if(btn){
      btn.classList.add('btn-icon');
      btn.innerHTML = themeIconSVG(state.theme);
      btn.setAttribute('aria-label', state.theme==='dark' ? '切換為淺色主題' : 'Switch to dark theme');
    }
  }
  function setTheme(next){
    state.theme = next;
    localStorage.setItem(LS_THEME, next);
    applyTheme();
    shortVibe();
  }
  function toggleTheme(){ setTheme(state.theme==='dark' ? 'light' : 'dark'); }

  /* 語系 */
  function applyLang(){
    const t=i18n[state.lang];
    $$('[data-i18n]').forEach(el=>{
      const k=el.getAttribute('data-i18n');
      if(!k) return;
      if(k==='theme') return; // 主題按鈕由圖示控制
      if(t[k]) el.innerHTML = t[k];
    });
    const sel=$('#styleSelect');
    if(sel){ sel.innerHTML=(t.styles||'').split(',').map(v=>`<option>${v}</option>`).join(''); }
  }
  function setLang(lang){
    state.lang=lang; localStorage.setItem(LS_LANG, lang);
    applyLang(); refreshFilters?.();
  }

  /* 手機抽屜＋遮罩 */
  const overlay=document.createElement('div'); overlay.className='site-overlay';
  document.addEventListener('DOMContentLoaded',()=>{ document.body.appendChild(overlay); });
  document.addEventListener('click',e=>{
    const m = $('.mobile-drawer'); if(!m) return;
    if(e.target.matches('#btn-hamburger')){ m.classList.add('open'); overlay.classList.add('show'); }
    else if(e.target.matches('.mobile-close') || e.target===overlay){ m.classList.remove('open'); overlay.classList.remove('show'); }
  });

  /* Header 捲動陰影 */
  let ticking=false;
  window.addEventListener('scroll', ()=>{
    if(!ticking){
      requestAnimationFrame(()=>{
        document.body.classList.toggle('is-scrolled', window.scrollY>6);
        ticking=false;
      });
      ticking=true;
    }
  }, {passive:true});

  /* 下拉選單（穩定） */
  (function(){
    const isTouch = matchMedia('(hover: none)').matches;
    $$('.nav .dropdown').forEach(dd=>{
      let t=null;
      const open = ()=>{ clearTimeout(t); dd.classList.add('open'); };
      const close = ()=>{ t=setTimeout(()=>dd.classList.remove('open'),150); };
      dd.addEventListener('mouseenter', open);
      dd.addEventListener('mouseleave', close);
      const trigger = dd.querySelector(':scope > a');
      if(trigger){
        trigger.addEventListener('click', e=>{
          if(isTouch){ e.preventDefault(); dd.classList.toggle('open'); }
        });
      }
      document.addEventListener('click', e=>{ if(!dd.contains(e.target)) dd.classList.remove('open'); });
    });
  })();

  /* 商品篩選（首頁才會有元素就不報錯） */
  const data=[
    {id:1,name:'街頭寬版 T',style:'街頭',cat:'男裝',img:'https://picsum.photos/seed/a/800/560'},
    {id:2,name:'復古旗袍上衣',style:'傳統',cat:'女裝',img:'https://picsum.photos/seed/b/800/560'},
    {id:3,name:'親子運動套裝',style:'運動',cat:'童裝',img:'https://picsum.photos/seed/c/800/560'},
    {id:4,name:'亞麻休閒襯衫',style:'休閒',cat:'男裝',img:'https://picsum.photos/seed/d/800/560'},
    {id:5,name:'商務西裝外套',style:'正式',cat:'男裝',img:'https://picsum.photos/seed/e/800/560'},
    {id:6,name:'舒柔長裙',style:'休閒',cat:'女裝',img:'https://picsum.photos/seed/f/800/560'},
    {id:7,name:'涼感運動衣',style:'運動',cat:'老人裝',img:'https://picsum.photos/seed/g/800/560'},
    {id:8,name:'峇迪花紋襯衫',style:'傳統',cat:'男裝',img:'https://picsum.photos/seed/h/800/560'}
  ];
  function refreshFilters(){
    const sSel=$('#styleSelect'), qInp=$('#q'), grid=$('#productGrid'), catChk=$$('[name="cat"]');
    if(!grid||!sSel||!qInp) return;
    const t=i18n[state.lang];
    const map={All:'全部',Casual:'休閒',Street:'街頭',Formal:'正式',Sport:'運動',Traditional:'傳統'};
    const mapStyle=s=> (state.lang==='en'&&map[s])?map[s]:s;
    function render(){
      let s=mapStyle(sSel.value||'全部');
      let q=(qInp.value||'').trim().toLowerCase();
      let cats=[...catChk].filter(x=>x.checked).map(x=>x.value);
      let list=data
        .filter(it=>s==='全部'||it.style===s)
        .filter(it=>cats.length?cats.includes(it.cat):true)
        .filter(it=>!q||it.name.toLowerCase().includes(q));
      grid.innerHTML = list.length
        ? list.map(it=>`
          <div class="card reveal tilt">
            <img src="${it.img}" alt="">
            <div class="p">
              <div class="badge" data-i18n="badge">${t.badge}</div>
              <h4>${it.name}</h4>
              <div style="display:flex;gap:8px;color:var(--muted);font-size:12px">
                <span>${it.style}</span><span>·</span><span>${it.cat}</span>
              </div>
              <div style="margin-top:10px;display:flex;gap:8px">
                <button class="btn rippleable" aria-label="${t.add}">${t.add}</button>
              </div>
            </div>
          </div>`).join('')
        : `<div class="alert">${t.empty}</div>`;
      revealNow(); initTilt(); initRipples();
    }
    render();
    sSel.addEventListener('change',render);
    qInp.addEventListener('input',render);
    catChk.forEach(c=>c.addEventListener('change',render));
  }

  /* Reveal / Tilt / Ripple */
  let io;
  function revealNow(){
    const items=$$('.reveal:not(.in)'); if(!items.length) return;
    if(!('IntersectionObserver' in window)){ items.forEach(el=>el.classList.add('in')); return; }
    if(!io){
      io=new IntersectionObserver((ents)=>{
        ents.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
      }, {rootMargin:'-10% 0px'});
    }
    items.forEach(el=>io.observe(el));
  }
  let rafId=null;
  function initTilt(){
    $$('.tilt').forEach(card=>{
      card.onmousemove=e=>{
        const r=card.getBoundingClientRect(), cx=e.clientX-r.left, cy=e.clientY-r.top;
        const rx=((cy/r.height)-.5)*-6, ry=((cx/r.width)-.5)*6;
        cancelAnimationFrame(rafId);
        rafId=requestAnimationFrame(()=>{ card.style.transform=`translateY(-4px) rotateX(${rx}deg) rotateY(${ry}deg)`; });
      };
      card.onmouseleave=()=>{ cancelAnimationFrame(rafId); card.style.transform='translateY(0) rotateX(0) rotateY(0)'; };
    });
  }
  function initRipples(){
    document.querySelectorAll('.rippleable').forEach(btn=>{
      btn.onclick=function(ev){
        const r=document.createElement('span'); r.className='ripple';
        const rect=this.getBoundingClientRect();
        r.style.left=(ev.clientX-rect.left)+'px'; r.style.top=(ev.clientY-rect.top)+'px';
        this.appendChild(r); setTimeout(()=>r.remove(),600);
      };
    });
  }

  /* 輕微氣氛 */
  function shortVibe(){
    const kv=$('.kv .illus'); if(!kv) return;
    kv.animate(
      [{filter:'saturate(1) brightness(1)'},{filter:'saturate(1.08) brightness(1.04)'}],
      {duration:380,iterations:1,direction:'alternate',easing:'ease-out'}
    );
  }

  /* 初始化 */
  document.addEventListener('DOMContentLoaded', ()=>{
    applyTheme();
    applyLang();
    refreshFilters();
    revealNow(); initTilt(); initRipples(); shortVibe();

    // 事件代理（closest）：點到 SVG 也生效
    document.addEventListener('click', (e)=>{
      const langBtn = e.target.closest('[data-i18n="lang"],.btn-lang');
      if(langBtn){ setLang(localStorage.getItem(LS_LANG)==='en'?'zh':'en'); return; }
      const themeBtn = e.target.closest('[data-i18n="theme"],.btn-theme,.btn-icon');
      if(themeBtn){ toggleTheme(); return; }
    });
  });

  // 跟隨系統主題（若未手動設定）
  mq.addEventListener?.('change', e=>{
    if(!localStorage.getItem(LS_THEME)){
      state.theme = e.matches ? 'dark' : 'light';
      applyTheme();
    }
  });

  // 對外（舊 HTML 仍可呼叫）
  window.Site={ setLang, toggleTheme };
})();
