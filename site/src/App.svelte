<script>
  import { onMount } from 'svelte';
  import Card from './Card.svelte';
  import Modal from './Modal.svelte';
  import { CLAIM_FIELDS, STATUS_LABELS, loadData, matchesSearch } from './lib/ghosts.js';
  import { KONAMI } from './lib/haunts.js';

  let ghosts = $state([]);
  let sourceList = $state([]);
  let query = $state('');
  let activeStatus = $state('all');
  let selected = $state(null);
  let hauntAll = $state(false);

  const sources = $derived(Object.fromEntries(sourceList.map((s) => [s.id, s])));
  const claimCount = $derived(
    ghosts.reduce((sum, g) => sum + CLAIM_FIELDS.filter((f) => g.claims[f]?.value).length, 0),
  );
  const counts = $derived.by(() => {
    const c = { all: ghosts.length };
    for (const g of ghosts) c[g.research_status] = (c[g.research_status] || 0) + 1;
    return c;
  });
  const statusKeys = $derived(Object.keys(STATUS_LABELS).filter((k) => k in counts));
  const filtered = $derived.by(() => {
    const q = query.trim().toLowerCase();
    return ghosts.filter((g) => (activeStatus === 'all' || g.research_status === activeStatus) && matchesSearch(g, q));
  });

  onMount(async () => {
    const data = await loadData();
    ghosts = data.ghosts;
    sourceList = data.sources;
  });

  // ↑ ↑ ↓ ↓ ← → ← → B A haunts every animated card at once.
  let konamiPos = 0;
  function onkeydown(e) {
    if (e.key === 'Escape') selected = null;
    if (e.target.matches('input, textarea')) return;
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    konamiPos = key === KONAMI[konamiPos] ? konamiPos + 1 : (key === KONAMI[0] ? 1 : 0);
    if (konamiPos < KONAMI.length) return;
    konamiPos = 0;
    hauntAll = !hauntAll;
  }
</script>

<svelte:window {onkeydown} />

<header class="page-header">
  <div class="header-inner">
    <h1>Indian Ghost Database</h1>
    <p class="tagline">An open, growing research catalogue of Indian ghosts and folklore — sourced, cited and honest about what isn't known yet.</p>
    <dl class="stats" aria-label="Database statistics">
      <div><dt>{ghosts.length || '—'}</dt><dd>entries</dd></div>
      <div><dt>{sourceList.length || '—'}</dt><dd>web evidence sources</dd></div>
      <div><dt>{claimCount || '—'}</dt><dd>sourced claims</dd></div>
      <div><dt>0</dt><dd>fully reviewed</dd></div>
    </dl>
  </div>
</header>

<main>
  <div class="toolbar">
    <input type="search" bind:value={query} placeholder="Search by name, alias or region…" aria-label="Search ghosts">
    <div class="filter-group" role="group" aria-label="Filter by research status">
      {#each statusKeys as key}
        <button class="filter-chip" type="button" aria-pressed={key === activeStatus} onclick={() => (activeStatus = key)}>
          {STATUS_LABELS[key]} ({counts[key]})
        </button>
      {/each}
    </div>
  </div>

  <p class="disclaimer">Every card is a claim under review, not a finished description. <span class="status-dot status-provisional"></span> provisional means a web source was read but not yet checked against the book or a regional source. Portraits are AI-generated concept art, not folklore evidence — see each entry's notes.</p>

  <div class="grid" aria-live="polite">
    {#each filtered as ghost (ghost.id)}
      <Card {ghost} {hauntAll} onopen={(g) => (selected = g)} />
    {/each}
  </div>
  {#if ghosts.length && !filtered.length}
    <p class="empty">No ghosts match that search.</p>
  {/if}
</main>

{#if selected}
  <Modal ghost={selected} {sources} onclose={() => (selected = null)} />
{/if}

<footer class="page-footer">
  <p>Data licensed <strong>CC BY-SA 4.0</strong>; utility code and schema <strong>MIT</strong>. Source: Riksundar Banerjee, <em>The Book of Indian Ghosts</em> (Aleph Book Company, 2021) — contents photographs and an authorised excerpt only, plus independently cited web sources.</p>
  <p><a href="https://github.com/Bigguysahaj/indian-ghost-database">View the repository</a> · <a href="https://github.com/Bigguysahaj/indian-ghost-database/blob/main/CONTRIBUTING.md">Contribute an entry</a></p>
</footer>
