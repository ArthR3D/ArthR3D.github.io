/* ============================================
   Arthur C. Portfolio — IMMERSIVE INTERACTIVE
   Video Hero + Live Terminal + AI Chatbot
   ============================================ */

(function () {
  'use strict';

  /* ==============================
     1. FAST LOADER (500ms)
     ============================== */
  function initLoader() {
    var loader = document.getElementById('loader');
    if (!loader) return;

    window.addEventListener('load', function () {
      setTimeout(function () {
        document.body.classList.add('loaded');
        initHeroAnimations();
      }, 500);
    });

    // Fallback max 1.5s
    setTimeout(function () {
      document.body.classList.add('loaded');
      initHeroAnimations();
    }, 1500);
  }

  /* ==============================
     2. SMOOTH SCROLL (Lenis)
     ============================== */
  var lenis;

  function initSmoothScroll() {
    if (typeof Lenis === 'undefined') return;

    lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ==============================
     3. CUSTOM CURSOR
     ============================== */
  function initCursor() {
    var dot = document.getElementById('cursorDot');
    var circle = document.getElementById('cursorCircle');
    if (!dot || !circle || 'ontouchstart' in window) return;

    var mouseX = 0, mouseY = 0, dotX = 0, dotY = 0, circleX = 0, circleY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX; mouseY = e.clientY;
    }, { passive: true });

    function animateCursor() {
      dotX += (mouseX - dotX) * 0.5; dotY += (mouseY - dotY) * 0.5;
      dot.style.left = dotX + 'px'; dot.style.top = dotY + 'px';
      circleX += (mouseX - circleX) * 0.12; circleY += (mouseY - circleY) * 0.12;
      circle.style.left = circleX + 'px'; circle.style.top = circleY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('a, button, .project-card, .bento-item, .service-card, .tech-card, .contact-card, .filter-btn, .magnetic-btn, .video-card, .chatbot-toggle, .chatbot-suggestion').forEach(function (el) {
      el.addEventListener('mouseenter', function () { dot.classList.add('hovering'); circle.classList.add('hovering'); });
      el.addEventListener('mouseleave', function () { dot.classList.remove('hovering'); circle.classList.remove('hovering'); });
    });
  }

  /* ==============================
     4. SCROLL PROGRESS
     ============================== */
  function initScrollProgress() {
    var bar = document.getElementById('scrollProgress');
    if (!bar) return;
    window.addEventListener('scroll', function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    }, { passive: true });
  }

  /* ==============================
     5. MAGNETIC BUTTONS
     ============================== */
  function initMagneticButtons() {
    if ('ontouchstart' in window) return;
    document.querySelectorAll('.magnetic-btn').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.3) + 'px, ' + (y * 0.3) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(function () { btn.style.transition = ''; }, 400);
      });
    });
  }

  /* ==============================
     6. HERO ANIMATIONS
     ============================== */
  function initHeroAnimations() {
    if (typeof gsap !== 'undefined') {
      var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.to('.hero-content', { opacity: 1, y: 0, duration: 0.6 })
        .to('.hero-badge', { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
        .to('.hero-title', { opacity: 1, y: 0, duration: 0.7 }, '-=0.3')
        .to('.hero-sub', { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
        .to('.hero-stats', { opacity: 1, y: 0, duration: 0.5 }, '-=0.2')
        .to('.hero-cta', { opacity: 1, y: 0, duration: 0.5 }, '-=0.2');
    } else {
      ['.hero-content', '.hero-badge', '.hero-title', '.hero-sub', '.hero-stats', '.hero-cta'].forEach(function (sel, i) {
        var el = document.querySelector(sel);
        if (el) {
          setTimeout(function () {
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            el.style.opacity = '1'; el.style.transform = 'translateY(0)';
          }, i * 150);
        }
      });
    }
  }

  /* ==============================
     7. GSAP SCROLL ANIMATIONS
     ============================== */
  function initGSAPAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      initFallbackAnimations();
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.section-title').forEach(function (el) {
      gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 85%' }, y: 60, opacity: 0, duration: 1, ease: 'power3.out' });
    });
    gsap.utils.toArray('.section-subtitle').forEach(function (el) {
      gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 85%' }, y: 40, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' });
    });
    gsap.utils.toArray('.anim-slide').forEach(function (el, i) {
      gsap.to(el, { scrollTrigger: { trigger: el, start: 'top 88%' }, y: 0, opacity: 1, duration: 0.8, delay: (i % 4) * 0.1, ease: 'power3.out' });
    });

    ScrollTrigger.batch('.bento-item', {
      start: 'top 85%',
      onEnter: function (el) { gsap.from(el, { y: 60, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }); },
      once: true
    });
    ScrollTrigger.batch('.service-card', {
      start: 'top 85%',
      onEnter: function (el) { gsap.from(el, { y: 60, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }); },
      once: true
    });
    ScrollTrigger.batch('.tech-card', {
      start: 'top 85%',
      onEnter: function (el) { gsap.from(el, { y: 50, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }); },
      once: true
    });
    ScrollTrigger.batch('.tech-stat-card', {
      start: 'top 85%',
      onEnter: function (el) { gsap.from(el, { y: 40, opacity: 0, scale: 0.9, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)' }); },
      once: true
    });
    ScrollTrigger.batch('.video-card', {
      start: 'top 85%',
      onEnter: function (el) { gsap.from(el, { y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }); },
      once: true
    });

    var showreelPlayer = document.querySelector('.showreel-player');
    if (showreelPlayer) {
      gsap.from(showreelPlayer, {
        scrollTrigger: { trigger: showreelPlayer, start: 'top 85%' },
        y: 60, opacity: 0, scale: 0.96, duration: 1, ease: 'power3.out'
      });
    }
  }

  function initFallbackAnimations() {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.05, rootMargin: '50px 0px 0px 0px' });
    document.querySelectorAll('.anim-slide').forEach(function (el) { observer.observe(el); });
    // Force all visible after 3s as safety net
    setTimeout(function () {
      document.querySelectorAll('.anim-slide').forEach(function (el) { el.classList.add('visible'); });
    }, 3000);
  }

  /* ==============================
     8. COUNTER ANIMATION
     ============================== */
  function initCounters() {
    var counters = document.querySelectorAll('.counter');
    var observed = new Set();
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !observed.has(entry.target)) {
          observed.add(entry.target);
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { observer.observe(c); });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var duration = 2000;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var p = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - (1 - p) * (1 - p);
      el.textContent = Math.floor(eased * target);
      if (p < 1) requestAnimationFrame(step); else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  /* ==============================
     9. NAVBAR
     ============================== */
  function initNav() {
    var nav = document.getElementById('nav');
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    var burger = document.getElementById('navBurger');
    var mobileMenu = document.getElementById('navMobile');
    if (burger && mobileMenu) {
      burger.addEventListener('click', function () {
        mobileMenu.classList.toggle('open');
        burger.classList.toggle('open');
      });
      mobileMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          mobileMenu.classList.remove('open');
          burger.classList.remove('open');
        });
      });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          var top = target.getBoundingClientRect().top + window.scrollY - 72;
          if (lenis) lenis.scrollTo(top, { duration: 1.2 });
          else window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ==============================
     10. LANGUAGE TOGGLE
     ============================== */
  function initLanguageToggle() {
    var toggles = document.querySelectorAll('#langToggle, #langToggleMobile');
    var currentLang = localStorage.getItem('portfolio-lang') || 'fr';

    function setLang(lang) {
      currentLang = lang;
      localStorage.setItem('portfolio-lang', lang);
      document.documentElement.setAttribute('data-lang', lang);
      document.querySelectorAll('[data-fr][data-en]').forEach(function (el) {
        el.textContent = el.getAttribute('data-' + lang);
      });
      // Update placeholders
      document.querySelectorAll('[data-' + lang + '-placeholder]').forEach(function (el) {
        el.placeholder = el.getAttribute('data-' + lang + '-placeholder');
      });
      toggles.forEach(function (btn) { btn.textContent = lang === 'fr' ? 'EN' : 'FR'; });
    }

    // Apply saved language on load
    if (currentLang !== 'fr') setLang(currentLang);

    toggles.forEach(function (btn) {
      btn.addEventListener('click', function () { setLang(currentLang === 'fr' ? 'en' : 'fr'); });
    });
  }

  /* ==============================
     11. PORTFOLIO FILTER
     ============================== */
  function initPortfolioFilter() {
    var btns = document.querySelectorAll('.filter-btn');
    var cards = document.querySelectorAll('.bento-item');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        cards.forEach(function (card) {
          var cat = card.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            card.classList.remove('hidden');
            if (typeof gsap !== 'undefined') {
              gsap.fromTo(card, { opacity: 0, y: 30, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' });
            }
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ==============================
     12. SWIPER INIT
     ============================== */
  function initSwipers() {
    if (typeof Swiper === 'undefined') return;
    document.querySelectorAll('.project-swiper').forEach(function (el) {
      new Swiper(el, {
        loop: true, speed: 600, effect: 'fade', fadeEffect: { crossFade: true },
        autoplay: { delay: 4000, disableOnInteraction: true, pauseOnMouseEnter: true },
        pagination: { el: el.querySelector('.swiper-pagination'), clickable: true },
        navigation: {
          prevEl: el.querySelector('.swiper-button-prev'),
          nextEl: el.querySelector('.swiper-button-next')
        }
      });
    });
  }

  /* ==============================
     13. SHOWREEL VIDEO PLAYER
     ============================== */
  function initShowreel() {
    var video = document.getElementById('mainShowreel');
    var playBtn = document.getElementById('showreelPlayBtn');
    var muteBtn = document.getElementById('showreelMuteBtn');
    if (!video || !playBtn) return;

    var poster = document.getElementById('showreelPoster');
    function showVideo() {
      video.style.display = 'block';
      video.preload = 'auto';
      video.play().then(function () {
        if (poster) poster.style.display = 'none';
        playBtn.classList.add('hidden');
      }).catch(function () {});
    }
    function showPoster() {
      video.pause();
      if (poster) poster.style.display = 'block';
      playBtn.classList.remove('hidden');
    }
    playBtn.addEventListener('click', showVideo);
    video.addEventListener('click', function () {
      if (video.paused) showVideo();
      else showPoster();
    });
    if (muteBtn) {
      muteBtn.addEventListener('click', function () {
        video.muted = !video.muted;
        muteBtn.innerHTML = video.muted
          ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
      });
    }
    // Pause when out of view
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting && !video.paused) {
          showPoster();
        }
      });
    }, { threshold: 0.3 });
    obs.observe(video);
  }

  /* ==============================
     14. VIDEO CARDS (hover play + lazy load)
     ============================== */
  function initVideoCards() {
    // Lazy load videos when near viewport
    var lazyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var video = entry.target;
          if (video.preload === 'none') video.preload = 'metadata';
          lazyObserver.unobserve(video);
        }
      });
    }, { rootMargin: '200px' });

    document.querySelectorAll('video[preload="none"]').forEach(function (v) {
      lazyObserver.observe(v);
    });

    // Click to play video cards (poster img → video replacement)
    document.querySelectorAll('.video-card[data-video]').forEach(function (card) {
      card.addEventListener('click', function () {
        var src = card.getAttribute('data-video');
        if (!src) return;
        var existing = card.querySelector('video');
        if (existing) { // Already has video, toggle play
          if (existing.paused) existing.play().catch(function () {});
          else existing.pause();
          return;
        }
        var img = card.querySelector('img');
        var video = document.createElement('video');
        video.src = src;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.autoplay = true;
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        if (img) img.replaceWith(video);
        var playBtn = card.querySelector('.video-card-play');
        if (playBtn) playBtn.style.display = 'none';
        video.play().catch(function () {});
      });
    });

    // Project video cards in bento grid
    document.querySelectorAll('.project-thumb--video').forEach(function (thumb) {
      var video = thumb.querySelector('.project-video');
      if (!video) return;
      var parent = thumb.closest('.bento-item');
      if (parent) {
        parent.addEventListener('mouseenter', function () { video.play().catch(function () {}); });
        parent.addEventListener('mouseleave', function () { video.pause(); video.currentTime = 0; });
      }
    });
  }

  /* ==============================
     15. LIVE TERMINAL ANIMATION
     ============================== */
  function initTerminal() {
    var terminal = document.getElementById('liveTerminal');
    if (!terminal) return;

    var lines = terminal.querySelectorAll('.terminal-line');
    var animated = false;

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !animated) {
          animated = true;
          lines.forEach(function (line) {
            var delay = parseInt(line.getAttribute('data-delay') || '0', 10);
            setTimeout(function () { line.classList.add('visible'); }, delay);
          });
        }
      });
    }, { threshold: 0.2 });
    obs.observe(terminal);
  }

  /* ==============================
     16. AI CHATBOT
     ============================== */
  function initChatbot() {
    var widget = document.getElementById('chatbotWidget');
    var toggle = document.getElementById('chatbotToggle');
    var panel = document.getElementById('chatbotPanel');
    var messages = document.getElementById('chatbotMessages');
    var input = document.getElementById('chatbotInput');
    var sendBtn = document.getElementById('chatbotSend');
    var suggestions = document.getElementById('chatbotSuggestions');

    if (!widget || !toggle) return;

    toggle.addEventListener('click', function () {
      widget.classList.toggle('open');
      if (widget.classList.contains('open')) {
        setTimeout(function () { input.focus(); }, 300);
      }
    });

    // Knowledge base
    var kb = {
      '3d': "Arthur ma\u00eetrise Blender, After Effects, DaVinci Resolve, Unreal Engine 5 et Maya. Il collabore avec Bright Studio sur Atalante, Eclairion (\u00e9tude lumi\u00e8re), SEF Digital Brain (VFX g\u00e9n\u00e9ratif) et des projets de v\u00e9g\u00e9tation. Il a r\u00e9alis\u00e9 le jumeau num\u00e9rique du Technicentre SNCF Voyageurs de Bischheim en alternance. Son projet de fin d'ann\u00e9e ICAN (NEOM) est un court-m\u00e9trage sci-fi Mars 2060 en \u00e9quipe de 3. Il a aussi fait des pubs 3D (Fanta), du product 3D (Labello, Korai), du VFX Unreal Engine, et du character animation (Mouton).",
      'ia': "Arthur a d\u00e9velopp\u00e9 un \u00e9cosyst\u00e8me complet d'agents IA autonomes : 12 agents actifs sur 5 machines connect\u00e9es via Tailscale. LLM locaux (Ollama sur RTX 4090 avec phi3 et mistral), orchestrateur Python, voice bridge temps r\u00e9el Whisper GPU (7 sources audio, 183+ transcriptions), monitoring 24/7 avec watchdog self-healing. Technologies : Python, CrewAI, LangGraph, PowerShell. Il a aussi un pipeline 3D automatis\u00e9 avec 46 addons Blender (15 custom), ComfyUI et n8n.",
      'ecosysteme': "L'\u00e9cosyst\u00e8me comprend 5 machines : MSI (RTX 4090, 12 agents actifs), portable Arteom Z13 (bridge sync), MacBook Air (auto-deploy), Nothing Phone 1 (Tailscale), iPhone 14. Bridge v2 inter-machines avec file locking, TTL, dedup. Watchdog v2 auto-repair. Voice bridge multi-source (7 micros). 50+ scripts PowerShell. Tout tourne 24/7.",
      'tarif': "Arthur propose des tarifs adapt\u00e9s \u00e0 chaque projet. Pour la 3D/motion design, les TJM sont align\u00e9s sur le march\u00e9 freelance. Pour l'IA et le DevOps, le TJM est de 650-1000 \u20ac/jour selon la complexit\u00e9. Il propose aussi des jumeaux num\u00e9riques pour les pharmacies et l'industrie. Contactez-le \u00e0 arthcouff@gmail.com pour un devis.",
      'contact': "Email : arthcouff@gmail.com. T\u00e9l\u00e9phone : 07 82 78 52 97. LinkedIn : linkedin.com/in/arthur-couffon-2864a0267. Malt : profil freelance. R\u00e9servez un appel d\u00e9couverte de 30 minutes pour discuter de votre projet.",
      'securite': "Arthur fait du hardening syst\u00e8me, conformit\u00e9 RGPD (48 brokers trait\u00e9s), recon passive OSINT, et bug bounty. S\u00e9curisation \u00e9cosyst\u00e8me : DPAPI secrets, firewall Tailscale, SMB hardening, LLMNR/NetBIOS/SMBv1 off, monitoring continu.",
      'blender': "46 addons Blender (15 custom), pipeline automatis\u00e9 avec ComfyUI et n8n. Sp\u00e9cialis\u00e9 en archviz (Bright Studio), product 3D (Labello, Korai, Macaron), character animation (Mouton FabLab), VFX (SEF Digital Brain). Geometry Nodes pour g\u00e9n\u00e9ration proc\u00e9durale (pack v\u00e9g\u00e9tation). Projets Unreal Engine 5 (Ap\u00e9ro 51, VFX).",
      'formation': "Parcours atypique et riche : Bac Maths & Sciences de l'Ing\u00e9nieur (Lyc\u00e9e Jean-Baptiste Say, 2021), DUT G\u00e9nie \u00c9lectrique (IUT Cachan, 2021-2023, alternance SNCF R\u00e9seau), Licence Pro Image et Son (Paris Saclay, 2023-2024, alternance AmpVisualTV \u2014 Roland Garros, Popstar, Tous en Cuisine), Bachelor Animation 2D/3D (ICAN Paris, 2024-2025, alternance SNCF Voyageurs \u2014 jumeau num\u00e9rique). Candidat au Master Design Produit RUBIKA.",
      'sncf': "Arthur a travaill\u00e9 avec la SNCF : d'abord en alternance comme technicien \u00e9lectrique chez SNCF R\u00e9seau (DUT Cachan, 2021-2023), puis comme infographiste 3D chez SNCF Voyageurs (Bachelor ICAN, 2024-2025) pour le jumeau num\u00e9rique du Technicentre de Bischheim \u2014 reconstruction 3D compl\u00e8te du site (ateliers, zones kitting, usinage) avec travelling cin\u00e9matique.",
      'tv': "Chez AmpVisualTV (2023-2024), Arthur \u00e9tait technicien audiovisuel : r\u00e9gie broadcast en direct pour Roland Garros, Tous en Cuisine, Popstar. Setup cam\u00e9ras, d\u00e9ploiement \u00e9quipements, exploitation r\u00e9gies. Exp\u00e9rience en captation image/son, cadre cam\u00e9ra, montage, \u00e9talonnage.",
      'pharmacie': "Arthur d\u00e9veloppe aussi un service de jumeaux num\u00e9riques pour pharmacies : plans 3D, visualisation d'agencement. Business model en duo avec Aurore (commercial/chef de projet). Cible : pharmacies ind\u00e9pendantes et groupements pharmaceutiques.",
      'default': "Je suis l'assistant IA d'Arthur Couffon, 21 ans, bas\u00e9 \u00e0 Paris. Il combine un parcours d'ing\u00e9nieur \u00e9lectrique, de technicien TV (Roland Garros), d'infographiste 3D (SNCF jumeau num\u00e9rique) et de d\u00e9veloppeur d'\u00e9cosyst\u00e8mes IA. Posez-moi une question sur ses projets, son parcours, ses tarifs, ou demandez un devis !"
    };

    function getResponse(q) {
      var ql = q.toLowerCase();
      if (ql.match(/3d|blender|rendu|render|modelis|model|archviz|motion/)) return kb['3d'];
      if (ql.match(/ia|agent|llm|ollama|ecosyst|ai|intel/)) return kb['ia'] + '\n\n' + kb['ecosysteme'];
      if (ql.match(/tarif|prix|cout|tjm|devis|pricing/)) return kb['tarif'];
      if (ql.match(/contact|email|linkedin|malt|appel|joindre/)) return kb['contact'];
      if (ql.match(/secur|rgpd|osint|hack|bounty|gdpr/)) return kb['securite'];
      if (ql.match(/addon|pipeline|comfy|n8n/)) return kb['blender'];
      if (ql.match(/ican|ecole|formation|etude|diplom|parcours|rubika|cachan/)) return kb['formation'];
      if (ql.match(/machine|tailscale|bridge|monitor|watchdog/)) return kb['ecosysteme'];
      if (ql.match(/sncf|train|bischheim|jumeau|twin|ferrov/)) return kb['sncf'];
      if (ql.match(/tv|tele|roland|garros|ampvisual|broadcast|regie|popstar|cuisine/)) return kb['tv'];
      if (ql.match(/pharma|aurore|agencement/)) return kb['pharmacie'];
      return kb['default'];
    }

    function addMessage(text, isUser) {
      var div = document.createElement('div');
      div.className = 'chatbot-msg chatbot-msg--' + (isUser ? 'user' : 'bot');
      var p = document.createElement('p');
      p.textContent = text;
      div.appendChild(p);
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    function addTyping() {
      var div = document.createElement('div');
      div.className = 'chatbot-msg chatbot-msg--bot';
      div.id = 'chatbotTyping';
      div.innerHTML = '<div class="chatbot-typing"><span></span><span></span><span></span></div>';
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    function removeTyping() {
      var t = document.getElementById('chatbotTyping');
      if (t) t.remove();
    }

    function handleSend() {
      var q = input.value.trim();
      if (!q) return;
      input.value = '';
      addMessage(q, true);

      // Hide suggestions after first message
      if (suggestions) suggestions.style.display = 'none';

      // Typing indicator
      addTyping();
      setTimeout(function () {
        removeTyping();
        addMessage(getResponse(q), false);
      }, 800 + Math.random() * 600);
    }

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') handleSend();
    });

    // Suggestion buttons
    if (suggestions) {
      suggestions.querySelectorAll('.chatbot-suggestion').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var q = btn.getAttribute('data-q');
          input.value = q;
          handleSend();
        });
      });
    }
  }

  /* ==============================
     17. PROJECT MODAL
     ============================== */
  function initProjectModal() {
    var modal = document.getElementById('projectModal');
    var overlay = document.getElementById('projectModalOverlay');
    var closeBtn = document.getElementById('projectModalClose');
    var mediaContainer = document.getElementById('projectModalMedia');
    var titleEl = document.getElementById('projectModalTitle');
    var descEl = document.getElementById('projectModalDesc');
    var catEl = document.getElementById('projectModalCat');
    var toolsEl = document.getElementById('projectModalTools');
    var tagsContainer = document.getElementById('projectModalTags');
    if (!modal) return;

    // Project detail data
    var projectData = {
      'CHU Rexel': { desc: 'Visualisation architecturale compl\u00e8te d\'un complexe hospitalier. Mod\u00e9lisation de A \u00e0 Z, \u00e9clairage r\u00e9aliste EEVEE et V-Ray, rendu 4K multi-vues. Projet r\u00e9alis\u00e9 pour Bright Studio.', cat: 'Archviz / Healthcare', tools: 'Blender, EEVEE, V-Ray', tags: ['Archviz', 'Healthcare', 'Blender', '4K', 'Bright Studio'] },
      'NEOM': { desc: 'Projet de fin d\'ann\u00e9e (PAF) ICAN \u2014 court-m\u00e9trage sci-fi Mars 2060 r\u00e9alis\u00e9 en \u00e9quipe de 3 (Eruimy, Chemin, Couffon). Sc\u00e8nes Blender massives (1.3GB+), environnements, robots, rendu Cycles. Vid\u00e9o finale 1920x800, 3+ minutes. Soutenance avec dossier complet.', cat: 'Short Film / Sci-Fi', tools: 'Blender, Cycles', tags: ['Short Film', 'Sci-Fi', 'Mars 2060', 'ICAN PAF', 'Team Project'] },
      'Eclairion': { desc: '\u00c9tude lumi\u00e8re pour b\u00e2timent commercial haut de gamme. 120 frames d\'animation, \u00e9clairage dynamique avec transitions jour/nuit. Projet pour Bright Studio.', cat: 'Archviz / Lighting', tools: 'Blender, Cycles', tags: ['Archviz', 'Lighting', 'Bright', '120 frames'] },
      'SNCF Bischheim': { desc: 'Jumeau num\u00e9rique du Technicentre SNCF Voyageurs de Bischheim. Reconstruction 3D compl\u00e8te : ateliers, zones kitting, usinage. Travelling cin\u00e9matique et vues a\u00e9riennes. Projet en alternance (Bachelor ICAN 2024-2025).', cat: 'Industrial / Digital Twin', tools: 'Blender, Cycles', tags: ['Industrial', 'Railway', 'Digital Twin', 'SNCF Voyageurs', 'Alternance'] },
      'Labello': { desc: 'Rendu produit 360 multi-angles. \u00c9clairage studio professionnel, mat\u00e9riaux PBR haute r\u00e9solution. Int\u00e9gration Framer pour landing page interactive.', cat: 'Product 3D', tools: 'Blender, Substance, Framer', tags: ['Product', 'Framer', '360', 'Studio', 'PBR'] },
      'SEF - Digital Brain': { desc: 'VFX cerveau digital pour le Salon Europ\u00e9en de la Franchise. Compositing g\u00e9n\u00e9ratif avec syst\u00e8mes de particules. Projet pour Bright Studio.', cat: 'VFX / Generative', tools: 'Blender, After Effects', tags: ['VFX', 'Generative', 'Particles', 'Bright Studio'] },
      'Korai Bi\u00e8re': { desc: 'Visualisation produit pour brasserie artisanale. Mat\u00e9riaux r\u00e9alistes : verre r\u00e9fractif, simulation liquide, condensation, \u00e9clairage ambiance bar.', cat: 'Product 3D / Beverage', tools: 'Blender, Cycles', tags: ['Product', 'Beverage', 'Glass', 'Liquid', 'Materials'] },
      'Macaron': { desc: 'Rendu produit alimentaire photor\u00e9aliste. Mat\u00e9riaux SSS (Subsurface Scattering) pour le rendu r\u00e9aliste de la texture macaron, \u00e9clairage doux studio.', cat: 'Product 3D / Food', tools: 'Blender, Substance', tags: ['Product', 'Food', 'SSS', 'Photoreal'] },
      'Train 4K': { desc: 'Projet d\'animation PAF ICAN. Plusieurs clips 4K : robots (alarme t\u00eate robot), ombres dynamiques, pieds m\u00e9caniques. Rendu Cycles haute r\u00e9solution. Clips de 5 \u00e0 17 secondes, fichiers sources jusqu\'\u00e0 834MB.', cat: 'Animation / ICAN PAF', tools: 'Blender, Cycles', tags: ['4K', 'Cycles', 'ICAN PAF', 'Robots', 'Animation'] },
      'Vegetation Pack': { desc: '21 plantes anim\u00e9es esth\u00e9tique chinoise. Syst\u00e8mes proc\u00e9duraux, vertex animation. Pack commercial en vente \u00e0 $129. Id\u00e9al pour archviz et sc\u00e8nes ext\u00e9rieures.', cat: 'Asset Pack / Procedural', tools: 'Blender, Geometry Nodes', tags: ['Procedural', 'Asset Pack', '$129', 'Geometry Nodes', 'Animation'] },
      'La D\u00e9fense': { desc: 'Maquette 3D du quartier de La D\u00e9fense. Mod\u00e9lisation des b\u00e2timents, rendu 4K (3840x2160), \u00e9clairage atmosph\u00e9rique. Projet personnel Blender.', cat: 'Archviz / Urbanisme', tools: 'Blender, Cycles', tags: ['Archviz', 'Urbanisme', '4K', 'Maquette'] },
      'Salle de Bain': { desc: 'Design d\'int\u00e9rieur photor\u00e9aliste. Mat\u00e9riaux PBR haute r\u00e9solution (carrelage, verre, chrome, eau), \u00e9clairage naturel par HDRI.', cat: 'Interior Design', tools: 'Blender', tags: ['Interior', 'PBR', 'Photoreal', 'HDRI'] },
      'Mouton \u2014 Character Animation': { desc: 'Animation de personnage stylis\u00e9 (mouton). 1759 frames, rigging complet, cycles de marche et idle. Character design, fur shader, environnement herbe proc\u00e9durale.', cat: 'Character Animation', tools: 'Blender, Cycles', tags: ['Character', 'Animation', 'Rigging', 'Fur', '1759 frames'] },
      'VFX Unreal': { desc: 'Effets visuels temps r\u00e9el dans Unreal Engine. Particules, simulations, post-processing cin\u00e9matique.', cat: 'VFX / Real-time', tools: 'Unreal Engine', tags: ['VFX', 'Real-time', 'Unreal', 'Particles'] },
      'Fanta 3D': { desc: 'Publicit\u00e9 3D produit Fanta. Animation dynamique, fluides, mat\u00e9riaux verre et liquide color\u00e9, \u00e9clairage studio \u00e9nergique.', cat: 'Product 3D / Advertising', tools: 'Blender, Cycles', tags: ['Advertising', 'Product', 'Liquid', 'Animation'] },
      'Ap\u00e9ro 51': { desc: 'Cin\u00e9matique produit pour Pastis 51. \u00c9clairage atmosph\u00e9rique, mat\u00e9riaux verre r\u00e9alistes, animation cam\u00e9ra cin\u00e9matographique.', cat: 'Product 3D / Cin\u00e9matique', tools: 'Blender, Cycles', tags: ['Product', 'Cin\u00e9matique', 'Beverage', 'Glass'] }
    };

    document.querySelectorAll('.bento-item').forEach(function (card) {
      card.addEventListener('click', function (e) {
        // Don't open modal if clicking swiper controls
        if (e.target.closest('.swiper-button-prev, .swiper-button-next, .swiper-pagination')) return;

        var titleSource = card.querySelector('.project-info h3');
        if (!titleSource) return;
        var title = titleSource.textContent.trim();

        // Find image or video
        var img = card.querySelector('.project-thumb img, .swiper-slide img');
        var video = card.querySelector('.project-video');

        mediaContainer.innerHTML = '';
        if (video) {
          var v = document.createElement('video');
          v.src = video.querySelector('source') ? video.querySelector('source').src : video.src;
          v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
          mediaContainer.appendChild(v);
        } else if (img) {
          var i = document.createElement('img');
          i.src = img.src; i.alt = title;
          mediaContainer.appendChild(i);
        }

        titleEl.textContent = title;
        var data = projectData[title] || { desc: card.querySelector('.project-info p') ? card.querySelector('.project-info p').textContent : '', cat: '', tools: 'Blender', tags: [] };
        descEl.textContent = data.desc;
        catEl.textContent = data.cat;
        toolsEl.textContent = data.tools;
        tagsContainer.innerHTML = '';
        (data.tags || []).forEach(function (t) {
          var s = document.createElement('span');
          s.textContent = t;
          tagsContainer.appendChild(s);
        });

        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      // Stop any playing video
      var v = mediaContainer.querySelector('video');
      if (v) v.pause();
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
  }

  /* ==============================
     18. CARD SPOTLIGHT
     ============================== */
  function initCardSpotlight() {
    if ('ontouchstart' in window) return;
    document.querySelectorAll('.service-card, .tech-stat-card, .tech-card, .btn').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', ((e.clientX - rect.left) / rect.width * 100) + '%');
        card.style.setProperty('--mouse-y', ((e.clientY - rect.top) / rect.height * 100) + '%');
      });
    });
  }

  /* ==============================
     19. HERO PARALLAX
     ============================== */
  function initHeroParallax() {
    var video = document.getElementById('heroVideo');
    if (!video) return;

    window.addEventListener('scroll', function () {
      var scrollP = Math.min(window.scrollY / window.innerHeight, 1);
      video.style.transform = 'scale(' + (1 + scrollP * 0.1) + ')';
      video.style.opacity = Math.max(0, 1 - scrollP * 0.8);
    }, { passive: true });
  }

  /* ==============================
     INIT
     ============================== */
  initLoader();
  initNav();
  initLanguageToggle();

  document.addEventListener('DOMContentLoaded', function () {
    initSmoothScroll();
    initCursor();
    initScrollProgress();
    initMagneticButtons();
    initGSAPAnimations();
    initCounters();
    initPortfolioFilter();
    initHeroParallax();
    initCardSpotlight();
    initSwipers();
    initShowreel();
    initVideoCards();
    initTerminal();
    initProjectModal();
    initChatbot();
  });

})();
