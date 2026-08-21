/* wirral.ai — floating AI assistant (text + voice), exit-intent capture,
   and reliable in-page navigation. Progressive enhancement only: if any of
   this fails, the page and its links still work. */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const bridge = () => window.wirralAI || {};
  const WA = () => bridge().waNumber || '447368349702';
  const API = () => (bridge().apiBase !== undefined ? bridge().apiBase : window.__API_BASE__ || '');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===================================================================== */
  /* Reliable in-page navigation                                            */
  /* Native hash jumps land under the sticky header and are thrown off by    */
  /* late-loading media. This measures the header at click time and settles  */
  /* the position once layout has stopped moving.                           */
  /* ===================================================================== */
  (() => {
    const headerOffset = () => {
      const h = document.getElementById('siteHeader');
      return (h ? h.offsetHeight : 0) + 20;
    };
    document.documentElement.style.setProperty('--header-offset', headerOffset() + 'px');
    window.addEventListener(
      'resize',
      () => document.documentElement.style.setProperty('--header-offset', headerOffset() + 'px'),
      { passive: true }
    );

    const goTo = (el, focus) => {
      const settle = (tries) => {
        const y = window.scrollY + el.getBoundingClientRect().top - headerOffset();
        window.scrollTo({ top: Math.max(0, y), behavior: reduced ? 'auto' : 'smooth' });
        if (tries > 0) setTimeout(() => settle(tries - 1), 420);
      };
      settle(2);
      if (focus) {
        const t = el.querySelector('h1, h2, h3, input, textarea, select, button') || el;
        if (!t.hasAttribute('tabindex') && !/^(A|BUTTON|INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) {
          t.setAttribute('tabindex', '-1');
        }
        setTimeout(() => t.focus({ preventScroll: true }), 900);
      }
    };

    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      if (history.replaceState) history.replaceState(null, '', '#' + id);
      goTo(el, true);
      // Any CTA that points at the qualifier should start it immediately.
      if (id === 'talk') {
        const first = el.querySelector('.q-opt');
        if (first) setTimeout(() => first.focus({ preventScroll: true }), 950);
      }
    });

    // Honour a hash present on load, once media has settled.
    if (location.hash.length > 1) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) window.addEventListener('load', () => setTimeout(() => goTo(el, false), 200));
    }
  })();

  /* ===================================================================== */
  /* Floating assistant                                                     */
  /* ===================================================================== */
  const ICON_BOT =
    '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="7" width="17" height="12" rx="3.5"/><path d="M12 7V3.8"/><circle cx="12" cy="2.6" r="1.2" fill="currentColor" stroke="none"/><path d="M8.6 12.2v1.6M15.4 12.2v1.6"/><path d="M9.8 16.2h4.4"/></svg>';
  const ICON_CLOSE =
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  const ICON_MIC =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2.6" width="6" height="11" rx="3"/><path d="M5.5 11.2a6.5 6.5 0 0 0 13 0"/><path d="M12 17.7V21M8.8 21h6.4"/></svg>';
  const ICON_SEND =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 12h14M12.5 5.5 19 12l-6.5 6.5"/></svg>';
  const ICON_SPEAK =
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5h3l4-3.2v11.4l-4-3.2H4z"/><path d="M15.2 9a4 4 0 0 1 0 6"/><path d="M17.8 6.6a7.4 7.4 0 0 1 0 10.8"/></svg>';
  const ICON_MUTE =
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5h3l4-3.2v11.4l-4-3.2H4z"/><path d="M15.5 9.5l4 5M19.5 9.5l-4 5"/></svg>';

  const STARTERS = [
    'Where would AI actually help us?',
    'What would working with you involve?',
    'Is our data safe with AI tools?',
    'How much does a first project cost?',
  ];

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const render = (text) => {
    const out = [];
    let list = false;
    String(text)
      .trim()
      .split('\n')
      .forEach((raw) => {
        const line = raw.trim();
        if (!line) return;
        if (/^[-•*]\s+/.test(line)) {
          if (!list) {
            out.push('<ul>');
            list = true;
          }
          out.push('<li>' + inline(line.replace(/^[-•*]\s+/, '')) + '</li>');
        } else {
          if (list) {
            out.push('</ul>');
            list = false;
          }
          out.push('<p>' + inline(line) + '</p>');
        }
      });
    if (list) out.push('</ul>');
    return out.join('');
  };
  const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  /* Strip markdown and links so spoken output sounds like a person. */
  const speakable = (s) =>
    String(s)
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/https?:\/\/\S+/g, 'the link on screen')
      .replace(/[•\-–—]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const build = () => {
    const wrap = document.createElement('div');
    wrap.className = 'asst';
    wrap.innerHTML = `
      <div class="asst-nudge" id="asstNudge" hidden>
        <button class="asst-nudge-x" type="button" aria-label="Dismiss">${ICON_CLOSE}</button>
        <p class="asst-nudge-t">Not sure where AI fits in your business?</p>
        <p class="asst-nudge-b">Ask our adviser — type or talk. No email, no form.</p>
        <span class="asst-nudge-go">Start a conversation &rarr;</span>
      </div>

      <button class="asst-fab" id="asstFab" type="button" aria-expanded="false" aria-controls="asstPanel"
              aria-label="Open the wirral.ai AI adviser">
        <span class="asst-fab-icon" data-open>${ICON_BOT}</span>
        <span class="asst-fab-icon" data-close hidden>${ICON_CLOSE}</span>
        <span class="asst-fab-pulse" aria-hidden="true"></span>
        <span class="asst-fab-dot" aria-hidden="true"></span>
      </button>

      <section class="asst-panel" id="asstPanel" role="dialog" aria-modal="false" aria-labelledby="asstHeading" hidden>
        <header class="asst-head">
          <div class="asst-head-id">
            <span class="asst-orb" aria-hidden="true">
              <svg viewBox="0 0 32 32" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M7 12.5V9a2 2 0 0 1 2-2h3.5"/><path d="M19.5 7H23a2 2 0 0 1 2 2v3.5"/><path d="M25 19.5V23a2 2 0 0 1-2 2h-3.5"/><path d="M12.5 25H9a2 2 0 0 1-2-2v-3.5"/><circle cx="16" cy="16" r="3.4" fill="currentColor" stroke="none"/></svg>
            </span>
            <div>
              <h2 id="asstHeading">wirral.ai adviser</h2>
              <p class="asst-status" id="asstStatus">Live &middot; answers in seconds</p>
            </div>
          </div>
          <div class="asst-head-tools">
            <button class="asst-tool" id="asstVoiceOut" type="button" aria-pressed="false"
                    aria-label="Read replies aloud" title="Read replies aloud">${ICON_SPEAK}</button>
            <button class="asst-tool" id="asstMin" type="button" aria-label="Close the adviser" title="Close">${ICON_CLOSE}</button>
          </div>
        </header>

        <div class="asst-log" id="asstLog" role="log" aria-live="polite" aria-relevant="additions"></div>

        <div class="asst-chips" id="asstChips"></div>

        <form class="asst-form" id="asstForm" autocomplete="off">
          <label class="sr-only" for="asstInput">Your question</label>
          <textarea id="asstInput" rows="1" placeholder="Ask anything, or tap the mic&hellip;"></textarea>
          <button class="asst-mic" id="asstMic" type="button" aria-label="Speak your question" title="Speak your question">${ICON_MIC}</button>
          <button class="asst-send" id="asstSend" type="submit" aria-label="Send">${ICON_SEND}</button>
        </form>
        <p class="asst-foot">
          Answers are indicative. For anything specific,
          <a href="#talk">send us four quick answers</a> or
          <a href="https://wa.me/${WA()}" target="_blank" rel="noopener noreferrer">message us on WhatsApp</a>.
        </p>
      </section>`;
    document.body.appendChild(wrap);
    return wrap;
  };

  const root = build();
  const fab = $('#asstFab');
  const panel = $('#asstPanel');
  const log = $('#asstLog');
  const chipBox = $('#asstChips');
  const form = $('#asstForm');
  const input = $('#asstInput');
  const sendBtn = $('#asstSend');
  const micBtn = $('#asstMic');
  const voiceOutBtn = $('#asstVoiceOut');
  const statusEl = $('#asstStatus');
  const nudge = $('#asstNudge');

  const history = [];
  let busy = false;
  let opened = false;
  let speakReplies = false;
  let nudgeShown = false;

  const status = (t) => {
    statusEl.textContent = t;
  };

  const add = (role, html, raw) => {
    const el = document.createElement('div');
    el.className = 'asst-msg asst-msg--' + role;
    el.innerHTML =
      '<span class="asst-av" aria-hidden="true">' +
      (role === 'user' ? 'You' : 'AI') +
      '</span><div class="asst-bub">' +
      (raw ? html : render(html)) +
      '</div>';
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  };

  const thinking = () => {
    const el = document.createElement('div');
    el.className = 'asst-msg asst-msg--bot';
    el.innerHTML =
      '<span class="asst-av" aria-hidden="true">AI</span><div class="asst-bub"><span class="asst-dots"><i></i><i></i><i></i></span></div>';
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  };

  const waLink = (extra) => {
    const ctx = bridge().ctx || { asked: [] };
    const asked = (ctx.asked || []).slice(-4);
    const parts = ['Hi wirral.ai — enquiry from your website.'];
    if (asked.length) {
      parts.push('', 'I was talking to the adviser on your site about:');
      asked.forEach((q) => parts.push('• ' + q));
    }
    if (ctx.sector) parts.push('', 'Sector: ' + ctx.sector);
    if (ctx.size) parts.push('Team size: ' + ctx.size);
    if (ctx.drain) parts.push('Where time goes: ' + ctx.drain);
    if (extra) parts.push('', extra);
    parts.push('', 'Could we have a short conversation about this?');
    return 'https://wa.me/' + WA() + '?text=' + encodeURIComponent(parts.join('\n'));
  };

  const nextStep = () => {
    const el = document.createElement('div');
    el.className = 'asst-msg asst-msg--bot';
    el.innerHTML = `<span class="asst-av" aria-hidden="true">AI</span><div class="asst-bub">
      <p>That's about as far as a general answer takes it. The useful version depends on how your organisation actually runs — which is a twenty minute conversation, not a longer chat with me.</p>
      <div class="asst-actions">
        <a class="btn btn--wa btn--sm" href="${waLink()}" target="_blank" rel="noopener noreferrer" data-lead="whatsapp">Send this to the team</a>
        <a class="asst-chip" href="#talk" data-lead="qualifier">Answer 4 quick questions</a>
      </div></div>`;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
  };

  const chips = (list) => {
    chipBox.innerHTML = '';
    list.slice(0, 3).forEach((q) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'asst-chip';
      b.textContent = q;
      b.addEventListener('click', () => ask(q));
      chipBox.appendChild(b);
    });
  };

  /* --------------------------------------------------------------- speech out */
  const synth = window.speechSynthesis || null;
  let voice = null;
  const pickVoice = () => {
    if (!synth) return;
    const vs = synth.getVoices();
    if (!vs.length) return;
    voice =
      vs.find((v) => /en-GB/i.test(v.lang) && /female|Sonia|Libby|Hazel|Serena|Google UK English Female/i.test(v.name)) ||
      vs.find((v) => /en-GB/i.test(v.lang)) ||
      vs.find((v) => /^en/i.test(v.lang)) ||
      vs[0];
  };
  if (synth) {
    pickVoice();
    synth.addEventListener && synth.addEventListener('voiceschanged', pickVoice);
  }
  const speak = (text) => {
    if (!synth || !speakReplies) return;
    try {
      synth.cancel();
      const u = new SpeechSynthesisUtterance(speakable(text).slice(0, 700));
      if (voice) u.voice = voice;
      u.lang = (voice && voice.lang) || 'en-GB';
      u.rate = 1.02;
      u.pitch = 1;
      u.onstart = () => root.classList.add('is-speaking');
      u.onend = u.onerror = () => root.classList.remove('is-speaking');
      synth.speak(u);
    } catch (e) {
      /* ignore */
    }
  };
  if (!synth) voiceOutBtn.hidden = true;
  voiceOutBtn.addEventListener('click', () => {
    speakReplies = !speakReplies;
    voiceOutBtn.setAttribute('aria-pressed', String(speakReplies));
    voiceOutBtn.innerHTML = speakReplies ? ICON_SPEAK : ICON_MUTE;
    voiceOutBtn.setAttribute('aria-label', speakReplies ? 'Stop reading replies aloud' : 'Read replies aloud');
    voiceOutBtn.title = voiceOutBtn.getAttribute('aria-label');
    if (!speakReplies && synth) synth.cancel();
    else status('Voice on · replies read aloud');
  });
  voiceOutBtn.innerHTML = ICON_MUTE;

  /* ---------------------------------------------------------------- speech in */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec = null;
  let listening = false;

  if (!SR) {
    micBtn.hidden = true;
  } else {
    rec = new SR();
    rec.lang = 'en-GB';
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;

    let finalText = '';
    rec.onstart = () => {
      listening = true;
      finalText = '';
      root.classList.add('is-listening');
      micBtn.setAttribute('aria-pressed', 'true');
      status('Listening… speak now');
    };
    rec.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interim += r[0].transcript;
      }
      input.value = (finalText + interim).replace(/\s+/g, ' ').trimStart();
      autosize();
    };
    rec.onerror = (e) => {
      listening = false;
      root.classList.remove('is-listening');
      micBtn.setAttribute('aria-pressed', 'false');
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        status('Microphone blocked — you can still type');
      } else if (e.error === 'no-speech') {
        status('Did not catch that — try again');
      } else {
        status('Voice unavailable — you can still type');
      }
    };
    rec.onend = () => {
      listening = false;
      root.classList.remove('is-listening');
      micBtn.setAttribute('aria-pressed', 'false');
      const v = input.value.trim();
      if (v) {
        status('Sending…');
        ask(v);
        input.value = '';
        autosize();
      } else {
        status('Live · answers in seconds');
      }
    };

    micBtn.addEventListener('click', () => {
      if (listening) {
        try {
          rec.stop();
        } catch (e) {}
        return;
      }
      if (synth) synth.cancel();
      // First time someone talks, assume they want to be answered aloud.
      if (!speakReplies) voiceOutBtn.click();
      try {
        rec.start();
      } catch (e) {
        status('Voice unavailable — you can still type');
      }
    });
  }

  /* --------------------------------------------------------------------- ask */
  const ask = async (q) => {
    if (busy || !q) return;
    busy = true;
    sendBtn.disabled = true;
    const ctx = bridge().ctx;
    if (ctx && ctx.asked) ctx.asked.push(q);
    add('user', q);
    history.push({ role: 'user', content: q });
    const t = thinking();
    status('Thinking…');

    let answer = null;
    try {
      const r = await fetch(API() + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.slice(-10), context: ctx || {} }),
      });
      if (r.ok) {
        const d = await r.json();
        if (d && d.reply) answer = d.reply;
      }
    } catch (e) {
      /* offline knowledge below */
    }
    if (!answer && bridge().localAnswer) answer = bridge().localAnswer(q);
    if (!answer) {
      answer =
        "That one really needs a look at how your organisation runs. The quickest route is a short conversation — send us a message and we'll give you a straight read.";
    }

    t.remove();
    add('bot', answer);
    history.push({ role: 'assistant', content: answer });
    speak(answer);
    busy = false;
    sendBtn.disabled = false;
    status(speakReplies ? 'Voice on · replies read aloud' : 'Live · answers in seconds');

    const n = history.filter((m) => m.role === 'user').length;
    if (n === 2 || n === 5) nextStep();
    chips(STARTERS.filter((s) => !history.some((m) => m.content === s)));
  };

  const autosize = () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  };
  input.addEventListener('input', autosize);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit'));
    }
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value.trim();
    if (!v) return;
    input.value = '';
    autosize();
    ask(v);
  });

  /* ------------------------------------------------------------ open / close */
  const greet = () => {
    add(
      'bot',
      "Hello — I'm the AI adviser built into this site. You can type, or press the microphone and just talk to me.\n\nAsk me where AI would genuinely fit in your organisation, what to be careful with, or how we'd approach a first project. I'll be straight with you, including when the answer is that AI isn't your priority."
    );
    chips(STARTERS);
  };

  const open = (seed) => {
    hideNudge();
    panel.hidden = false;
    root.classList.add('is-open');
    fab.setAttribute('aria-expanded', 'true');
    fab.querySelector('[data-open]').hidden = true;
    fab.querySelector('[data-close]').hidden = false;
    fab.setAttribute('aria-label', 'Close the wirral.ai AI adviser');
    fab.classList.remove('has-nudge');
    if (!opened) {
      opened = true;
      greet();
    }
    setTimeout(() => (window.innerWidth > 640 ? input.focus() : null), 260);
    if (seed) ask(seed);
  };

  const close = () => {
    root.classList.remove('is-open');
    fab.setAttribute('aria-expanded', 'false');
    fab.querySelector('[data-open]').hidden = false;
    fab.querySelector('[data-close]').hidden = true;
    fab.setAttribute('aria-label', 'Open the wirral.ai AI adviser');
    if (synth) synth.cancel();
    if (rec && listening) {
      try {
        rec.stop();
      } catch (e) {}
    }
    setTimeout(() => {
      if (!root.classList.contains('is-open')) panel.hidden = true;
    }, 260);
    fab.focus();
  };

  fab.addEventListener('click', () => (root.classList.contains('is-open') ? close() : open()));
  $('#asstMin').addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root.classList.contains('is-open')) close();
  });
  // Closing the panel when a link inside it is followed keeps the page usable.
  panel.addEventListener('click', (e) => {
    if (e.target.closest('a[href^="#"]')) close();
  });

  window.wirralAssistant = { open, close, ask };
  document.querySelectorAll('[data-open-assistant]').forEach((el) =>
    el.addEventListener('click', (e) => {
      e.preventDefault();
      open(el.getAttribute('data-open-assistant') || '');
    })
  );

  /* --------------------------------------------------------------- the nudge */
  /* One unobtrusive invitation, shown once, after the visitor has shown
     genuine interest by reading rather than on a blind timer. */
  const hideNudge = () => {
    nudge.hidden = true;
    root.classList.remove('has-nudge');
  };
  const showNudge = () => {
    if (nudgeShown || root.classList.contains('is-open')) return;
    nudgeShown = true;
    nudge.hidden = false;
    root.classList.add('has-nudge');
    setTimeout(() => {
      if (!root.classList.contains('is-open')) hideNudge();
    }, 14000);
  };
  nudge.addEventListener('click', (e) => {
    if (e.target.closest('.asst-nudge-x')) {
      e.stopPropagation();
      nudgeShown = true;
      hideNudge();
      return;
    }
    open();
  });

  (() => {
    let fired = false;
    const trigger = () => {
      if (fired) return;
      fired = true;
      showNudge();
    };
    const onScroll = () => {
      const depth = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (depth > 0.22) {
        trigger();
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    setTimeout(trigger, 32000);
  })();

  /* ===================================================================== */
  /* Exit intent                                                            */
  /* Shown once. Desktop: cursor leaves toward the browser chrome.           */
  /* Mobile: a decisive upward scroll after real engagement, or backgrounding.*/
  /* ===================================================================== */
  (() => {
    const modal = document.createElement('div');
    modal.className = 'exit';
    modal.id = 'exitLayer';
    modal.hidden = true;
    modal.innerHTML = `
      <div class="exit-scrim" data-exit-close></div>
      <div class="exit-card" role="dialog" aria-modal="true" aria-labelledby="exitTitle" aria-describedby="exitBody">
        <button class="exit-x" type="button" aria-label="Close" data-exit-close>${ICON_CLOSE}</button>
        <p class="exit-eyebrow">Before you go</p>
        <h2 class="exit-title" id="exitTitle">Wait &mdash; take the useful bit with you.</h2>
        <div class="exit-body" id="exitBody">
          <p>Most people leave a page like this no clearer than when they arrived. You don't have to.</p>
          <p>Tell us one sentence about your organisation and we'll come back with an honest read on where AI would genuinely earn its place &mdash; and where it wouldn't. No pitch deck, no mailing list, no obligation.</p>
        </div>
        <div class="exit-actions">
          <a class="btn btn--wa" id="exitWa" href="#" target="_blank" rel="noopener noreferrer" data-lead="exit-whatsapp">Message us on WhatsApp</a>
          <button class="btn btn--ghost" type="button" id="exitAsk" data-lead="exit-adviser">Ask the AI adviser first</button>
        </div>
        <p class="exit-note">Replies come from the person who would do the work, usually the same day.</p>
        <button class="exit-dismiss" type="button" data-exit-close>No thanks, I'm just looking</button>
      </div>`;
    document.body.appendChild(modal);

    let used = false;
    let engaged = false;
    let lastY = window.scrollY;
    const armedAt = Date.now() + 12000; // never interrupt the first few seconds

    setTimeout(() => {
      engaged = true;
    }, 12000);
    window.addEventListener(
      'scroll',
      () => {
        if ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight > 0.18) engaged = true;
      },
      { passive: true }
    );

    const suppressed = () =>
      used ||
      Date.now() < armedAt ||
      !engaged ||
      root.classList.contains('is-open') ||
      document.querySelector('.q-summary') || // already completed the qualifier
      (document.activeElement && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName));

    const show = () => {
      if (suppressed()) return;
      used = true;
      $('#exitWa', modal).setAttribute('href', waLink('I was about to leave your site — could you give me a quick honest read?'));
      modal.hidden = false;
      requestAnimationFrame(() => modal.classList.add('is-on'));
      const first = modal.querySelector('.exit-x');
      setTimeout(() => first && first.focus(), 320);
      document.documentElement.classList.add('exit-locked');
    };

    const hide = () => {
      modal.classList.remove('is-on');
      document.documentElement.classList.remove('exit-locked');
      setTimeout(() => (modal.hidden = true), 280);
    };

    modal.addEventListener('click', (e) => {
      if (e.target.closest('[data-exit-close]')) hide();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) hide();
    });
    $('#exitAsk', modal).addEventListener('click', () => {
      hide();
      setTimeout(() => open(), 240);
    });
    $('#exitWa', modal).addEventListener('click', hide);

    // Desktop: pointer exits through the top of the viewport.
    document.addEventListener('mouseout', (e) => {
      if (e.relatedTarget || e.toElement) return;
      if (e.clientY > 8) return;
      show();
    });

    // Mobile: a fast, deliberate upward flick towards the address bar.
    window.addEventListener(
      'scroll',
      () => {
        const y = window.scrollY;
        const delta = lastY - y;
        lastY = y;
        if (window.innerWidth > 900) return;
        if (delta > 90 && y < 260) show();
      },
      { passive: true }
    );

    // Tab switch or app switch — catch them on the way back.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && !suppressed()) {
        setTimeout(() => {
          if (document.visibilityState === 'visible') show();
        }, 400);
      }
    });
  })();
})();
