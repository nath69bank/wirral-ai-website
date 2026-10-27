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
  // Which site this is on: 'wirral' (www.wirral.ai) or 'contenthub' (socialapp.wirral.ai, which loads
  // this file from www.wirral.ai and sets window.wirralAI = { site: 'contenthub', apiBase: ... }).
  const IS_HUB = bridge().site === 'contenthub';
  const SITE_HOME = 'https://www.wirral.ai';

  /* Where the visitor came from (an ad or a link), kept for the visit so leads show their source. */
  const SOURCE = (() => {
    const KEY = 'wai-src';
    try {
      const q = new URLSearchParams(location.search);
      const bits = [q.get('utm_source'), q.get('utm_medium'), q.get('utm_campaign')].filter(Boolean);
      if (q.get('gclid')) bits.push('Google Ads');
      if (q.get('fbclid') && !bits.length) bits.push('Facebook');
      if (bits.length) {
        sessionStorage.setItem(KEY, bits.join(' / ').slice(0, 120));
      } else if (!sessionStorage.getItem(KEY) && document.referrer && !document.referrer.includes(location.host)) {
        sessionStorage.setItem(KEY, new URL(document.referrer).hostname);
      }
      return sessionStorage.getItem(KEY) || '';
    } catch (e) {
      return '';
    }
  })();

  /* ===================================================================== */
  /* Reliable in-page navigation                                            */
  /* Native hash jumps land under the sticky header and are thrown off by    */
  /* late-loading media. This measures the header at click time and settles  */
  /* the position once layout has stopped moving.                           */
  /* ===================================================================== */
  (() => {
    if (IS_HUB) return; // the app has its own smooth scrolling
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

  const STARTERS = IS_HUB
    ? ['Which plan is right for me?', 'Can it post for me automatically?', 'Could you automate other jobs in my business?', 'Book me a free call']
    : ['What could you automate for my business?', 'Can you build an assistant like you for my site?', 'How does it work and what does it cost?', 'Book me a free call'];

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
        <p class="asst-nudge-t">${IS_HUB ? 'Questions about Content Hub?' : 'Fed up of the boring bits?'}</p>
        <p class="asst-nudge-b">${IS_HUB ? 'Ask me anything, type or talk. I can book you a free call too.' : 'Ask what we could automate for you. Type or talk, and I can book your free call.'}</p>
        <span class="asst-nudge-go">Start a conversation &rarr;</span>
      </div>

      <button class="asst-fab" id="asstFab" type="button" aria-expanded="false" aria-controls="asstPanel"
              aria-label="Open the AI assistant">
        <span class="asst-fab-icon" data-open>${ICON_BOT}</span>
        <span class="asst-fab-icon" data-close hidden>${ICON_CLOSE}</span>
        <span class="asst-fab-pulse" aria-hidden="true"></span>
        <span class="asst-fab-dot" aria-hidden="true"></span>
      </button>

      <section class="asst-panel" id="asstPanel" role="dialog" aria-modal="false" aria-labelledby="asstHeading" hidden>
        <header class="asst-head">
          <div class="asst-head-id">
            <span class="asst-orb asst-orb--logo" aria-hidden="true">
              <img src="${IS_HUB ? SITE_HOME : ''}/assets/logo-mark-96.png" width="22" height="22" alt="" />
            </span>
            <div>
              <h2 id="asstHeading">${IS_HUB ? 'Content Hub assistant' : 'wirral.ai assistant'}</h2>
              <p class="asst-status" id="asstStatus">Live &middot; type or talk</p>
            </div>
          </div>
          <div class="asst-head-tools">
            <button class="asst-tool" id="asstVoiceOut" type="button" aria-pressed="false"
                    aria-label="Read replies aloud" title="Read replies aloud">${ICON_SPEAK}</button>
            <button class="asst-tool" id="asstMin" type="button" aria-label="Close the assistant" title="Close">${ICON_CLOSE}</button>
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
          AI answers can be wrong now and then. Prefer a person?
          <a href="https://wa.me/${WA()}" target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a>.
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

  const localCtx = { asked: [] };
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
    const ctx = bridge().ctx || localCtx;
    const asked = (ctx.asked || []).slice(-4);
    const parts = ['Hi wirral.ai, enquiry from ' + (IS_HUB ? 'Content Hub.' : 'your website.')];
    if (asked.length) {
      parts.push('', 'I was talking to the AI assistant on your site about:');
      asked.forEach((q) => parts.push('• ' + q));
    }
    if (ctx.sector) parts.push('', 'Sector: ' + ctx.sector);
    if (ctx.size) parts.push('Team size: ' + ctx.size);
    if (ctx.drain) parts.push('Where time goes: ' + ctx.drain);
    if (extra) parts.push('', extra);
    if (SOURCE) parts.push('', 'Found you via: ' + SOURCE);
    parts.push('', 'Could we have a short conversation about this?');
    return 'https://wa.me/' + WA() + '?text=' + encodeURIComponent(parts.join('\n'));
  };

  const nextStep = () => {
    const el = document.createElement('div');
    el.className = 'asst-msg asst-msg--bot';
    el.innerHTML = `<span class="asst-av" aria-hidden="true">AI</span><div class="asst-bub">
      <p>Want the version that fits your business exactly? A free twenty minute call with the team usually sorts it. I can book it for you now.</p>
      <div class="asst-actions">
        <button class="asst-chip" type="button" data-book>Book my free call</button>
        <a class="btn btn--wa btn--sm" href="${waLink()}" target="_blank" rel="noopener noreferrer" data-lead="whatsapp">Message the team instead</a>
      </div></div>`;
    el.querySelector('[data-book]').addEventListener('click', () => ask("Yes please, I'd like to book a free call."));
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
  };

  /* The booking card: one tap opens WhatsApp with everything the team needs, already written. */
  const bookingText = (l) => {
    const line = (k, v) => (v ? k + ': ' + v : null);
    return [
      "Hi wirral.ai, I'd like to book a free call.",
      '',
      line('Name', l.name),
      line('Business', [l.company, l.sector].filter(Boolean).join(', ')),
      line('What I would like automated', l.need),
      line('Team size', l.teamSize),
      line('Tools we use', l.tools),
      line('How soon', l.timeline),
      line('Best time for a call', l.preferredTime),
      line('Email', l.email),
      line('Notes', l.notes),
      '',
      'Booked through the AI assistant on ' + (IS_HUB ? 'Content Hub' : 'www.wirral.ai') + (SOURCE ? ' (found you via ' + SOURCE + ')' : '') + '.',
    ]
      .filter((x) => x !== null)
      .join('\n');
  };
  const bookingHref = (l) => 'https://wa.me/' + WA() + '?text=' + encodeURIComponent(bookingText(l));
  const bookingCard = (l) => {
    const href = bookingHref(l);
    const el = document.createElement('div');
    el.className = 'asst-msg asst-msg--bot';
    el.innerHTML = `<span class="asst-av" aria-hidden="true">AI</span><div class="asst-bub asst-book">
      <p><strong>Your free call</strong>${l.preferredTime ? ' · ' + esc(l.preferredTime) : ''}</p>
      <p class="asst-book-sub">Tap below and WhatsApp opens with your details already written. Just press send and the team will confirm.</p>
      <a class="btn btn--wa btn--sm asst-book-go" href="${href}" target="_blank" rel="noopener noreferrer" data-lead="book-whatsapp">Book on WhatsApp</a>
    </div>`;
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
    const ctx = bridge().ctx || localCtx;
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
        body: JSON.stringify({ messages: history.slice(-16), context: Object.assign({}, ctx || {}, { site: IS_HUB ? 'contenthub' : 'wirral', source: SOURCE }) }),
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
    const lead = takeLead(answer);
    answer = lead.text;

    t.remove();
    add('bot', answer);
    if (lead.lead) bookingCard(lead.lead);
    history.push({ role: 'assistant', content: answer });
    speak(answer);
    busy = false;
    sendBtn.disabled = false;
    status(speakReplies ? 'Voice on · replies read aloud' : 'Live · answers in seconds');

    const n = history.filter((m) => m.role === 'user').length;
    if ((n === 4 || n === 8) && !lastLead) nextStep();
    chips(STARTERS.filter((s) => !history.some((m) => m.content === s)));
  };

  /* The AI adviser can end a reply with a hidden <!--LEAD:{...}--> tag once it has
     enough from the conversation for a human to follow up and quote. Strip it from
     what's shown/spoken and log it as an enquiry so it reaches the dashboard even if
     the visitor never fills in the separate form. Never blocks or alters the visible
     reply if anything here fails. */
  const LEAD_RE = /<!--LEAD:([\s\S]*?)-->\s*$/;
  let lastLead = null;
  const takeLead = (text) => {
    const m = String(text).match(LEAD_RE);
    if (!m) return { text, lead: null };
    const clean = text.slice(0, m.index).trim();
    try {
      const lead = JSON.parse(m[1]);
      if (lead && lead.name && lead.need) {
        const changed = !lastLead || lastLead.preferredTime !== lead.preferredTime || lastLead.name !== lead.name;
        lastLead = lead;
        if (changed) submitChatLead(lead);
        return { text: clean, lead };
      }
    } catch (e) {
      /* malformed tag: drop it silently, still show the clean reply */
    }
    return { text: clean, lead: null };
  };
  const submitChatLead = (lead) => {
    fetch(API() + '/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service: 'chat',
        serviceLabel: IS_HUB ? 'Booked via Content Hub assistant' : 'Booked via website assistant',
        answers: {
          contactName: lead.name || '',
          contactCompany: lead.company || '',
          contactEmail: lead.email || '',
          contactPhone: lead.phone || '',
          sector: lead.sector || '',
          need: lead.need || '',
          teamSize: lead.teamSize || '',
          tools: lead.tools || '',
          timeline: lead.timeline || '',
          preferredTime: lead.preferredTime || '',
          interest: lead.interest || '',
          source: SOURCE,
          site: IS_HUB ? 'socialapp.wirral.ai' : 'www.wirral.ai',
          notes: lead.notes || '',
        },
        summary: [
          {
            section: 'Chat lead',
            rows: [
              { q: 'Need', a: lead.need || '' },
              { q: 'Best time for a call', a: lead.preferredTime || '' },
              { q: 'Team size', a: lead.teamSize || '' },
              { q: 'How soon', a: lead.timeline || '' },
              { q: 'Source', a: SOURCE || 'direct' },
              { q: 'Sector', a: lead.sector || '' },
              { q: 'Notes', a: lead.notes || '' },
            ],
          },
        ],
        page: location.host + location.pathname,
      }),
    }).catch(() => {});
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
      IS_HUB
        ? "Hi, I'm the Content Hub assistant. Type, or tap the microphone and just talk to me.\n\nAsk me anything about the app or the plans. And if there are other boring jobs eating your week, I can tell you what wirral.ai could automate and book you a free call."
        : "Hi, I'm the wirral.ai assistant. Type, or tap the microphone and just talk to me.\n\nTell me what eats your week and I'll tell you what we could automate. When you're ready, I can book you a free call on WhatsApp in a few seconds."
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
    fab.setAttribute('aria-label', 'Close the AI assistant');
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
    fab.setAttribute('aria-label', 'Open the AI assistant');
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

  // The homepage's inline chat panel shares the booking logic, so a lead is saved once.
  window.wirralAssistant = { open, close, ask, takeLead, bookingHref };
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
    if (IS_HUB) return;
    const modal = document.createElement('div');
    modal.className = 'exit';
    modal.id = 'exitLayer';
    modal.hidden = true;
    modal.innerHTML = `
      <div class="exit-scrim" data-exit-close></div>
      <div class="exit-card" role="dialog" aria-modal="true" aria-labelledby="exitTitle" aria-describedby="exitBody">
        <button class="exit-x" type="button" aria-label="Close" data-exit-close>${ICON_CLOSE}</button>
        <p class="exit-eyebrow">Before you go</p>
        <h2 class="exit-title" id="exitTitle">Before you go, one quick idea.</h2>
        <div class="exit-body" id="exitBody">
          <p>Most people leave a page like this no clearer than when they arrived. You don't have to.</p>
          <p>Tell us one boring job that eats your week and we'll come back with an honest read on whether we could automate it. No pitch, no mailing list, no obligation.</p>
        </div>
        <div class="exit-actions">
          <a class="btn btn--wa" id="exitWa" href="#" target="_blank" rel="noopener noreferrer" data-lead="exit-whatsapp">Message us on WhatsApp</a>
          <button class="btn btn--ghost" type="button" id="exitAsk" data-lead="exit-adviser">Ask the AI assistant</button>
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
