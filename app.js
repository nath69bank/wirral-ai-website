/* wirral.ai — site interactions, live AI adviser, opportunity finder, WhatsApp qualifier */
(() => {
  'use strict';

  const API_BASE = window.__API_BASE__ || '';
  const WA_NUMBER = '447368349702';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------------------------------------------------------------- theme */
  (() => {
    const btn = $('[data-theme-toggle]');
    const root = document.documentElement;
    const sun =
      '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4.5"/><path d="M12 1.5v2M12 20.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1.5 12h2M20.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>';
    const moon =
      '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    let mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const paint = () => {
      root.setAttribute('data-theme', mode);
      if (!btn) return;
      btn.innerHTML = mode === 'dark' ? sun : moon;
      btn.setAttribute('aria-label', `Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`);
    };
    paint();
    btn &&
      btn.addEventListener('click', () => {
        mode = mode === 'dark' ? 'light' : 'dark';
        paint();
      });
  })();

  /* ----------------------------------------------------------- header / nav */
  (() => {
    const header = $('#siteHeader');
    const nav = $('#nav');
    const menu = $('#menuBtn');
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    menu &&
      menu.addEventListener('click', () => {
        const open = nav.classList.toggle('is-open');
        menu.setAttribute('aria-expanded', String(open));
      });
    $$('#nav a').forEach((a) =>
      a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        menu && menu.setAttribute('aria-expanded', 'false');
      })
    );
    const y = $('#year');
    if (y) y.textContent = new Date().getFullYear();
  })();

  /* Reveal animations and the generative hero canvas live in motion.js. */

  /* =======================================================================
     Shared visitor context — feeds the WhatsApp lead summary
     ======================================================================= */
  const ctxStore = {
    sector: '',
    size: '',
    drain: '',
    asked: [],
    opportunities: [],
  };

  /* =======================================================================
     AI adviser
     ======================================================================= */
  const chat = (() => {
    const log = $('#chatLog');
    const form = $('#chatForm');
    const input = $('#chatInput');
    const send = $('#chatSend');
    const chipBox = $('#chatChips');
    if (!log) return {};

    const history = [];
    let busy = false;

    const STARTERS = [
      'What could you automate for my business?',
      'Can you answer and book my enquiries for me?',
      'How does it work and what does it cost?',
      'Book me a free call',
    ];

    const esc = (s) =>
      String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    const render = (text) => {
      const lines = String(text).trim().split('\n');
      let html = '';
      let inList = false;
      for (const raw of lines) {
        const line = raw.trim();
        if (!line) continue;
        if (/^[-•*]\s+/.test(line)) {
          if (!inList) {
            html += '<ul>';
            inList = true;
          }
          html += `<li>${inline(line.replace(/^[-•*]\s+/, ''))}</li>`;
        } else {
          if (inList) {
            html += '</ul>';
            inList = false;
          }
          html += `<p>${inline(line)}</p>`;
        }
      }
      if (inList) html += '</ul>';
      return html;
    };
    const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    const add = (role, text, opts = {}) => {
      const el = document.createElement('div');
      el.className = `msg msg--${role}`;
      el.innerHTML = `<span class="msg-avatar" aria-hidden="true">${role === 'user' ? 'You' : 'AI'}</span><div class="msg-bubble">${
        opts.raw ? text : render(text)
      }</div>`;
      log.appendChild(el);
      log.scrollTop = log.scrollHeight;
      return el;
    };

    const thinking = () => {
      const el = document.createElement('div');
      el.className = 'msg msg--bot';
      el.innerHTML =
        '<span class="msg-avatar" aria-hidden="true">AI</span><div class="msg-bubble"><span class="dots"><i></i><i></i><i></i></span></div>';
      log.appendChild(el);
      log.scrollTop = log.scrollHeight;
      return el;
    };

    const handoff = () => {
      const el = document.createElement('div');
      el.className = 'msg msg--bot';
      el.innerHTML = `<span class="msg-avatar" aria-hidden="true">AI</span><div class="msg-bubble">
        <p>Want the version that fits your business exactly? Ask me to book you a free call, or message the team on WhatsApp.</p>
        <div class="chips" style="margin-top:var(--space-3)">
          <button class="chip" type="button" data-book>Book my free call</button>
          <a class="btn btn--wa btn--sm" href="${waLink()}" target="_blank" rel="noopener noreferrer">Message the team</a>
        </div></div>`;
      el.querySelector('[data-book]').addEventListener('click', () => ask("Yes please, I'd like to book a free call."));
      log.appendChild(el);
      log.scrollTop = log.scrollHeight;
    };

    const waLink = () => {
      const parts = [
        'Hi wirral.ai, enquiry from your website.',
        '',
        'I was using the AI assistant on your site and asked about:',
        ...ctxStore.asked.slice(-4).map((q) => `• ${q}`),
      ];
      if (ctxStore.sector) parts.push('', `Sector: ${ctxStore.sector}`);
      if (ctxStore.size) parts.push(`Team size: ${ctxStore.size}`);
      if (ctxStore.drain) parts.push(`Where time goes: ${ctxStore.drain}`);
      parts.push('', 'Could we have a conversation about this?');
      return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(parts.join('\n'))}`;
    };

    const chips = (list) => {
      chipBox.innerHTML = '';
      list.forEach((q) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'chip';
        b.textContent = q;
        b.addEventListener('click', () => {
          input.value = q;
          form.dispatchEvent(new Event('submit'));
        });
        chipBox.appendChild(b);
      });
    };

    /* Local knowledge fallback — keeps the adviser useful without a model key */
    const LOCAL = [
      {
        k: ["start", "begin", "first step", "where do we", "no idea", "dont know", "don't know"],
        a: "Easiest place to start is your week. Which jobs come round again and again and take time you would rather spend elsewhere? Replying to enquiries, quotes, reminders, admin and social posts are the usual suspects.\n\nTell me what your business does and what eats your time, and I'll tell you what we would automate first.",
      },
      {
        k: ["automat", "workflow", "repetitive", "zapier", "make.com", "n8n", "admin", "boring"],
        a: "That's exactly what we do. If a job follows the same steps most of the time, it can usually run on its own: quotes, confirmations, reminders, follow ups, moving details between systems and monthly reports.\n\nA person still checks anything that matters. What's the job you'd most like off your plate?",
      },
      {
        k: ["train", "staff", "team", "literacy", "educat", "upskill", "confiden", "techy"],
        a: "You don't need to be techy. We set everything up around the tools you already use, then show you and your team how it works in plain English with a short written guide.\n\nAnd we look after it once it's live, so you're never stuck.",
      },
      {
        k: ["data", "secur", "gdpr", "privacy", "risk", "confidential", "safe", "complian"],
        a: "We handle data carefully as part of the design. We look at what a tool would see, where it goes, what should never be shared, and where a person needs to stay in the loop.\n\nYou'll always know exactly what is running and why.",
      },
      {
        k: ["cost", "price", "pricing", "budget", "how much", "fee", "expensive", "plan"],
        a: "Custom work is a fixed price agreed after a short free chat, so there are no surprises and no hourly billing.\n\nIf you'd like to see what AI can do first, our Content Hub app is free to start, with Starter at £9 and Pro at £19 a month.",
      },
      {
        k: ["content", "social", "post", "instagram", "facebook", "tiktok", "linkedin", "content hub"],
        a: "Content Hub is our own app for exactly that. It learns your business and your voice and writes and schedules your posts. It's free to start at socialapp.wirral.ai.\n\nOr our Done for you plan has our team run it with you each month.",
      },
      {
        k: ["build", "implement", "custom", "bespoke", "develop", "integrat", "solution", "website"],
        a: "We build around the tools you already use, test it on real work, and hand it over properly. That can be an assistant on your website, connected systems, or a fast AI ready website with the assistant built in.\n\nWhat would you most like to get running?",
      },
      {
        k: ["who do you work", "client", "sector", "experience", "case stud", "reference"],
        a: "We've supported more than forty organisations across the North West and beyond, in retail, clinical, hospitality, trades, membership and professional services.\n\nClient work stays private, but we're happy to talk through relevant experience on a call.",
      },
      {
        k: ["who are you", "what is wirral", "about you", "what do you do"],
        a: "wirral.ai automates the boring tasks for UK businesses so you can focus on the fun stuff. AI assistants that answer and book your enquiries, admin that runs itself, and content written in your voice.\n\nWe're based in Widnes and work across the North West and UK wide.",
      },
      {
        k: ["call", "book", "meet", "contact", "speak", "talk to"],
        a: "Happy to book you a free call. Message us on WhatsApp on +44 7368 349702 with your name, your business and the best time to talk, and the team will confirm.",
      },
      {
        k: ["chatbot", "agent", "assistant", "receptionist", "answer enquir", "voice"],
        a: "Yes, we build assistants like me for your website. Trained on your services and prices, they answer by chat and voice day or night, ask the right questions, and book the good enquiries straight into your WhatsApp or diary.\n\nWhat kind of enquiries do you get most?",
      },
      {
        k: ["small", "sme", "size", "too small", "employees", "headcount", "sole trader"],
        a: "No business is too small. Sole traders often get the most out of it, because every hour saved is your own.\n\nWhat does your business do?",
      },
    ];

    const localAnswer = (q) => {
      const s = q.toLowerCase();
      let best = null;
      let bestScore = 0;
      for (const item of LOCAL) {
        const score = item.k.reduce((n, k) => n + (s.includes(k) ? k.length : 0), 0);
        if (score > bestScore) {
          bestScore = score;
          best = item;
        }
      }
      if (best) return best.a;
      return "Good question. The honest answer depends on how your business runs, which is what a free twenty minute call is for.\n\nWhat I can tell you: we take repetitive work off your plate, from answering and booking enquiries to admin and social posts. Tell me what eats your week and I'll give you a more specific idea.";
    };

    const ask = async (q) => {
      if (busy) return;
      busy = true;
      send.disabled = true;
      ctxStore.asked.push(q);
      add('user', q);
      history.push({ role: 'user', content: q });
      const t = thinking();

      let answer = null;
      try {
        const r = await fetch(`${API_BASE}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history.slice(-16), context: Object.assign({}, ctxStore, { site: 'wirral', source: (() => { try { return sessionStorage.getItem('wai-src') || ''; } catch (e) { return ''; } })() }) }),
        });
        if (r.ok) {
          const d = await r.json();
          if (d && d.reply) answer = d.reply;
        }
      } catch (e) {
        /* fall through to local */
      }
      if (!answer) answer = localAnswer(q);
      // The hidden booking line: strip it, save the lead, and show the WhatsApp booking button.
      const wa = window.wirralAssistant;
      const booked = wa && wa.takeLead ? wa.takeLead(answer) : { text: answer.replace(/<!--LEAD:[\s\S]*?-->\s*$/, '').trim(), lead: null };
      answer = booked.text;

      t.remove();
      add('bot', answer);
      if (booked.lead && wa.bookingHref) {
        add('bot', `<p><strong>Your free call</strong>${booked.lead.preferredTime ? ' · ' + esc(booked.lead.preferredTime) : ''}</p><p>Tap below and WhatsApp opens with your details already written. Just press send.</p><a class="btn btn--wa btn--sm" href="${wa.bookingHref(booked.lead)}" target="_blank" rel="noopener noreferrer">Book on WhatsApp</a>`, { raw: true });
      }
      history.push({ role: 'assistant', content: answer });
      busy = false;
      send.disabled = false;
      input.focus();

      if (ctxStore.asked.length === 4 || ctxStore.asked.length === 8) handoff();
      chips(STARTERS.filter((s) => !ctxStore.asked.includes(s)).slice(0, 3));
    };

    add(
      'bot',
      "I'm the wirral.ai assistant, the same kind we build for businesses. Tell me what eats your week and I'll tell you what we could automate.\n\nWhen you're ready, I can book you a free call on WhatsApp in a few seconds."
    );
    chips(STARTERS.slice(0, 3));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = input.value.trim();
      if (!v) return;
      input.value = '';
      input.style.height = 'auto';
      ask(v);
    });
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = `${Math.min(input.scrollHeight, 120)}px`;
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        form.dispatchEvent(new Event('submit'));
      }
    });

    return { ask, localAnswer, waLink };
  })();

  /* =======================================================================
     AI opportunity finder
     ======================================================================= */
  (() => {
    const form = $('#finderForm');
    const out = $('#finderOut');
    const btn = $('#finderBtn');
    if (!form) return;

    const LIB = [
      {
        title: 'Enquiry triage and first response',
        why: 'Inbound enquiries are answered instantly, qualified against your criteria, and routed to the right person with context attached, so nothing sits over a weekend.',
        effort: 'Low effort',
        area: 'Automation',
        m: ['enquir', 'lead', 'email', 'phone', 'call', 'miss', 'respond', 'weekend', 'inbox', 'message'],
      },
      {
        title: 'Quoting and proposal drafting',
        why: 'A first-pass quote or proposal is drafted from your own pricing logic and past documents, then reviewed by a human. Turnaround drops from days to the same afternoon.',
        effort: 'Medium effort',
        area: 'Implementation',
        m: ['quot', 'proposal', 'tender', 'estimat', 'pricing', 'bid', 'spec'],
      },
      {
        title: 'An internal answer engine over your own documents',
        why: 'Staff ask a question in plain English and get an answer drawn from your procedures, contracts and past projects, with the source shown, so it can be checked.',
        effort: 'Medium effort',
        area: 'Implementation',
        m: ['find', 'document', 'knowledge', 'polic', 'procedure', 'contract', 'search', 'file', 'sharepoint', 'ask', 'informat'],
      },
      {
        title: 'Reporting that assembles itself',
        why: 'Recurring reports are pulled together from your systems and drafted for review, rather than rebuilt by hand each period.',
        effort: 'Medium effort',
        area: 'Automation',
        m: ['report', 'spreadsheet', 'excel', 'month', 'data entry', 'kpi', 'dashboard', 'manual', 'retyp', 'admin'],
      },
      {
        title: 'Scheduling, reminders and no-show reduction',
        why: 'Bookings, confirmations and reminders run themselves across the channels your customers actually use, which reliably closes gaps in the diary.',
        effort: 'Low effort',
        area: 'Automation',
        m: ['book', 'appoint', 'schedul', 'diary', 'no-show', 'no show', 'calendar', 'remind', 'cancel'],
      },
      {
        title: 'Notes, records and write-ups from conversation',
        why: 'Calls and meetings are captured and turned into structured records in your systems, so the admin tail after every conversation shrinks.',
        effort: 'Low effort',
        area: 'Implementation',
        m: ['note', 'record', 'meeting', 'minute', 'write up', 'write-up', 'crm', 'log', 'case', 'patient', 'client file'],
      },
      {
        title: 'Onboarding and handover packs',
        why: 'New starters and new clients get consistent, current information generated from your own material instead of whatever the last person happened to send.',
        effort: 'Low effort',
        area: 'Capability',
        m: ['onboard', 'new starter', 'train', 'induct', 'handover', 'staff', 'turnover', 'recruit'],
      },
      {
        title: 'A written standard for safe AI use',
        why: 'Your people are almost certainly using AI tools already. A short, practical standard, what to use, what never to paste in, when a human must check, removes most of the exposure quickly.',
        effort: 'Low effort',
        area: 'Capability',
        m: ['safe', 'risk', 'data', 'gdpr', 'confidential', 'polic', 'complian', 'secur', 'legal', 'clinical', 'patient', 'client data'],
      },
      {
        title: 'Content and communications production',
        why: 'Routine customer communications and marketing material are drafted in your voice from a shared brief, cutting production time without outsourcing judgement.',
        effort: 'Low effort',
        area: 'Implementation',
        m: ['content', 'market', 'social', 'newsletter', 'blog', 'website', 'copy', 'brand', 'post'],
      },
      {
        title: 'Stock, orders and supplier admin',
        why: 'Order and supplier paperwork is read, checked against your records and flagged only when something looks wrong, instead of every line being read by a person.',
        effort: 'Medium effort',
        area: 'Automation',
        m: ['stock', 'order', 'supplier', 'invoice', 'purchase', 'delivery', 'retail', 'inventory', 'account'],
      },
    ];

    const localFind = ({ sector, size, drain }) => {
      const hay = `${sector} ${drain}`.toLowerCase();
      const scored = LIB.map((o) => ({
        o,
        s: o.m.reduce((n, k) => n + (hay.includes(k) ? 1 : 0), 0),
      }))
        .sort((a, b) => b.s - a.s)
        .filter((x, i) => x.s > 0 || i < 3)
        .slice(0, 3)
        .map((x) => ({ title: x.o.title, why: x.o.why, effort: x.o.effort, area: x.o.area }));
      const safe = LIB[7];
      if (!scored.some((s) => s.title === safe.title) && /25|75|250|\+/.test(size)) {
        scored[2] = { title: safe.title, why: safe.why, effort: safe.effort, area: safe.area };
      }
      return scored;
    };

    const waLink = () => {
      const parts = [
        'Hi wirral.ai, enquiry from your website.',
        '',
        'I used the AI opportunity finder and got this:',
        '',
        `Sector: ${ctxStore.sector}`,
        `Team size: ${ctxStore.size}`,
        `Where the time goes: ${ctxStore.drain}`,
        '',
        'Suggested areas:',
        ...ctxStore.opportunities.map((o, i) => `${i + 1}. ${o.title}`),
        '',
        "Could we have a conversation about whether any of this is right for us?",
      ];
      return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(parts.join('\n'))}`;
    };

    const paint = (ops) => {
      ctxStore.opportunities = ops;
      out.innerHTML = '';
      ops.forEach((o, i) => {
        const el = document.createElement('article');
        el.className = 'op';
        el.style.animationDelay = `${i * 80}ms`;
        el.innerHTML = `<h4><span>${o.title}</span></h4><p>${o.why}</p>
          <div class="op-meta"><span>${o.area}</span><span>${o.effort}</span></div>`;
        out.appendChild(el);
      });
      const cta = document.createElement('div');
      cta.style.cssText = 'display:grid;gap:var(--space-3);margin-top:var(--space-2)';
      cta.innerHTML = `<a class="btn btn--wa btn--block" href="${waLink()}" target="_blank" rel="noopener noreferrer">Send this to wirral.ai on WhatsApp</a>
        <p class="notice">A first read, not a recommendation, the real answer depends on your systems, data and appetite for change. Sending it over means we start the conversation already knowing your position.</p>`;
      out.appendChild(cta);
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const sector = $('#fSector').value.trim();
      const size = $('#fSize').value;
      const drain = $('#fDrain').value.trim();
      if (!sector || !drain) return;
      ctxStore.sector = sector;
      ctxStore.size = size;
      ctxStore.drain = drain;

      btn.disabled = true;
      btn.textContent = 'Working through it…';
      out.innerHTML = '<div class="skel"></div><div class="skel"></div><div class="skel"></div>';

      let ops = null;
      try {
        const r = await fetch(`${API_BASE}/api/opportunities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sector, size, drain }),
        });
        if (r.ok) {
          const d = await r.json();
          if (d && Array.isArray(d.opportunities) && d.opportunities.length) ops = d.opportunities.slice(0, 3);
        }
      } catch (err) {
        /* fall through */
      }
      if (!ops) {
        await new Promise((res) => setTimeout(res, 700));
        ops = localFind({ sector, size, drain });
      }
      paint(ops);
      btn.disabled = false;
      btn.textContent = 'Run it again';
    });
  })();

  /* =======================================================================
     Four-question qualifier → WhatsApp lead
     ======================================================================= */
  (() => {
    const host = $('#qSteps');
    const prog = $('#qProgress');
    if (!host) return;

    const answers = { driver: '', size: '', stage: '', when: '', name: '', org: '', note: '' };
    let step = 0;

    const QS = [
      {
        key: 'driver',
        q: "What's prompting this?",
        help: 'Pick whichever is closest.',
        options: [
          ['Not sure where to start', 'We know AI matters but not what to do about it'],
          ['A specific idea to implement', 'We have something in mind and need it built'],
          ['Repetitive work to remove', 'There is admin volume eating our capacity'],
          ['Our people need guidance', 'Staff are using AI without a standard'],
          ['The board or a client is asking', 'We need a position we can defend'],
        ],
      },
      {
        key: 'size',
        q: 'How large is the organisation?',
        options: [['Just me – 5'], ['6 – 25'], ['26 – 75'], ['76 – 250'], ['250+']],
      },
      {
        key: 'stage',
        q: 'Where are you with AI today?',
        options: [
          ['Nothing started yet'],
          ['Individuals experimenting informally'],
          ['A tool or two in regular use'],
          ['Something built that needs improving'],
        ],
      },
      {
        key: 'when',
        q: 'What kind of timescale?',
        options: [
          ['Exploring for now', 'No pressure, gathering understanding'],
          ['Next one to three months', 'We want to move on this'],
          ['Budgeted and active', 'Ready to start once we know what to do'],
        ],
      },
    ];

    const setProg = (n) => {
      $$('#qProgress i').forEach((i, idx) => i.classList.toggle('done', idx <= n));
    };

    const waLink = () => {
      const parts = [
        'Hi wirral.ai, enquiry from your website.',
        '',
        `Name: ${answers.name || '(not given)'}`,
        `Organisation: ${answers.org || '(not given)'}`,
        `Team size: ${answers.size}`,
        `What's prompting it: ${answers.driver}`,
        `Where we are with AI: ${answers.stage}`,
        `Timescale: ${answers.when}`,
      ];
      if (ctxStore.sector) parts.push(`Sector: ${ctxStore.sector}`);
      if (ctxStore.drain) parts.push(`Where the time goes: ${ctxStore.drain}`);
      if (ctxStore.opportunities.length)
        parts.push(`Finder suggested: ${ctxStore.opportunities.map((o) => o.title).join('; ')}`);
      if (ctxStore.asked.length) parts.push(`Asked your adviser about: ${ctxStore.asked.slice(-3).join(' / ')}`);
      if (answers.note) parts.push('', `Extra detail: ${answers.note}`);
      parts.push('', 'Happy to have a conversation whenever suits.');
      return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(parts.join('\n'))}`;
    };

    const back = (to) => {
      step = to;
      draw();
    };

    const draw = () => {
      setProg(step);
      host.innerHTML = '';
      const wrap = document.createElement('div');
      wrap.className = 'q-step is-active';

      if (step < QS.length) {
        const s = QS[step];
        wrap.innerHTML = `<p class="q-q">${s.q}</p>${s.help ? `<p class="q-help">${s.help}</p>` : ''}<div class="q-options"></div>`;
        const box = wrap.querySelector('.q-options');
        s.options.forEach(([label, sub]) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'q-opt';
          b.innerHTML = `<span>${label}${sub ? `<small>${sub}</small>` : ''}</span>`;
          b.addEventListener('click', () => {
            answers[s.key] = label;
            step += 1;
            draw();
          });
          box.appendChild(b);
        });
        if (step > 0) {
          const nav = document.createElement('div');
          nav.className = 'q-nav';
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'q-back';
          b.textContent = 'Back';
          b.addEventListener('click', () => back(step - 1));
          nav.appendChild(b);
          wrap.appendChild(nav);
        }
      } else {
        wrap.innerHTML = `
          <p class="q-q">Last bit, who are we speaking to?</p>
          <p class="q-help">Your answers are attached to the message so we can respond properly first time.</p>
          <div class="field-row">
            <div class="field"><label for="qName">Your name</label><input id="qName" autocomplete="name" placeholder="Alex Doyle" /></div>
            <div class="field"><label for="qOrg">Organisation</label><input id="qOrg" autocomplete="organization" placeholder="Doyle & Co" /></div>
          </div>
          <div class="field"><label for="qNote">Anything else worth knowing? (optional)</label><textarea id="qNote" placeholder="A sentence is plenty."></textarea></div>
          <div class="q-summary" id="qSummary"></div>
          <a class="btn btn--wa btn--block" id="qSend" href="#" target="_blank" rel="noopener noreferrer">
            Send to wirral.ai on WhatsApp
          </a>
          <div class="q-nav">
            <button type="button" class="q-back" id="qBack">Back</button>
            <a class="q-back" href="https://link.gohighlevel.com/widget/booking/N3VjOqWz4rks3tHK5HRp" target="_blank" rel="noopener noreferrer">Rather book a time in the diary</a>
          </div>
          <p class="notice">Opens WhatsApp with your summary already written. You send it, nothing is submitted before that.</p>`;
        host.appendChild(wrap);

        const sum = $('#qSummary');
        sum.innerHTML = [
          ['Prompting it', answers.driver],
          ['Size', answers.size],
          ['Stage', answers.stage],
          ['Timescale', answers.when],
        ]
          .map(([k, v]) => `<div><span>${k}</span><span>${v}</span></div>`)
          .join('');

        const sync = () => {
          answers.name = $('#qName').value.trim();
          answers.org = $('#qOrg').value.trim();
          answers.note = $('#qNote').value.trim();
          $('#qSend').setAttribute('href', waLink());
        };
        ['qName', 'qOrg', 'qNote'].forEach((id) => $(`#${id}`).addEventListener('input', sync));
        sync();
        $('#qBack').addEventListener('click', () => back(step - 1));
        return;
      }
      host.appendChild(wrap);
    };

    draw();
  })();
  /* ---------------------------------------------------------------- bridge */
  /* The floating assistant (assistant.js) shares visitor context and the
     offline knowledge fallback so both surfaces stay consistent. */
  window.wirralAI = {
    ctx: ctxStore,
    waNumber: WA_NUMBER,
    apiBase: API_BASE,
    localAnswer: (q) => (chat && chat.localAnswer ? chat.localAnswer(q) : ''),
    jumpToAdviser: () => {
      const el = document.getElementById('live');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
  };
})();
