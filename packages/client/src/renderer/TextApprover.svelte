<script>
    import { createEventDispatcher } from 'svelte';
    import speak, { stop } from './utils/speak';

    export let index;
    export let message;

    let approved = false;

    const dispatch = createEventDispatcher();

    async function accept() {
        approved = true;
        await speak(message);
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

<div class="uk-card uk-card-default uk-card-hover uk-margin">
    <div class="uk-card-header">
        <h3 class="uk-card-title">Approve Text To Speech</h3>
    </div>

    <div class="uk-card-body">
        <p>{message}</p>
    </div>

    <div class="uk-card-footer">
        {#if !approved}
            <button on:click={accept} class="uk-button uk-button-primary">Approve</button>
            <button on:click={reject} class="uk-button uk-button-danger">Reject</button>
        {:else}
            <button on:click={skip} class="uk-button uk-button-primary">Skip</button>
        {/if}
    </div>
</div>
