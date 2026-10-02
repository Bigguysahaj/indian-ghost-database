<script>
  import { HAUNTS } from './lib/haunts.js';
  import { hasMotion, motion } from './lib/motion.js';
  import { statusDotFor, teaserFor } from './lib/ghosts.js';

  let { ghost, hauntAll, onopen } = $props();

  const crop = $derived(ghost.extensions?.visual_reference?.crop);
  const haunt = $derived(crop ? HAUNTS[ghost.id] : null);
  const moving = $derived(Boolean(crop) && hasMotion(ghost.id));
  const teaser = $derived(teaserFor(ghost));
  let hovering = $state(false);
</script>

<button
  class="card {haunt ? `haunt haunt--${ghost.id}` : ''}"
  class:is-haunting={haunt && (hovering || hauntAll)}
  type="button"
  aria-haspopup="dialog"
  use:motion={moving ? ghost.id : null}
  onclick={() => onopen(ghost)}
  onmouseenter={() => (hovering = true)}
  onmouseleave={() => (hovering = false)}
  onfocus={() => (hovering = true)}
  onblur={() => (hovering = false)}
>
  <div class="card-media" data-motion={moving ? ghost.id : undefined}>
    {#if moving}
      <div class="m-stage">
        <div class="m-idle">
          <img src={crop} alt="Concept portrait of {ghost.name}" loading="lazy">
          <div class="m-fx"></div>
        </div>
      </div>
      <div class="m-glare"></div>
    {:else if crop}
      <img src={crop} alt="Concept portrait of {ghost.name}" loading="lazy">
    {/if}
    {#if haunt}
      <span class="haunt-fx" aria-hidden="true">{@html haunt.fx}</span>
      <span class="haunt-say" aria-hidden="true" style="--chars:{haunt.line.length}"><span class="haunt-text">{haunt.line}</span></span>
    {/if}
  </div>
  <div class="card-body">
    <p class="card-name">{ghost.name} {#if ghost.seed_reference}<span class="card-number">#{ghost.seed_reference.entry_number}</span>{/if}</p>
    <p class="card-teaser" class:unknown={!teaser}>{teaser ?? 'No sourced description yet — a name-only or early-stage record.'}</p>
    <span class="badge"><span class="status-dot status-{statusDotFor(ghost)}"></span>{ghost.research_status.replace('_', ' ')}</span>
  </div>
</button>
