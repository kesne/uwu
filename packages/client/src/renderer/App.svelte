<script>
    import { messages } from './stores';
    import TextApprover from './TextApprover.svelte';

    function handleDone(event) {
        // TODO: Have a method to do this:
        $messages.splice(event.detail.index, 1);
        $messages = $messages;
    }
</script>

<div class="container">
    <h1 class="title">UwU Stream Manager</h1>
    {#each $messages as message, i}
        <TextApprover on:done={handleDone} index={i} {message} />
    {/each}
</div>
