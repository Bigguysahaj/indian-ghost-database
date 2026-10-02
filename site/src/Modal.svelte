<script>
  import SourceRefs from './SourceRefs.svelte';
  import { CLAIM_FIELDS, fieldLabel } from './lib/ghosts.js';

  let { ghost, sources, onclose } = $props();

  const vr = $derived(ghost.extensions?.visual_reference);
  let closeBtn;
  $effect(() => closeBtn?.focus());
</script>

<div class="modal-backdrop" role="presentation" onclick={(e) => e.target === e.currentTarget && onclose()}>
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <button class="modal-close" bind:this={closeBtn} aria-label="Close" onclick={onclose}>&times;</button>
    <div>
      <div class="modal-header">
        {#if vr?.crop}
          <img class="modal-portrait" src={vr.crop} alt="Concept portrait of {ghost.name}">
        {/if}
        <div>
          <h2 class="modal-title" id="modal-title">{ghost.name}</h2>
          {#if ghost.aliases?.length}<p class="modal-aliases">Also: {ghost.aliases.join(', ')}</p>{/if}
          {#if ghost.seed_reference}
            <p class="modal-seed">Book of Indian Ghosts, entry {ghost.seed_reference.entry_number}, chapter starts p.{ghost.seed_reference.chapter_start_page}. Contents entry only — not evidence for the claims below.</p>
          {/if}
          <span class="badge">{ghost.research_status.replace('_', ' ')}</span>
        </div>
      </div>

      <table class="claims-table">
        <tbody>
          {#each CLAIM_FIELDS as field}
            {@const c = ghost.claims[field]}
            <tr>
              <th>{fieldLabel(field)}</th>
              <td>
                {#if c.value}
                  <span class="claim-value">{c.value}</span><SourceRefs ids={c.source_ids} {sources} />
                {:else}
                  <span class="claim-value unknown">Unknown — research needed.</span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>

      {#if ghost.variants?.length}
        <div class="modal-section">
          <h3>Regional variants</h3>
          <ul>
            {#each ghost.variants as v}
              <li><strong>{v.region}:</strong> {v.difference} <SourceRefs ids={v.source_ids} {sources} /></li>
            {/each}
          </ul>
        </div>
      {/if}

      {#if ghost.relationships?.length}
        <div class="modal-section">
          <h3>Related entries</h3>
          <ul>
            {#each ghost.relationships as r}
              <li><strong>{r.relation}</strong> {r.target_id} — {r.note || ''} <SourceRefs ids={r.source_ids} {sources} /></li>
            {/each}
          </ul>
        </div>
      {/if}

      {#if ghost.game_design_notes?.length}
        <div class="modal-section">
          <h3>Game-design interpretation (not evidence)</h3>
          <ul>{#each ghost.game_design_notes as n}<li>{n.text}</li>{/each}</ul>
        </div>
      {/if}

      {#if vr}
        <div class="modal-section">
          <p class="note-flag">Portrait: concept art, status "{vr.status || 'concept_art'}". {vr.historical_accuracy || ''} {vr.review_note || ''}</p>
        </div>
      {/if}
    </div>
  </div>
</div>
