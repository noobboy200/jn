/* ========== Modern Retail JS (Readable) ========== */
(() => {
  // 0) Helpers & State
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  const LS = { THEME: "site_theme", LANG: "site_lang" };
  const mqDark = matchMedia("(prefers-color-scheme: dark)");
  const state = {
    theme: localStorage.getItem(LS.THEME) || (mqDark.matches ? "dark" : "light"),
    lang: localStorage.getItem(LS.LANG) || "zh",
  };

  // 1) i18n（只保留必要字串；要擴充直接加）
  const T = {
    zh: {
      brand: "衣衫新生｜傳統服飾轉型",
      home: "首頁", clothing: "服裝", men: "男裝", women: "女裝", kids: "童裝", seniors: "老人裝",
      services: "服務", about: "關於我們", contact: "聯繫我們", lang: "中/英", theme: "日夜",
      heroTitle: "讓你的傳統實體店，<strong>無痛升級</strong>直播與線上銷售",
      heroLead: "一套模組：蝦皮、抖音、小紅書 同步導流｜直播腳本｜上架範本｜倉庫流程｜金物流接軌",
      filterStyle: "風格", filterSearch: "搜尋商品",
      styles: "全部,休閒,街頭,正式,運動,傳統",
      badge: "轉型中", add: "加入詢問車", empty: "無符合條件的商品",
    },
    en: {
      brand: "ReNew Threads｜Retail-to-Live Commerce",
      home: "Home", clothing: "Clothing", men: "Men", women: "Women", kids: "Kids", seniors: "Seniors",
      services: "Services", about: "About", contact: "Contact", lang: "ZH/EN", theme: "Theme",
      heroTitle: "Transform your brick-and-mortar into <strong>live-commerce ready</strong>",
      heroLead: "One toolkit: Shopee, TikTok, RED routing｜Live scripts｜Listing templates｜Ops playbooks｜Payments & Logistics",
      filterStyle: "Style", filterSearch: "Search products",
      styles: "All,Casual,Street,Formal,Sport,Traditional",
      badge: "Transition", add: "Add to Inquiry", empty: "No matching products",
    },
  };

  // 2) Theme（太陽/月亮 icon、記憶、跟隨系統）
  const iconSun = `
    <svg class="theme-sun" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4"></circle>
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l-1.5-1.5M20.5 20.5L19 19M5 19l-1.5 1.5M20.5 3.5L19 5"
            stroke-width="1.8" stroke-linecap="round"></path>
    </svg>`;
  const iconMoon = `
    <svg class="theme-moon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 12.4A8.6 8.6 0 0 1 10.6 2a.8.8 0 0 0-.9 1.1A7 7 0 1 0 20 13.3a.8.8 0 0 0 1-0.9z"></path>
    </svg>`;

  const applyTheme = () => {
    document.documentElement.setAttribute("data-theme", state.theme === "dark" ? "dark" : "");
    const btn = document.querySelector('[data-i18n="theme"], .btn-theme');
    if (!btn) return;
    btn.classList.add("btn-icon");
    btn.innerHTML = state.theme === "dark" ? iconSun : iconMoon;
    btn.setAttribute("aria-label", state.theme === "dark" ? "切換為淺色主題" : "Switch to dark theme");
  };
  const setTheme = (next) => {
    state.theme = next;
    localStorage.setItem(LS.THEME, next);
    applyTheme();
  };
  const toggleTheme = () => setTheme(state.theme === "dark" ? "light" : "dark");

  mqDark.addEventListener?.("change", (e) => {
    if (!localStorage.getItem(LS.THEME)) {
      state.theme = e.matches ? "dark" : "light";
      applyTheme();
    }
  });

  // 3) Lang（渲染 data-i18n；theme 由 icon 控制不覆蓋）
  const applyLang = () => {
    const t = T[state.lang];
    $$("[data-i18n]").forEach((el) => {
      const k = el.getAttribute("data-i18n");
      if (!k || k === "theme") return;
      if (t[k]) el.innerHTML = t[k];
    });
    const sel = $("#styleSelect");
    if (sel) sel.innerHTML = (t.styles || "").split(",").map((v) => `<option>${v}</option>`).join("");
  };
  const setLang = (lang) => {
    state.lang = lang;
    localStorage.setItem(LS.LANG, lang);
    applyLang();
    refreshFilters?.();
  };

  // 4) Mobile Drawer
  const initDrawer = () => {
    const overlay = document.createElement("div");
    overlay.className = "site-overlay";
    document.body.appendChild(overlay);

    document.addEventListener("click", (e) => {
      const drawer = $(".mobile-drawer");
      if (!drawer) return;
      if (e.target.matches("#btn-hamburger")) {
        drawer.classList.add("open"); overlay.classList.add("show");
      } else if (e.target.matches(".mobile-close") || e.target === overlay) {
        drawer.classList.remove("open"); overlay.classList.remove("show");
      }
    });
  };

  // 5) Header Shadow on Scroll
  const initHeaderShadow = () => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      requestAnimationFrame(() => {
        document.body.classList.toggle("is-scrolled", scrollY > 6);
        ticking = false;
      });
      ticking = true;
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  };

  // 6) Dropdown（穩定：hover 橋接 + 觸控點擊）
  const initDropdowns = () => {
    const isTouch = matchMedia("(hover: none)").matches;
    $$(".nav .dropdown").forEach((dd) => {
      let timer = null;
      const open = () => { clearTimeout(timer); dd.classList.add("open"); };
      const close = () => { timer = setTimeout(() => dd.classList.remove("open"), 150); };
      dd.addEventListener("mouseenter", open);
      dd.addEventListener("mouseleave", close);
      dd.querySelector(":scope > a")?.addEventListener("click", (e) => {
        if (isTouch) { e.preventDefault(); dd.classList.toggle("open"); }
      });
      document.addEventListener("click", (e) => { if (!dd.contains(e.target)) dd.classList.remove("open"); });
    });
  };

  // 7) Product Filters（首頁才會渲染）
  const SAMPLE = [
    { id:1, name:"街頭寬版 T", style:"街頭", cat:"男裝", img:"https://picsum.photos/seed/a/800/560" },
    { id:2, name:"復古旗袍上衣", style:"傳統", cat:"女裝", img:"https://picsum.photos/seed/b/800/560" },
    { id:3, name:"親子運動套裝", style:"運動", cat:"童裝", img:"https://picsum.photos/seed/c/800/560" },
    { id:4, name:"亞麻休閒襯衫", style:"休閒", cat:"男裝", img:"https://picsum.photos/seed/d/800/560" },
    { id:5, name:"商務西裝外套", style:"正式", cat:"男裝", img:"https://picsum.photos/seed/e/800/560" },
    { id:6, name:"舒柔長裙", style:"休閒", cat:"女裝", img:"https://picsum.photos/seed/f/800/560" },
    { id:7, name:"涼感運動衣", style:"運動", cat:"老人裝", img:"https://picsum.photos/seed/g/800/560" },
    { id:8, name:"峇迪花紋襯衫", style:"傳統", cat:"男裝", img:"https://picsum.photos/seed/h/800/560" },
  ];
  const refreshFilters = () => {
    const grid = $("#productGrid"), sel = $("#styleSelect"), q = $("#q"), cats = $$('[name="cat"]');
    if (!grid || !sel || !q) return; // 非首頁直接跳過
    const t = T[state.lang], map = { All:"全部", Casual:"休閒", Street:"街頭", Formal:"正式", Sport:"運動", Traditional:"傳統" };
    const mapStyle = (s) => (state.lang === "en" && map[s]) ? map[s] : s;

    const render = () => {
      const s = mapStyle(sel.value || "全部");
      const kw = (q.value || "").trim().toLowerCase();
      const picked = [...cats].filter((x) => x.checked).map((x) => x.value);
      const list = SAMPLE
        .filter((it) => s === "全部" || it.style === s)
        .filter((it) => !picked.length || picked.includes(it.cat))
        .filter((it) => !kw || it.name.toLowerCase().includes(kw));

      grid.innerHTML = list.length
        ? list.map((it) => `
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
          </div>`).join("")
        : `<div class="alert">${t.empty}</div>`;

      revealRun(); tiltRun(); rippleRun();
    };

    render();
    sel.addEventListener("change", render);
    q.addEventListener("input", render);
    cats.forEach((c) => c.addEventListener("change", render));
  };

  // 8) Reveal / Tilt / Ripple（想關閉 → 註解掉 init() 內對應 3 行）
  let io;
  const revealRun = () => {
    const els = $$(".reveal:not(.in)"); if (!els.length) return;
    if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("in")); return; }
    io ||= new IntersectionObserver((ents) => ents.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { rootMargin: "-10% 0px" });
    els.forEach((el) => io.observe(el));
  };

  let rafId = null;
  const tiltRun = () => {
    $$(".tilt").forEach((card) => {
      card.onmousemove = (e) => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          card.style.transform = `translateY(-4px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        });
      };
      card.onmouseleave = () => { cancelAnimationFrame(rafId); card.style.transform = "translateY(0)"; };
    });
  };

  const rippleRun = () => {
    $$(".rippleable").forEach((btn) => {
      btn.onclick = (ev) => {
        const r = document.createElement("span");
        r.className = "ripple";
        const rect = btn.getBoundingClientRect();
        r.style.left = (ev.clientX - rect.left) + "px";
        r.style.top = (ev.clientY - rect.top) + "px";
        btn.appendChild(r);
        setTimeout(() => r.remove(), 600);
      };
    });
  };

  // 9) Global click（語系 / 主題），用 closest() 讓 SVG 也能點
  document.addEventListener("click", (e) => {
    const langBtn = e.target.closest('[data-i18n="lang"], .btn-lang');
    if (langBtn) { setLang(localStorage.getItem(LS.LANG) === "en" ? "zh" : "en"); return; }
    const themeBtn = e.target.closest('[data-i18n="theme"], .btn-theme, .btn-icon');
    if (themeBtn) { toggleTheme(); return; }
  });

  // 10) Init
  document.addEventListener("DOMContentLoaded", () => {
    applyTheme();
    applyLang();
    initDrawer();
    initHeaderShadow();
    initDropdowns();
    refreshFilters();       // ← 不要篩選：註解此行
    revealRun();            // ← 不要 reveal：註解此行
    tiltRun();              // ← 不要 tilt：註解此行
    rippleRun();            // ← 不要 ripple：註解此行
  });

  // 11) 對外 API（保留舊 HTML 調用相容）
  window.Site = { setLang, toggleTheme };
})();
