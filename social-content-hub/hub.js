/* ==========================================================================
   wirral.ai — Social Content Hub
   1. Brief form (platform, mode, tone, saved business profile)
   2. Generation via /api/content-hub and a small Markdown renderer
   3. Free allowance and the email gate (lead capture via /api/enquiries)
   4. Copy helpers
   ========================================================================== */

(() => {
  'use strict';

  const API_BASE = window.__API_BASE__ || '';
  const FREE_POSTS = 3;
  const TONES = ['Direct', 'Educational', 'Casual', 'Humorous', 'Urgent', 'Premium', 'Community', 'Bold', 'Empathetic'];
  const EXAMPLES = [
    { label: 'Café: new autumn menu', platform: 'Facebook', tone: 'Community', input: 'Independent café. New autumn menu starts this Friday: pumpkin soup, sausage rolls made in-house, oat milk at no extra charge. Dog friendly. Open 8am–4pm.' },
    { label: 'Tradesperson: boiler service reminder', platform: 'Instagram', tone: 'Educational', input: 'Gas Safe heating engineer. Remind people to get their boiler serviced before winter. Common signs of a problem: yellow flame, pressure dropping, strange noises. Bookings open for November.' },
    { label: 'Gym: TikTok on first-session nerves', platform: 'TikTok', tone: 'Empathetic', input: 'Small independent gym. Lots of people are nervous about their first session. We do a free walk-round and a coach shows you every machine. No contracts.' },
  ];

  const $ = (s, r = document) => r.querySelector(s);
  const store = {
    get(k, d) { try { const v = localStorage.getItem('hub:' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('hub:' + k, JSON.stringify(v)); } catch { /* private mode */ } },
  };

  const form = $('#hubForm');
  if (!form) return;
  const out = $('#hubOut');
  const submitBtn = $('#hubSubmit');
  const copyBtn = $('#hubCopy');
  const gate = $('#hubGate');
  const allowance = $('#hubAllowance');
  const input = $('#hubInput');
  const inputLabel = $('#hubInputLabel');
  const profileFields = ['name', 'industry', 'location', 'objective', 'audience'];
  let tone = store.get('tone', 'Direct');
  let lastReply = '';
  let busy = false;

  /* ------------------------------------------------------------- tone chips */

  const toneBox = $('#hubTones');
  const renderTones = () => {
    toneBox.innerHTML = '';
    TONES.forEach((t) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip hub-tone' + (t === tone ? ' is-on' : '');
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', String(t === tone));
      b.textContent = t;
      b.addEventListener('click', () => { tone = t; store.set('tone', t); renderTones(); });
      toneBox.appendChild(b);
    });
  };
  renderTones();

  /* ----------------------------------------------------- mode-aware label */

  const LABELS = {
    create: ['Rough notes', 'e.g. New autumn menu starts Friday. Slow-cooked Scouse, local ales, dog friendly, booking recommended at weekends.'],
    rewrite: ['Paste your existing post', 'Paste the post you want improved…'],
    hooks: ['What is the post about?', 'e.g. Why you should get your boiler serviced before the first cold snap'],
    script: ['What should the video cover?', 'e.g. A 30-second behind-the-scenes look at how we prep our Sunday roast'],
    audit: ['Paste the post to audit', 'Paste a post you have already published or drafted…'],
  };
  const mode = $('#hubMode');
  const syncMode = () => {
    const [l, p] = LABELS[mode.value] || LABELS.create;
    inputLabel.textContent = l;
    input.placeholder = p;
  };
  mode.addEventListener('change', syncMode);

  /* -------------------------------------------------- saved business profile */

  const saved = store.get('profile', {});
  profileFields.forEach((k) => {
    const el = form.elements[k];
    if (el && saved[k]) el.value = saved[k];
  });
  if (profileFields.some((k) => saved[k])) $('#hubProfile').open = true;
  const readProfile = () => {
    const p = {};
    profileFields.forEach((k) => { p[k] = (form.elements[k].value || '').trim(); });
    return p;
  };

  /* -------------------------------------------------------------- allowance */

  const used = () => store.get('count', 0);
  const unlocked = () => store.get('unlocked', false);
  const syncAllowance = () => {
    if (unlocked()) { allowance.textContent = 'Live · unlimited'; return; }
    const left = Math.max(0, FREE_POSTS - used());
    allowance.textContent = left ? `Live · ${left} free post${left === 1 ? '' : 's'} left` : 'Live · email to continue';
  };
  syncAllowance();

  const showGate = () => {
    gate.hidden = false;
    gate.classList.add('is-in');
    gate.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => $('#gateName').focus({ preventScroll: true }), 400);
  };

  /* ------------------------------------------------------ markdown renderer */

  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const inline = (s) => esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*(?!\s)(.+?)\*(?!\*)/g, '$1<em>$2</em>')
    .replace(/\[([^\]]{1,40})\]/g, '<mark>[$1]</mark>');

  const renderMarkdown = (md) => {
    const lines = md.replace(/\r/g, '').split('\n');
    let html = '';
    let list = null;
    let para = [];
    const flushPara = () => { if (para.length) { html += `<p>${para.map(inline).join('<br>')}</p>`; para = []; } };
    const closeList = () => { if (list) { html += `</${list}>`; list = null; } };
    for (const raw of lines) {
      const line = raw.trimEnd();
      let m;
      if (!line.trim()) { flushPara(); closeList(); continue; }
      if ((m = line.match(/^#{1,4}\s+(.*)$/))) {
        flushPara(); closeList();
        html += `<h4 class="hub-h">${inline(m[1])}</h4>`;
      } else if ((m = line.match(/^\s*[-•]\s+(.*)$/))) {
        flushPara();
        if (list !== 'ul') { closeList(); html += '<ul>'; list = 'ul'; }
        html += `<li>${inline(m[1])}</li>`;
      } else if ((m = line.match(/^\s*\d+[.)]\s+(.*)$/))) {
        flushPara();
        if (list !== 'ol') { closeList(); html += '<ol>'; list = 'ol'; }
        html += `<li>${inline(m[1])}</li>`;
      } else {
        closeList();
        para.push(line);
      }
    }
    flushPara(); closeList();
    return html;
  };

  // The copyable post is the first section ("Ready to publish", "Hooks" or "Rewritten").
  const firstSection = (md) => {
    const parts = md.split(/^#{1,4}\s+.*$/m).map((s) => s.trim()).filter(Boolean);
    const wanted = md.match(/^#{1,4}\s+Rewritten\s*$/m);
    if (wanted) return md.slice(wanted.index + wanted[0].length).split(/^#{1,4}\s/m)[0].trim();
    return (parts[0] || md).trim();
  };
  const plain = (s) => s.replace(/\*\*(.+?)\*\*/g, '$1');

  /* ------------------------------------------------------------- generate */

  const loading = () => {
    out.innerHTML = '<div class="hub-loading" role="status"><span></span><span></span><span></span><p>Writing your post…</p></div>';
  };

  const fail = (msg) => {
    out.innerHTML = `<div class="hub-error"><p>${esc(msg)}</p></div>`;
  };

  async function generate(overrides = {}) {
    if (busy) return;
    const text = input.value.trim();
    if (text.length < 10) {
      input.focus();
      input.setAttribute('aria-invalid', 'true');
      return;
    }
    input.removeAttribute('aria-invalid');
    if (!unlocked() && used() >= FREE_POSTS) { showGate(); return; }

    const profile = readProfile();
    store.set('profile', profile);
    const payload = {
      platform: overrides.platform || form.elements.platform.value,
      mode: mode.value,
      tone: overrides.tone || tone,
      input: text,
      business: profile,
    };

    busy = true;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Writing…';
    copyBtn.hidden = true;
    $('#hubRetone').hidden = true;
    loading();
    if (window.matchMedia('(max-width: 900px)').matches) {
      out.closest('.panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    try {
      const r = await fetch(`${API_BASE}/api/content-hub`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await r.json().catch(() => ({}));
      if (r.status === 429) return fail('You have written a lot of posts in the last hour. Give it a little while and try again.');
      if (!r.ok || !data.reply) return fail('The writer is unavailable just now. Please try again in a minute, or message us on WhatsApp.');
      lastReply = data.reply;
      out.innerHTML = `<div class="hub-result">${renderMarkdown(data.reply)}</div>`;
      copyBtn.hidden = false;
      copyBtn.textContent = 'Copy post';
      renderRetone(payload.tone);
      store.set('count', used() + 1);
      syncAllowance();
    } catch {
      fail('Could not reach the writer. Check your connection and try again.');
    } finally {
      busy = false;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Write my post';
    }
  }

  form.addEventListener('submit', (e) => { e.preventDefault(); generate(); });

  const renderRetone = (current) => {
    const box = $('#hubRetoneChips');
    box.innerHTML = '';
    TONES.filter((t) => t !== current).slice(0, 4).forEach((t) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.textContent = t;
      b.addEventListener('click', () => { tone = t; store.set('tone', t); renderTones(); generate(); });
      box.appendChild(b);
    });
    $('#hubRetone').hidden = false;
  };

  /* --------------------------------------------------------------- examples */

  const exBox = $('#hubExamples');
  EXAMPLES.forEach((ex) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = ex.label;
    b.addEventListener('click', () => {
      form.elements.platform.value = ex.platform;
      mode.value = 'create';
      syncMode();
      tone = ex.tone;
      renderTones();
      input.value = ex.input;
      input.focus();
    });
    exBox.appendChild(b);
  });

  /* ------------------------------------------------------------------ copy */

  const copyText = async (text, btn, done) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const t = document.createElement('textarea');
      t.value = text;
      document.body.appendChild(t);
      t.select();
      document.execCommand('copy');
      t.remove();
    }
    const old = btn.textContent;
    btn.textContent = done;
    setTimeout(() => { btn.textContent = old; }, 1800);
  };

  copyBtn.addEventListener('click', () => copyText(plain(firstSection(lastReply)), copyBtn, 'Copied'));
  $('#hubBadgeCopy').addEventListener('click', (e) => copyText($('#hubBadgeCode').value, e.currentTarget, 'Copied'));

  /* ------------------------------------------------------------------- gate */

  $('#hubGateForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = $('#gateMsg');
    const name = $('#gateName').value.trim();
    const email = $('#gateEmail').value.trim();
    const biz = $('#gateBiz').value.trim();
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = 'Please add your name and a valid email.'; return; }
    if (!$('#gateConsent').checked) { msg.textContent = 'Please tick the box so we can email you.'; return; }

    const btn = $('#gateSubmit');
    btn.disabled = true;
    msg.textContent = 'Unlocking…';
    const profile = readProfile();
    const answers = {
      contactName: name,
      contactEmail: email,
      contactCompany: biz || profile.name || '',
      industry: profile.industry,
      location: profile.location,
      goal: profile.objective,
      postsWritten: used(),
      marketingConsent: true,
    };
    try {
      await fetch(`${API_BASE}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: 'content-hub',
          serviceLabel: 'Social Content Hub signup',
          answers,
          summary: [{ section: 'Social Content Hub', rows: Object.entries(answers).filter(([, v]) => v !== '' && v !== undefined).map(([q, a]) => ({ q, a: String(a) })) }],
          page: window.location.href,
        }),
      });
    } catch { /* never block the visitor on our storage */ }
    store.set('unlocked', true);
    syncAllowance();
    msg.textContent = 'Done. Unlimited posts unlocked on this browser.';
    setTimeout(() => {
      gate.hidden = true;
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 1200);
  });
})();
