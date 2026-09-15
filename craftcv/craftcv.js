/* CraftCV — AI CV / career co-pilot workspace */
(() => {
  'use strict';

  const API_BASE = window.__API_BASE__ || '';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const draftEl = $('#cvDraft');
  const jobSpecEl = $('#cvJobSpec');
  if (!draftEl) return;

  const wordCountEl = $('#cvWordCount');
  const clearBtn = $('#cvClear');
  const copyBtn = $('#cvCopy');
  const downloadBtn = $('#cvDownload');
  const modesEl = $('#cvModes');
  const log = $('#cvChatLog');
  const form = $('#cvChatForm');
  const input = $('#cvChatInput');
  const send = $('#cvChatSend');

  const STORE_DRAFT = 'craftcv:draft';
  const STORE_JOBSPEC = 'craftcv:jobspec';

  /* ------------------------------------------------------------- storage */
  const load = (key) => {
    try {
      return localStorage.getItem(key) || '';
    } catch {
      return '';
    }
  };
  const save = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* private mode / storage blocked — carry on without persistence */
    }
  };

  draftEl.value = load(STORE_DRAFT);
  if (jobSpecEl) jobSpecEl.value = load(STORE_JOBSPEC);

  /* ------------------------------------------------------------ draft ui */
  const updateWordCount = () => {
    const n = draftEl.value.trim() ? draftEl.value.trim().split(/\s+/).length : 0;
    if (wordCountEl) wordCountEl.textContent = `${n} word${n === 1 ? '' : 's'}`;
  };
  updateWordCount();

  draftEl.addEventListener('input', () => {
    updateWordCount();
    save(STORE_DRAFT, draftEl.value);
  });

  jobSpecEl &&
    jobSpecEl.addEventListener('input', () => {
      save(STORE_JOBSPEC, jobSpecEl.value);
    });

  clearBtn &&
    clearBtn.addEventListener('click', () => {
      if (!draftEl.value.trim() || window.confirm('Clear your CV draft? This cannot be undone.')) {
        draftEl.value = '';
        save(STORE_DRAFT, '');
        updateWordCount();
        draftEl.focus();
      }
    });

  copyBtn &&
    copyBtn.addEventListener('click', async () => {
      const original = copyBtn.textContent;
      try {
        await navigator.clipboard.writeText(draftEl.value);
        copyBtn.textContent = 'Copied';
      } catch {
        copyBtn.textContent = 'Select the text and copy manually';
      }
      setTimeout(() => {
        copyBtn.textContent = original;
      }, 1800);
    });

  downloadBtn &&
    downloadBtn.addEventListener('click', () => {
      const blob = new Blob([draftEl.value], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cv-draft.txt';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });

  const insertIntoDraft = (text) => {
    const clean = text.trim();
    if (!clean) return;
    const needsGap = draftEl.value && !draftEl.value.endsWith('\n\n');
    draftEl.value = draftEl.value + (draftEl.value ? (needsGap ? '\n\n' : '') : '') + clean;
    save(STORE_DRAFT, draftEl.value);
    updateWordCount();
  };

  /* --------------------------------------------------------------- modes */
  const MODE_TAGS = {
    polish: '[POLISH]',
    expand: '[EXPAND/BRAINSTORM]',
    keyword: '[KEYWORD MATCH]',
  };
  let mode = 'polish';

  if (modesEl) {
    $$('.chip', modesEl).forEach((btn) => {
      btn.addEventListener('click', () => {
        mode = btn.dataset.mode;
        $$('.chip', modesEl).forEach((b) => {
          const active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-checked', String(active));
        });
        if (mode === 'keyword') {
          const details = $('.cv-jobspec');
          if (details && !details.open) details.open = true;
        }
      });
    });
  }

  /* ---------------------------------------------------------------- chat */
  if (!log) return;

  const history = [];
  let busy = false;

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const inline = (s) =>
    esc(s)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  const stripFooter = (text) =>
    String(text)
      .replace(/\n?-{3,}\s*\n\*?Built with precision by[^\n]*$/i, '')
      .trim();

  const render = (text) => {
    const body = stripFooter(text);
    const lines = body.split('\n');
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

  const add = (role, text, opts = {}) => {
    const el = document.createElement('div');
    el.className = `msg msg--${role}`;
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.innerHTML = opts.raw ? text : render(text);

    const avatar = document.createElement('span');
    avatar.className = 'msg-avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = role === 'user' ? 'You' : 'CV';

    el.appendChild(avatar);
    el.appendChild(bubble);

    if (role === 'bot' && !opts.raw && stripFooter(text)) {
      const actions = document.createElement('div');
      actions.className = 'cv-msg-actions';
      const insertBtn = document.createElement('button');
      insertBtn.type = 'button';
      insertBtn.className = 'cv-insert-btn';
      insertBtn.textContent = 'Insert into draft';
      insertBtn.addEventListener('click', () => {
        insertIntoDraft(stripFooter(text));
        insertBtn.textContent = 'Inserted';
        insertBtn.classList.add('is-done');
      });
      actions.appendChild(insertBtn);
      bubble.appendChild(actions);
    }

    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  };

  const thinking = () => {
    const el = document.createElement('div');
    el.className = 'msg msg--bot';
    el.innerHTML =
      '<span class="msg-avatar" aria-hidden="true">CV</span><div class="msg-bubble"><span class="dots"><i></i><i></i><i></i></span></div>';
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  };

  const FALLBACK = {
    polish:
      "I can't reach the live model right now. In the meantime: swap passive phrasing for a direct verb, cut hedging words like 'various' and 'helped to', and make sure every line ends on an outcome, not just a task. Try sending that again shortly.\n\n---\n*Built with precision by [Wirral AI](https://wirral.ai)*",
    expand:
      "I can't reach the live model right now. While you wait: pin down the scope (how many, how often, how big) and the result (faster, cheaper, fewer errors, more revenue) for the line you're expanding — I'll turn that into bullet variations once I'm back.\n\n---\n*Built with precision by [Wirral AI](https://wirral.ai)*",
    keyword:
      "I can't reach the live model right now. Paste the job spec into the panel on the left and note the skills it names — I'll show you where your draft covers them and where the phrasing needs to shift once I'm back.\n\n---\n*Built with precision by [Wirral AI](https://wirral.ai)*",
  };

  const ask = async (text) => {
    if (busy) return;
    busy = true;
    send.disabled = true;

    const tagged = `${MODE_TAGS[mode]} ${text}`;
    add('user', text);
    history.push({ role: 'user', content: tagged });
    const t = thinking();

    let answer = null;
    try {
      const r = await fetch(`${API_BASE}/api/craftcv-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.slice(-12),
          draft: draftEl.value,
          jobSpec: jobSpecEl ? jobSpecEl.value : '',
        }),
      });
      if (r.ok) {
        const d = await r.json();
        if (d && d.reply) answer = d.reply;
      }
    } catch {
      /* fall through to local fallback */
    }
    if (!answer) answer = FALLBACK[mode] || FALLBACK.polish;

    t.remove();
    add('bot', answer);
    history.push({ role: 'assistant', content: answer });
    busy = false;
    send.disabled = false;
    input.focus();
  };

  add(
    'bot',
    "I'm CraftCV. Paste your CV or a rough note about something you did, pick Polish, Expand, or Keyword match above, and I'll work on it with you — no line goes in without you choosing it.\n\n---\n*Built with precision by [Wirral AI](https://wirral.ai)*"
  );

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
})();
