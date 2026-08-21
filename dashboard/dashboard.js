(() => {
  'use strict';

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const esc = (str) =>
    String(str == null ? '' : str).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));

  const TOKEN_KEY = 'wirralai_dashboard_token';
  const gate = $('#dashGate');
  const app = $('#dashApp');
  let enquiries = [];
  let filterService = 'all';
  let filterStatus = 'all';
  let search = '';

  function fmtDate(iso) {
    try {
      return new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
    } catch { return iso; }
  }

  async function fetchEnquiries(token) {
    const res = await fetch('/api/enquiries', { headers: { 'x-dashboard-token': token } });
    if (res.status === 401) throw new Error('unauthorized');
    if (!res.ok) throw new Error('fetch_failed');
    const data = await res.json();
    return data.enquiries || [];
  }

  async function patchStatus(id, status) {
    const token = localStorage.getItem(TOKEN_KEY);
    await fetch('/api/enquiries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-dashboard-token': token },
      body: JSON.stringify({ id, status }),
    });
  }

  function contactLine(e) {
    const a = e.answers || {};
    const bits = [a.contactName, a.contactCompany, a.contactEmail, a.contactPhone].filter(Boolean);
    return bits.join(' · ') || 'No contact details given';
  }

  function renderList() {
    const services = Array.from(new Set(enquiries.map((e) => e.service))).sort();
    let filtered = enquiries.filter((e) => {
      if (filterService !== 'all' && e.service !== filterService) return false;
      if (filterStatus !== 'all' && (e.status || 'new') !== filterStatus) return false;
      if (search) {
        const hay = (JSON.stringify(e.answers || {}) + ' ' + (e.serviceLabel || '')).toLowerCase();
        if (!hay.includes(search.toLowerCase())) return false;
      }
      return true;
    });

    app.innerHTML = `
      <div class="dash-toolbar">
        <select id="fService">
          <option value="all">All services</option>
          ${services.map((s) => `<option value="${esc(s)}" ${filterService === s ? 'selected' : ''}>${esc(s)}</option>`).join('')}
        </select>
        <select id="fStatus">
          ${['all', 'new', 'contacted', 'archived'].map((s) => `<option value="${s}" ${filterStatus === s ? 'selected' : ''}>${s === 'all' ? 'All statuses' : s}</option>`).join('')}
        </select>
        <input id="fSearch" placeholder="Search…" value="${esc(search)}" />
        <button type="button" class="btn btn--ghost btn--sm" id="fRefresh">Refresh</button>
        <span class="dash-count">${filtered.length} of ${enquiries.length}</span>
      </div>
      <div class="dash-list">
        ${filtered.length ? filtered.map(cardHtml).join('') : '<p class="dash-empty">No enquiries match these filters.</p>'}
      </div>
    `;

    $('#fService', app).addEventListener('change', (e) => { filterService = e.target.value; renderList(); });
    $('#fStatus', app).addEventListener('change', (e) => { filterStatus = e.target.value; renderList(); });
    $('#fSearch', app).addEventListener('input', (e) => { search = e.target.value; renderList(); });
    $('#fRefresh', app).addEventListener('click', load);

    $$('.dash-card-head', app).forEach((head) => {
      head.addEventListener('click', () => head.closest('.dash-card').classList.toggle('is-open'));
    });
    $$('[data-mark]', app).forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await patchStatus(btn.dataset.id, btn.dataset.mark);
        await load();
      });
    });
  }

  function cardHtml(e) {
    const status = e.status || 'new';
    const rows = Array.isArray(e.summary)
      ? e.summary.flatMap((section) => section.rows.map((r) => ({ q: `${section.section} — ${r.q}`, a: r.a })))
      : Object.entries(e.answers || {}).map(([q, a]) => ({ q, a: Array.isArray(a) ? a.join(', ') : a }));

    return `
      <div class="dash-card" data-id="${esc(e.id)}">
        <div class="dash-card-head">
          <div>
            <div class="dash-card-title">${esc(e.serviceLabel || e.service)} — ${esc(contactLine(e))}</div>
            <div class="dash-card-meta">${esc(fmtDate(e.submittedAt))}</div>
          </div>
          <span class="dash-badge ${status}">${esc(status)}</span>
        </div>
        <div class="dash-card-body">
          <dl>
            ${rows.map((r) => `<div class="dash-row"><dt>${esc(r.q)}</dt><dd>${esc(r.a)}</dd></div>`).join('')}
          </dl>
          <div class="dash-actions">
            <button type="button" class="btn btn--ghost btn--sm" data-mark="contacted" data-id="${esc(e.id)}">Mark contacted</button>
            <button type="button" class="btn btn--ghost btn--sm" data-mark="archived" data-id="${esc(e.id)}">Archive</button>
            <button type="button" class="btn btn--ghost btn--sm" data-mark="new" data-id="${esc(e.id)}">Mark new</button>
          </div>
        </div>
      </div>
    `;
  }

  async function load() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    app.innerHTML = '<p class="dash-loading">Loading enquiries…</p>';
    try {
      enquiries = await fetchEnquiries(token);
      renderList();
    } catch (e) {
      if (e.message === 'unauthorized') {
        localStorage.removeItem(TOKEN_KEY);
        showGate('That token was rejected. Please try again.');
      } else {
        app.innerHTML = '<p class="dash-empty">Could not load enquiries. Check the API is deployed and try refreshing.</p>';
      }
    }
  }

  function showGate(errorMsg) {
    gate.hidden = false;
    app.hidden = true;
    $('#dashGateError').textContent = errorMsg || '';
  }

  function showApp() {
    gate.hidden = true;
    app.hidden = false;
  }

  $('#dashUnlock').addEventListener('click', async () => {
    const token = $('#dashToken').value.trim();
    if (!token) return;
    try {
      await fetchEnquiries(token);
      localStorage.setItem(TOKEN_KEY, token);
      showApp();
      load();
    } catch (e) {
      $('#dashGateError').textContent = 'That token was rejected.';
    }
  });

  const saved = localStorage.getItem(TOKEN_KEY);
  if (saved) {
    showApp();
    load();
  } else {
    showGate();
  }
})();
