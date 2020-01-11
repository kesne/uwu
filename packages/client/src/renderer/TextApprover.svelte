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

<div class="box">
    <article class="media">
        <div class="media-content">
            <div class="content">
                <p>
                    <strong>Approve Text To Speech</strong>
                    <br />
                    {message}
                </p>
            </div>
            <button on:click={accept} class="button is-success">Approve</button>
            <button on:click={reject} class="button is-danger">Reject</button>
        </div>
    </article>
</div>
