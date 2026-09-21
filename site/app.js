const CLAIM_FIELDS = [
  'classification', 'description', 'habitat', 'location', 'nemesis',
  'protections', 'prey', 'appearance', 'apparent_age', 'lifespan',
  'earliest_attestation', 'cool_fact', 'behavior', 'origin_story',
];
const TEASER_FIELDS = ['classification', 'description', 'habitat', 'appearance'];

let GHOSTS = [];
let SOURCES = {};
let activeStatus = 'all';

function fieldLabel(field) {
  return field.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

function sourceRefs(ids) {
  if (!ids || !ids.length) return '';
  const links = ids
    .map((id) => {
      const s = SOURCES[id];
      if (!s) return null;
      return `<a href="${escapeHtml(s.url)}" target="_blank" rel="noopener">[${escapeHtml(id)}]</a>`;
    })
    .filter(Boolean);
  return links.length ? `<span class="claim-refs">${links.join(' ')}</span>` : '';
}

function teaserFor(ghost) {
  for (const field of TEASER_FIELDS) {
    const c = ghost.claims[field];
    if (c && c.value) return c.value;
  }
  return 'No sourced description yet — a name-only or early-stage record.';
}

function buildStatusFilters() {
  const counts = { all: GHOSTS.length };
  for (const g of GHOSTS) {
    counts[g.research_status] = (counts[g.research_status] || 0) + 1;
  }
  const labels = { all: 'All', name_only: 'Name only', initial_notes: 'Initial notes', reviewed: 'Reviewed' };
  const el = document.getElementById('status-filters');
  el.innerHTML = '';
  for (const key of ['all', 'name_only', 'initial_notes', 'reviewed']) {
    if (!(key in counts)) continue;
    const btn = document.createElement('button');
    btn.className = 'filter-chip';
    btn.type = 'button';
    btn.dataset.status = key;
    btn.setAttribute('aria-pressed', String(key === activeStatus));
    btn.textContent = `${labels[key]} (${counts[key]})`;
    btn.addEventListener('click', () => {
      activeStatus = key;
      document.querySelectorAll('.filter-chip').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.status === key)));
      render();
    });
    el.appendChild(btn);
  }
}

function matchesSearch(ghost, query) {
  if (!query) return true;
  const haystack = [
    ghost.name,
    ...(ghost.aliases || []),
    ghost.claims.location?.value,
    ghost.claims.classification?.value,
  ].filter(Boolean).join(' ').toLowerCase();
  return haystack.includes(query);
}

