/* article-page.js — shared behaviour for HOUSE603 article pages.
   Nav, reveal-on-scroll, reading progress, glass tilt, CTA modal,
   cookie consent, and config-gated Google AdSense loading. */
(function () {
  "use strict";

  var y = document.getElementById('yr');
  if (y) y.textContent = new Date().getFullYear();

  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 40); };
    onScroll(); addEventListener('scroll', onScroll, { passive: true });
  }

  var menu = document.getElementById('menu'), burger = document.getElementById('burger');
  if (burger && menu) {
    burger.addEventListener('click', function () { menu.classList.toggle('open'); });
    menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') menu.classList.remove('open'); });
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  var prog = document.getElementById('prog');
  if (prog) {
    var setProg = function () {
      var d = document.documentElement, max = (d.scrollHeight - d.clientHeight) || 1;
      prog.style.transform = 'scaleX(' + (d.scrollTop / max) + ')';
    };
    setProg(); addEventListener('scroll', setProg, { passive: true });
  }

  var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  if (fine && !reduce) {
    document.querySelectorAll('.glass').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  var modal = document.getElementById('ctaModal');
  if (modal) {
    var openM = function (e) { if (e) e.preventDefault(); modal.classList.add('open'); };
    var closeM = function () { modal.classList.remove('open'); };
    document.querySelectorAll('[data-cta]').forEach(function (b) { b.addEventListener('click', openM); });
    var mc = document.getElementById('modalClose'); if (mc) mc.addEventListener('click', closeM);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeM(); });
  }

  /* ---- Consent + AdSense (only loads once configured and consented) ---- */
  var CONFIG = { adsenseClient: 'ca-pub-9118555801196013' };
  var Store = {
    get: function (k, d) { try { var v = localStorage.getItem('h6_' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('h6_' + k, JSON.stringify(v)); } catch (e) { } }
  };
  var consent = document.getElementById('consent'), adsLoaded = false;

  function loadAds(mode) {
    if (adsLoaded || !CONFIG.adsenseClient) return;
    adsLoaded = true;
    if (mode === 'essential') { window.adsbygoogle = window.adsbygoogle || []; window.adsbygoogle.requestNonPersonalizedAds = 1; }
    var s = document.createElement('script');
    s.async = true; s.crossOrigin = 'anonymous';
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(CONFIG.adsenseClient);
    s.onload = function () {
      document.querySelectorAll('ins.adsbygoogle').forEach(function (ins) {
        ins.setAttribute('data-ad-client', CONFIG.adsenseClient);
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) { }
      });
    };
    document.head.appendChild(s);
  }

  function setConsent(v) {
    Store.set('consent', v);
    if (consent) consent.classList.remove('show');
    if (v === 'all') loadAds('all');
    else if (v === 'essential') loadAds('essential');
  }

  var c = Store.get('consent', null);
  if (c === 'all') loadAds('all');
  else if (c === 'essential') loadAds('essential');
  else if (consent) consent.classList.add('show');

  var ca = document.getElementById('c-accept'), ce = document.getElementById('c-ess'), cr = document.getElementById('c-rej');
  if (ca) ca.addEventListener('click', function () { setConsent('all'); });
  if (ce) ce.addEventListener('click', function () { setConsent('essential'); });
  if (cr) cr.addEventListener('click', function () { setConsent('reject'); });
})();
