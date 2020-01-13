<script>
    import { createEventDispatcher } from 'svelte';
    import speak from './utils/speak';

    export let index;
    export let message;

    const dispatch = createEventDispatcher();

    async function accept() {
        speak(message);
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
        <button on:click={accept} class="uk-button uk-button-primary">Approve</button>
        <button on:click={reject} class="uk-button uk-button-danger">Reject</button>
    </div>
</div>
