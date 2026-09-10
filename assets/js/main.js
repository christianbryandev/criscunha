/* Cris Cunha — interações do site */
(function () {
  'use strict';

  var WA_NUMBER = '5516992417586';
  var WA_TEXT = 'Olá, Cris! Vi o site e gostaria de saber mais sobre o atendimento de drenagem linfática pós-operatória.';
  var WA_URL = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(WA_TEXT);

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Links de WhatsApp ---- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-wa]'), function (el) {
    el.href = WA_URL;
    el.target = '_blank';
    el.rel = 'noopener';
  });

  /* ---- Ano no rodapé ---- */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---- Menu mobile ---- */
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('menu-mobile');

  function setMenu(open) {
    if (!toggle || !menu || !header) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.hidden = !open;
    header.classList.toggle('menu-open', open);
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) setMenu(false);
    });
  }

  /* ---- Header + barra de progresso ---- */
  var progress = document.querySelector('.scroll-progress span');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-stuck', y > 8);
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? Math.min(y / max, 1) * 100 : 0) + '%';
    }
    var float = document.querySelector('.wa-float');
    if (float) float.classList.toggle('is-visible', y > window.innerHeight * 0.55);
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---- Reveal no scroll ---- */
  var revealables = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add('is-in'); });
  } else {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var group = entry.target.parentElement;
        var siblings = group ? Array.prototype.filter.call(group.children, function (c) {
          return c.classList && c.classList.contains('reveal');
        }) : [];
        var i = Math.max(0, siblings.indexOf(entry.target));
        entry.target.style.transitionDelay = Math.min(i, 4) * 70 + 'ms';
        entry.target.classList.add('is-in');
        revealObs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    Array.prototype.forEach.call(revealables, function (el) { revealObs.observe(el); });
  }

  /* ---- Seção ativa: menu + trilha lateral ---- */
  var sections = ['inicio', 'pos-operatorio', 'atendimentos', 'sobre', 'depoimentos', 'localizacao']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var spineLinks = document.querySelectorAll('.spine a');
    var navLinks = document.querySelectorAll('.nav-desktop a');

    var activeObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        Array.prototype.forEach.call(spineLinks, function (a) {
          a.classList.toggle('is-active', a.getAttribute('data-spine') === id);
        });
        Array.prototype.forEach.call(navLinks, function (a) {
          a.classList.toggle('is-current', a.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { activeObs.observe(s); });
  }

  /* ---- Vídeo: carrega só quando se aproxima da viewport ---- */
  var plate = document.querySelector('.video-plate');
  var video = document.querySelector('.video-plate .video');

  if (video) {
    var loaded = false;
    function loadVideo() {
      if (loaded) return;
      loaded = true;
      if (video.dataset.poster) video.poster = video.dataset.poster;
      Array.prototype.forEach.call(video.querySelectorAll('source[data-src]'), function (s) {
        s.src = s.getAttribute('data-src');
      });
      video.load();
    }

    if ('IntersectionObserver' in window) {
      var loadObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { loadVideo(); loadObs.disconnect(); }
        });
      }, { rootMargin: '300px 0px' });
      loadObs.observe(video);
    } else {
      loadVideo();
    }

    /* Pausa fora da tela para poupar bateria e dados */
    if ('IntersectionObserver' in window) {
      var playObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!loaded) return;
          if (entry.isIntersecting) {
            if (!plate.classList.contains('is-paused')) {
              var p = video.play();
              if (p && p.catch) p.catch(function () {});
            }
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.2 });
      playObs.observe(video);
    }

    /* Controle discreto de play/pause */
    var ctrl = document.querySelector('[data-video-toggle]');
    if (ctrl) {
      ctrl.addEventListener('click', function () {
        if (video.paused) {
          var p = video.play();
          if (p && p.catch) p.catch(function () {});
          plate.classList.remove('is-paused');
          ctrl.setAttribute('aria-label', 'Pausar vídeo');
        } else {
          video.pause();
          plate.classList.add('is-paused');
          ctrl.setAttribute('aria-label', 'Reproduzir vídeo');
        }
      });
    }
  }
})();
