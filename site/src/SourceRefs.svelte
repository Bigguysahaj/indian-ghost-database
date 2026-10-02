<script>
  let { ids, sources } = $props();
  const found = $derived((ids ?? []).filter((id) => sources[id]));
</script>

{#if found.length}
  <span class="claim-refs">
    {#each found as id, i}{#if i}{' '}{/if}<a href={sources[id].url} target="_blank" rel="noopener">[{id}]</a>{/each}
  </span>
{/if}
