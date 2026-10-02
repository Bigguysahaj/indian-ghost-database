export const CLAIM_FIELDS = [
  'classification', 'description', 'habitat', 'location', 'nemesis',
  'protections', 'prey', 'appearance', 'apparent_age', 'lifespan',
  'earliest_attestation', 'cool_fact', 'behavior', 'origin_story',
];
export const TEASER_FIELDS = ['classification', 'description', 'habitat', 'appearance'];

export const STATUS_LABELS = {
  all: 'All', name_only: 'Name only', initial_notes: 'Initial notes', reviewed: 'Reviewed',
};

export function fieldLabel(field) {
  return field.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
}

export function teaserFor(ghost) {
  for (const field of TEASER_FIELDS) {
    const c = ghost.claims[field];
    if (c && c.value) return c.value;
  }
  return null;
}

export function statusDotFor(ghost) {
  const statuses = CLAIM_FIELDS.map((f) => ghost.claims[f]?.status).filter((s) => s && s !== 'unknown');
  if (statuses.includes('disputed')) return 'disputed';
  if (statuses.includes('documented')) return 'documented';
  if (statuses.includes('provisional')) return 'provisional';
  return 'unknown';
}

export function matchesSearch(ghost, query) {
  if (!query) return true;
  const haystack = [
    ghost.name,
    ...(ghost.aliases || []),
    ghost.claims.location?.value,
    ghost.claims.classification?.value,
  ].filter(Boolean).join(' ').toLowerCase();
  return haystack.includes(query);
}

export async function loadData() {
  const data = await fetch('data/ghosts.json').then((r) => r.json());
  const ghosts = data.ghosts.slice().sort(
    (a, b) => (a.seed_reference?.entry_number ?? 999) - (b.seed_reference?.entry_number ?? 999),
  );

  let sources = [];
  try {
    const [refs, evidence] = await Promise.all([
      fetch('data/references.json').then((r) => (r.ok ? r.json() : { references: [] })),
      fetch('data/evidence.json').then((r) => (r.ok ? r.json() : { sources: [] })),
    ]);
    sources = [...(refs.references || []), ...(evidence.sources || [])];
  } catch {
    sources = [];
  }
  return { ghosts, sources };
}
