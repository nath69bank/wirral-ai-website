/* wirral.ai — motion layer. GSAP + ScrollTrigger where available, graceful static fallback. */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------- split headings into words */
  const splitTargets = $$('.js-split');

  const split = (el) => {
    if (el.classList.contains('is-split')) return [];
    const words = String(el.textContent).trim().split(/\s+/);
    el.textContent = '';
    const line = document.createElement('span');
    line.className = 'line';
    const inners = [];
    words.forEach((w, i) => {
      const wrap = document.createElement('span');
      wrap.className = 'word';
      const inner = document.createElement('i');
      inner.textContent = i === words.length - 1 ? w : w + ' ';
      wrap.appendChild(inner);
      line.appendChild(wrap);
      inners.push(inner);
    });
    el.appendChild(line);
    el.classList.add('is-split');
    return inners;
  };

  /* ------------------------------------------------------ pointer-reactive bits */
  (() => {
    $$('.btn--primary, .btn--wa').forEach((b) => {
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.setProperty('--mx', `${e.clientX - r.left}px`);
        b.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });

    const live = $('#live');
    if (live && window.matchMedia('(hover: hover)').matches) {
      live.addEventListener('pointermove', (e) => {
        const r = live.getBoundingClientRect();
        live.style.setProperty('--spot-x', `${e.clientX - r.left}px`);
        live.style.setProperty('--spot-y', `${e.clientY - r.top}px`);
        live.classList.add('is-lit');
      });
      live.addEventListener('pointerleave', () => live.classList.remove('is-lit'));
    }
  })();

  /* ------------------------------------------------------------ number counters */
  const countUp = (el) => {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    const raw = el.textContent.trim();
    const m = raw.match(/^(\d+)(.*)$/);
    if (!m) return;
    const target = parseInt(m[1], 10);
    const suffix = m[2] || '';
    if (reduced) return;
    const dur = 1100;
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    el.textContent = '0' + suffix;
    requestAnimationFrame(step);
  };

  /* -------------------------- reveal via class toggling: CSS owns the transition */
  const revealAll = () => {
    $$('.reveal, .wipe').forEach((el) => el.classList.add('is-in'));
    $$('.cap').forEach((c) => c.classList.add('is-edged'));
    const spine = $('.steps-spine');
    if (spine) spine.style.transform = 'scaleY(1)';
    $$('[data-count]').forEach(countUp);
  };

  const observeReveals = () => {
    if (!('IntersectionObserver' in window)) {
      revealAll();
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-in');
          if (e.target.classList.contains('cap')) e.target.classList.add('is-edged');
          io.unobserve(e.target);
        }),
      { rootMargin: '0px 0px -6% 0px', threshold: 0.05 }
    );
    const targets = $$('.reveal, .wipe, .cap');
    targets.forEach((el) => io.observe(el));

    /* Belt-and-braces: a throttled geometric sweep guarantees nothing is ever
       left invisible if an observer callback is missed during a fast scroll. */
    const show = (el) => {
      if (el.classList.contains('is-in')) return;
      el.classList.add('is-in');
      if (el.classList.contains('cap')) el.classList.add('is-edged');
      io.unobserve(el);
    };
    let pending = false;
    let remaining = targets.slice();
    const sweep = () => {
      pending = false;
      const limit = window.innerHeight * 0.94;
      remaining = remaining.filter((el) => {
        if (el.getBoundingClientRect().top < limit) {
          show(el);
          return false;
        }
        return true;
      });
      if (!remaining.length) {
        window.removeEventListener('scroll', queue);
        window.removeEventListener('resize', queue);
      }
    };
    function queue() {
      if (pending) return;
      pending = true;
      requestAnimationFrame(sweep);
    }
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    queue();

    const cio = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          countUp(e.target);
          cio.unobserve(e.target);
        }),
      { threshold: 0.4 }
    );
    $$('[data-count]').forEach((el) => cio.observe(el));
  };

  const boot = () => {
    const gsap = window.gsap;
    document.documentElement.classList.add('anim');

    if (!gsap || !window.ScrollTrigger || reduced) {
      if (reduced) {
        revealAll();
      } else {
        observeReveals();
      }
      return;
    }
    const ST = window.ScrollTrigger;
    gsap.registerPlugin(ST);
    const EASE = 'expo.out';
    observeReveals();

    /* ---- scroll progress bar */
    const bar = $('.scroll-progress');
    if (bar) {
      gsap.to(bar, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.25 },
      });
    }

    /* ---- headline word reveals */
    splitTargets.forEach((el) => {
      const inners = split(el);
      if (!inners.length) return;
      gsap.set(inners, { yPercent: 115, opacity: 0 });
      gsap.to(inners, {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        ease: EASE,
        stagger: 0.045,
        scrollTrigger: el.closest('.hero')
          ? undefined
          : { trigger: el, start: 'top 86%', once: true },
        delay: el.closest('.hero') ? 0.15 : 0,
      });
    });

    /* ---- hero entrance */
    const heroBits = [
      '.hero .eyebrow',
      '.hero .lede',
      '.hero .hero-cta',
      '.hero-trust .trust-item',
      '.hero-cue',
    ]
      .map((s) => $$(s))
      .flat();
    if (heroBits.length) {
      gsap.from(heroBits, {
        opacity: 0,
        y: 14,
        duration: 0.9,
        ease: EASE,
        stagger: 0.07,
        delay: 0.35,
      });
    }

    const plate = $('.hero-plate');
    if (plate) {
      gsap.from(plate, {
        opacity: 0,
        clipPath: 'inset(0 0 100% 0)',
        duration: 1.4,
        ease: EASE,
        delay: 0.25,
      });
    }

    /* ---- image parallax inside every fixed frame */
    const parallax = (sel, amount) => {
      $$(sel).forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -amount },
          {
            yPercent: amount,
            ease: 'none',
            scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.4 },
          }
        );
      });
    };
    parallax('.hero-plate img', 4);
    parallax('.statement-figure img', 6);
    parallax('.steps-figure img', 5);
    parallax('.section-bg img', 8);
    parallax('.cap-media img', 3);

    /* ---- capability list stagger */
    $$('.cap').forEach((cap) => {
      gsap.fromTo(
        cap.querySelectorAll('li'),
        { opacity: 0, x: -6 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: EASE,
          stagger: 0.04,
          scrollTrigger: { trigger: cap, start: 'top 78%', once: true },
        }
      );
    });

    /* ---- hairline rules */
    $$('.rule-draw').forEach((r) => {
      gsap.fromTo(
        r,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.1,
          ease: EASE,
          scrollTrigger: { trigger: r, start: 'top 92%', once: true },
        }
      );
    });

    /* ---- approach spine + active step */
    const spine = $('.steps-spine');
    const steps = $$('.step');
    if (spine && steps.length) {
      gsap.fromTo(
        spine,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.steps',
            start: 'top 72%',
            end: 'bottom 62%',
            scrub: 0.3,
          },
        }
      );
      steps.forEach((s) => {
        ST.create({
          trigger: s,
          start: 'top 68%',
          end: 'bottom 45%',
          onToggle: (self) => s.classList.toggle('is-active', self.isActive),
        });
      });
    }

    ST.refresh();
    window.addEventListener('load', () => ST.refresh());
  };

  /* --------------------------------------------------- generative hero canvas */
  (() => {
    const cv = $('#heroCanvas');
    if (!cv || reduced) return;
    const ctx = cv.getContext('2d');
    let w = 0;
    let h = 0;
    let t = 0;
    let pointer = { x: 0.5, y: 0.5, active: false };
    let cols = 0;
    let rows = 0;
    let gap = 26;

    const resize = () => {
      const r = cv.getBoundingClientRect();
      if (!r.width) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gap = w < 480 ? 20 : 28;
      cols = Math.ceil(w / gap) + 1;
      rows = Math.ceil(h / gap) + 1;
    };

    cv.parentElement.addEventListener('pointermove', (e) => {
      const r = cv.getBoundingClientRect();
      pointer = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height, active: true };
    });
    cv.parentElement.addEventListener('pointerleave', () => (pointer.active = false));

    const tick = () => {
      if (!w) {
        resize();
        requestAnimationFrame(tick);
        return;
      }
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      const ink = dark ? '124,199,163' : '31,78,61';
      const cop = dark ? '211,147,106' : '165,100,60';
      ctx.clearRect(0, 0, w, h);
      t += 0.006;

      const px = pointer.x * w;
      const py = pointer.y * h;

      // Woven field: two sets of sinusoidally displaced lines that interlace.
      ctx.lineWidth = 0.85;
      for (let r = 0; r < rows; r++) {
        const y0 = r * gap;
        ctx.beginPath();
        for (let c = 0; c <= cols; c++) {
          const x = c * gap;
          const dx = pointer.active ? x - px : 0;
          const dy = pointer.active ? y0 - py : 0;
          const dist = pointer.active ? Math.hypot(dx, dy) : 9999;
          const pull = pointer.active ? Math.max(0, 1 - dist / 220) : 0;
          const wave =
            Math.sin(x * 0.012 + t * 1.4 + r * 0.32) * 5.5 +
            Math.sin(x * 0.005 - t * 0.9) * 3.2 +
            pull * pull * 26 * Math.sign(dy || 1);
          const y = y0 + wave;
          if (c === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const fade = 0.1 + 0.16 * Math.abs(Math.sin(r * 0.5 + t));
        ctx.strokeStyle = `rgba(${ink},${fade})`;
        ctx.stroke();
      }

      // Copper accent threads
      for (let k = 0; k < 3; k++) {
        const base = h * (0.24 + k * 0.26);
        ctx.beginPath();
        for (let x = 0; x <= w; x += 6) {
          const dx = pointer.active ? x - px : 0;
          const dy = pointer.active ? base - py : 0;
          const dist = pointer.active ? Math.hypot(dx, dy) : 9999;
          const pull = pointer.active ? Math.max(0, 1 - dist / 240) : 0;
          const y =
            base +
            Math.sin(x * 0.009 + t * 1.7 + k * 2.1) * 12 +
            Math.sin(x * 0.021 - t * 1.1) * 4 +
            pull * pull * 34 * Math.sign(dy || 1);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${cop},${0.34 - k * 0.06})`;
        ctx.lineWidth = 1.3;
        ctx.stroke();
      }

      // Sparse nodes at intersections
      for (let r = 1; r < rows; r += 3) {
        for (let c = 1; c < cols; c += 3) {
          const x = c * gap;
          const y = r * gap + Math.sin(x * 0.012 + t * 1.4 + r * 0.32) * 5.5;
          const a = 0.1 + 0.2 * Math.abs(Math.sin(t * 1.5 + c * 0.4 + r * 0.7));
          ctx.fillStyle = `rgba(${ink},${a})`;
          ctx.beginPath();
          ctx.arc(x, y, 1.25, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(tick);
  })();

  /* ------------------------------------------------------------- final CTA orbit */
  (() => {
    const cv = $('#finalCanvas');
    if (!cv || reduced) return;
    const ctx = cv.getContext('2d');
    let w = 0;
    let h = 0;
    let t = 0;
    const resize = () => {
      const r = cv.getBoundingClientRect();
      if (!r.width) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const tick = () => {
      if (!w) {
        resize();
        requestAnimationFrame(tick);
        return;
      }
      ctx.clearRect(0, 0, w, h);
      t += 0.0025;
      const cx = w * 0.78;
      const cy = h * 0.5;
      for (let i = 0; i < 5; i++) {
        const rr = Math.min(w, h) * (0.22 + i * 0.14);
        ctx.beginPath();
        ctx.ellipse(cx, cy, rr, rr * 0.42, t * (0.6 + i * 0.12), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${i % 2 ? '211,147,106' : '160,215,190'},${0.22 - i * 0.03})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        const ang = t * (1.1 + i * 0.3) + i;
        const px = cx + Math.cos(ang) * rr;
        const py = cy + Math.sin(ang) * rr * 0.42;
        ctx.fillStyle = i % 2 ? 'rgba(211,147,106,0.6)' : 'rgba(160,215,190,0.55)';
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(tick);
    };
    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(tick);
  })();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
