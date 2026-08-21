/* ==========================================================================
   wirral.ai — inner page behaviour
   1. Table-of-contents scroll spy
   2. Procedural page-header field (no images, so the canvas never taints)
   3. Reading progress for long articles
   ========================================================================== */

(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------- toc spy */

  const toc = document.querySelector('.toc');
  if (toc) {
    const links = Array.from(toc.querySelectorAll('a[href^="#"]'));
    const sections = links
      .map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))))
      .filter(Boolean);

    if (sections.length) {
      let current = null;
      const setCurrent = (id) => {
        if (id === current) return;
        current = id;
        links.forEach((a) => {
          const on = a.hash.slice(1) === id;
          a.classList.toggle('is-current', on);
          if (on) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      };

      const spy = () => {
        const offset = parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue('--header-offset')
        ) || 88;
        const line = offset + 40;
        let active = sections[0];
        for (const s of sections) {
          if (s.getBoundingClientRect().top <= line) active = s;
          else break;
        }
        // At the very bottom of the page, favour the last section.
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
          active = sections[sections.length - 1];
        }
        setCurrent(active.id);
      };

      let pending = false;
      const queue = () => {
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
          pending = false;
          spy();
        });
      };
      window.addEventListener('scroll', queue, { passive: true });
      window.addEventListener('resize', queue);
      queue();
    }
  }

  /* --------------------------------------------------- page header field */

  const canvases = Array.from(document.querySelectorAll('[data-page-canvas]'));

  canvases.forEach((cv) => {
    const parent = cv.parentElement;
    if (!parent) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let nodes = [];

    const ink = () =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--color-text-faint')
        .trim() || '#9a9d94';

    const accent = () =>
      getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim() ||
      '#a5643c';

    const seed = () => {
      // A calm, sparse constellation. Deterministic per width so it does not
      // jitter between resizes on the same layout.
      const count = Math.max(9, Math.min(22, Math.round(w / 78)));
      nodes = [];
      let r = w * 0.7391 + 11;
      const rand = () => {
        r = (r * 9301 + 49297) % 233280;
        return r / 233280;
      };
      for (let i = 0; i < count; i += 1) {
        nodes.push({
          x: rand() * w,
          y: rand() * h,
          r: 1 + rand() * 1.6,
          a: 0.25 + rand() * 0.5,
          drift: (rand() - 0.5) * 0.09,
          phase: rand() * Math.PI * 2,
        });
      }
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);

      // Long, slow arcs suggesting structure without depicting anything.
      ctx.save();
      ctx.strokeStyle = ink();
      ctx.globalAlpha = 0.16;
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i += 1) {
        const cy = h * (0.36 + i * 0.22);
        ctx.beginPath();
        for (let x = 0; x <= w; x += 14) {
          const y =
            cy +
            Math.sin(x / (240 + i * 90) + t / (9000 + i * 2600) + i) * (16 + i * 7) +
            Math.sin(x / 70 + i) * 2;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();

      // Connective threads between near neighbours.
      ctx.save();
      ctx.strokeStyle = ink();
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > 168) continue;
          ctx.globalAlpha = (1 - d / 168) * 0.14;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      ctx.restore();

      // Nodes.
      const acc = accent();
      nodes.forEach((n, i) => {
        const pulse = 0.72 + Math.sin(t / 2400 + n.phase) * 0.28;
        ctx.beginPath();
        ctx.fillStyle = i % 6 === 0 ? acc : ink();
        ctx.globalAlpha = n.a * pulse * (i % 6 === 0 ? 0.85 : 0.5);
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      cv.style.width = w + 'px';
      cv.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    let raf = null;
    let last = 0;

    const loop = (t) => {
      // Drift the field very slowly, capped at ~30fps to stay cheap.
      if (t - last > 33) {
        last = t;
        nodes.forEach((n) => {
          n.y += n.drift;
          if (n.y < -6) n.y = h + 6;
          if (n.y > h + 6) n.y = -6;
        });
        draw(t);
      }
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (raf || reduced) return;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = null;
    };

    resize();
    draw(0);

    if (!reduced) {
      // Only animate while the header is actually on screen.
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => (e.isIntersecting ? start() : stop())),
        { threshold: 0 }
      );
      io.observe(parent);
      document.addEventListener('visibilitychange', () =>
        document.hidden ? stop() : start()
      );
    }

    let rt = null;
    window.addEventListener('resize', () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        resize();
        draw(performance.now());
      }, 160);
    });

    // Redraw on theme change so the ink colour follows the palette.
    new MutationObserver(() => draw(performance.now())).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
  });
})();
