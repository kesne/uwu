<script>
    import TextApprover from './TextApprover.svelte';
    import { messages } from './stores';

    function handleDone(event) {
        $messages.splice(event.detail.index, 1);
        $messages = $messages;
    }
</script>

{#each $messages as message, i (message)}
    <TextApprover on:done={handleDone} index={i} {message} />
{/each}