function render() {
  const query = document.getElementById('search').value.trim().toLowerCase();
  const grid = document.getElementById('grid');
  const empty = document.getElementById('empty');
  grid.innerHTML = '';

  const filtered = GHOSTS.filter((g) => {
    const statusOk = activeStatus === 'all' || g.research_status === activeStatus;
    return statusOk && matchesSearch(g, query);
  });

  empty.hidden = filtered.length > 0;

  const frag = document.createDocumentFragment();
  for (const ghost of filtered) {
    const card = document.createElement('button');
    card.className = 'card';
    card.type = 'button';
    card.setAttribute('aria-haspopup', 'dialog');

    const vr = ghost.extensions?.visual_reference;
    const teaser = teaserFor(ghost);
    const teaserIsUnknown = !CLAIM_FIELDS.some((f) => f && TEASER_FIELDS.includes(f) && ghost.claims[f]?.value);

    card.innerHTML = `
      <div class="card-media">
        ${vr?.crop ? `<img src="${escapeHtml(vr.crop)}" alt="Concept portrait of ${escapeHtml(ghost.name)}" loading="lazy">` : ''}
      </div>
      <div class="card-body">
        <p class="card-name">${escapeHtml(ghost.name)} ${ghost.seed_reference ? `<span class="card-number">#${ghost.seed_reference.entry_number}</span>` : ''}</p>
        <p class="card-teaser ${teaserIsUnknown ? 'unknown' : ''}">${escapeHtml(teaser)}</p>
        <span class="badge"><span class="status-dot status-${statusDotFor(ghost)}"></span>${escapeHtml(ghost.research_status.replace('_', ' '))}</span>
      </div>
    `;
    card.addEventListener('click', () => openModal(ghost));
    frag.appendChild(card);
  }
  grid.appendChild(frag);
}

function statusDotFor(ghost) {
  const statuses = CLAIM_FIELDS.map((f) => ghost.claims[f]?.status).filter((s) => s && s !== 'unknown');
  if (statuses.includes('disputed')) return 'disputed';
  if (statuses.includes('documented')) return 'documented';
  if (statuses.includes('provisional')) return 'provisional';
  return 'unknown';
}

function openModal(ghost) {
  const backdrop = document.getElementById('modal-backdrop');
  const body = document.getElementById('modal-body');
  const vr = ghost.extensions?.visual_reference;

  const rows = CLAIM_FIELDS.map((field) => {
    const c = ghost.claims[field];
    const value = c.value
      ? `<span class="claim-value">${escapeHtml(c.value)}</span>${sourceRefs(c.source_ids)}`
      : `<span class="claim-value unknown">Unknown — research needed.</span>`;
    return `<tr><th>${escapeHtml(fieldLabel(field))}</th><td>${value}</td></tr>`;
  }).join('');

  const variants = (ghost.variants || []).map((v) =>
    `<li><strong>${escapeHtml(v.region)}:</strong> ${escapeHtml(v.difference)} ${sourceRefs(v.source_ids)}</li>`
  ).join('');

  const relationships = (ghost.relationships || []).map((r) =>
    `<li><strong>${escapeHtml(r.relation)}</strong> ${escapeHtml(r.target_id)} — ${escapeHtml(r.note || '')} ${sourceRefs(r.source_ids)}</li>`
  ).join('');

  const gdn = (ghost.game_design_notes || []).map((n) =>
    `<li>${escapeHtml(n.text)}</li>`
  ).join('');

  body.innerHTML = `
    <div class="modal-header">
      ${vr?.crop ? `<img class="modal-portrait" src="${escapeHtml(vr.crop)}" alt="Concept portrait of ${escapeHtml(ghost.name)}">` : ''}
      <div>
        <h2 class="modal-title" id="modal-title">${escapeHtml(ghost.name)}</h2>
        ${ghost.aliases?.length ? `<p class="modal-aliases">Also: ${escapeHtml(ghost.aliases.join(', '))}</p>` : ''}
        ${ghost.seed_reference ? `<p class="modal-seed">Book of Indian Ghosts, entry ${ghost.seed_reference.entry_number}, chapter starts p.${ghost.seed_reference.chapter_start_page}. Contents entry only — not evidence for the claims below.</p>` : ''}
        <span class="badge">${escapeHtml(ghost.research_status.replace('_', ' '))}</span>
      </div>
    </div>
    <table class="claims-table"><tbody>${rows}</tbody></table>
    ${variants ? `<div class="modal-section"><h3>Regional variants</h3><ul>${variants}</ul></div>` : ''}
    ${relationships ? `<div class="modal-section"><h3>Related entries</h3><ul>${relationships}</ul></div>` : ''}
    ${gdn ? `<div class="modal-section"><h3>Game-design interpretation (not evidence)</h3><ul>${gdn}</ul></div>` : ''}
    ${vr ? `<div class="modal-section"><p class="note-flag">Portrait: concept art, status "${escapeHtml(vr.status || 'concept_art')}". ${escapeHtml(vr.historical_accuracy || '')} ${vr.review_note ? escapeHtml(vr.review_note) : ''}</p></div>` : ''}
  `;

  backdrop.hidden = false;
  document.getElementById('modal-close').focus();
}

function closeModal() {
  document.getElementById('modal-backdrop').hidden = true;
}

async function init() {
  const res = await fetch('data/ghosts.json');
  const data = await res.json();
  GHOSTS = data.ghosts.slice().sort((a, b) => (a.seed_reference?.entry_number ?? 999) - (b.seed_reference?.entry_number ?? 999));

  let sourcesFlat = [];
  try {
    const [refsRes, evidenceRes] = await Promise.all([
      fetch('data/references.json').then((r) => (r.ok ? r.json() : { references: [] })),
      fetch('data/evidence.json').then((r) => (r.ok ? r.json() : { sources: [] })),
    ]);
    sourcesFlat = [...(refsRes.references || []), ...(evidenceRes.sources || [])];
  } catch (e) {
    sourcesFlat = [];
  }
  SOURCES = Object.fromEntries(sourcesFlat.map((s) => [s.id, s]));

  document.getElementById('stat-total').textContent = GHOSTS.length;
  document.getElementById('stat-sources').textContent = sourcesFlat.length || '—';
  const claimCount = GHOSTS.reduce((sum, g) => sum + CLAIM_FIELDS.filter((f) => g.claims[f]?.value).length, 0);
  document.getElementById('stat-claims').textContent = claimCount;

  buildStatusFilters();
  render();

  document.getElementById('search').addEventListener('input', render);
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-backdrop').addEventListener('click', (e) => {
    if (e.target.id === 'modal-backdrop') closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

init();
