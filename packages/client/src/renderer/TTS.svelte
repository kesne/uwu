<script>
    import TextApprover from './TextApprover.svelte';
    import { messages } from './stores';

    function handleDone(event) {
        $messages.splice(event.detail.index, 1);
        $messages = $messages;
    }
</script>

<!-- TODO: This needs to be moved into the approver module itself, it doesn't belong in the app. -->
{#each $messages as message, i}
    <TextApprover on:done={handleDone} index={i} {message} />
{/each}
