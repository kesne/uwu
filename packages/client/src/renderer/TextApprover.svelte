<script>
    import { createEventDispatcher } from 'svelte';
    import speak, { stop } from './utils/speak';
    import Alert from './components/Alert.svelte';
    import Button from './components/Button.svelte';

    export let index;
    export let message;

    let approved = false;

    const dispatch = createEventDispatcher();

    async function approve() {
        approved = true;
        await speak(message.userInput);
        dispatch('done', { index });
    }

    function skip() {
        stop();
        dispatch('done', { index });
    }

    function reject() {
        dispatch('done', { index });
    }
</script>

<Alert title="Text To Speech" subtitle={message.userName}>
    <span slot="panel">
        <div class="my-2">“{message.userInput}”</div>
        <div class="space-x-2 flex justify-end">
            {#if !approved}
                <Button on:click={reject}>Reject</Button>
                <Button on:click={approve}>Approve</Button>
            {:else}
                <Button on:click={skip}>Skip</Button>
            {/if}
        </div>
    </span>
</Alert>
