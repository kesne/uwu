<script>
    import Progress from './Progress.svelte';

    export let store;
    export let duration;
    export let onStart;
    export let onComplete;

    function completeRedemption() {
        $store.shift();
        // Only trigger complete when all redemptions are done:
        if ($store.length === 0) {
            onComplete();
        }
        $store = $store;
    }
</script>

{#if $store.length > 0}
    <Progress
        id={$store[0].id}
        item={$store[0]}
        {duration}
        {onStart}
        onComplete={completeRedemption} />
{:else}
    <slot />
{/if}

{#if $store.length > 1}
    <p>
        <strong>Next Up ({$store.length - 1}):</strong>
        {$store[1].userName}
    </p>
{/if}
