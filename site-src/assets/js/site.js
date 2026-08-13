/* BERM INC. — interactions */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Mobile nav ---- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('is-open') ? 'true' : 'false');
    });
  }

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---- Stat count-up ---- */
  var statNums = document.querySelectorAll('.stat__num[data-count]');
  if ('IntersectionObserver' in window && !reduced && statNums.length) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        sio.unobserve(el);
        var target = parseInt(el.getAttribute('data-count'), 10);
        var dur = 1400;
        var t0 = null;
        function tick(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.firstChild.textContent = Math.round(target * eased);
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    statNums.forEach(function (el) { sio.observe(el); });
  }

  /* ---- Lightbox ---- */
  var figs = document.querySelectorAll('.gallery-grid figure[data-full]');
  if (figs.length) {
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-label', 'Image viewer');
    lb.innerHTML =
      '<button class="lightbox__close" aria-label="Close">&#10005;</button>' +
      '<button class="lightbox__btn lightbox__btn--prev" aria-label="Previous">&#8249;</button>' +
      '<img alt="">' +
      '<button class="lightbox__btn lightbox__btn--next" aria-label="Next">&#8250;</button>' +
      '<div class="lightbox__cap"></div>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector('img');
    var lbCap = lb.querySelector('.lightbox__cap');
    var idx = 0;

    function show(i) {
      idx = (i + figs.length) % figs.length;
      var fig = figs[idx];
      lbImg.src = fig.getAttribute('data-full');
      lbCap.textContent = (idx + 1) + ' / ' + figs.length + ' — ' + (fig.getAttribute('data-cap') || '');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      lb.classList.remove('is-open');
      document.body.style.overflow = '';
    }
    figs.forEach(function (fig, i) {
      fig.addEventListener('click', function () { show(i); lb.classList.add('is-open'); });
    });
    lb.querySelector('.lightbox__close').addEventListener('click', close);
    lb.querySelector('.lightbox__btn--prev').addEventListener('click', function () { show(idx - 1); });
    lb.querySelector('.lightbox__btn--next').addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  /* ---- Quote / contact forms (mailto fallback, no backend) ---- */
  document.querySelectorAll('form[data-berm-form]').forEach(function (form) {
    var success = document.querySelector('[data-form-success]');
    var refCode = 'BRM-2026-' + String(Math.floor(1000 + Math.random() * 9000));

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var fd = new FormData(form);
      var lines = ['New inquiry from berm-inc-site — Ref: ' + refCode, ''];
      fd.forEach(function (v, k) { lines.push(k + ': ' + (v || '—')); });
      lines.push('', '(Sent via the website contact form.)');
      var href = 'mailto:Bermgroups@gmail.com'
        + '?subject=' + encodeURIComponent('Project inquiry ' + refCode)
        + '&body=' + encodeURIComponent(lines.join('\n'));
      if (success) {
        var refEl = success.querySelector('[data-ref]');
        if (refEl) refEl.textContent = refCode;
        form.hidden = true;
        success.hidden = false;
      }
      window.location.href = href;
    });
  });

  /* ---- Header shadow on scroll ---- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.style.boxShadow = window.scrollY > 8 ? '0 8px 28px -18px rgba(10,31,68,.35)' : '';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
