<script>
    import api from './api';
    import TextApprover from './TextApprover.svelte';

    let messages = [];

    api.ttsRequests().subscribe(message => {
        messages = [...messages, message];
    });

    function handleDone(event) {
        messages.splice(event.detail.index, 1);
        messages = messages;
    }
</script>

<div class="container">
    {#each messages as message, i}
        <TextApprover on:done={handleDone} index={i} {message} />
    {/each}
</div>
