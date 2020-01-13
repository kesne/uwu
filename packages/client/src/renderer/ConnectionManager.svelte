<script>
    import { createEventDispatcher } from 'svelte';
    import { start as obsStart } from './utils/obs';
    import { start as websocketStart } from './utils/websocket';

    const dispatch = createEventDispatcher();

    let message;

    async function attemptConnection() {
        message = 'Connecting to UwU Cloud...';
        await websocketStart();
        message = 'Connecting to OBS...';
        await obsStart();
    }

    let connection = attemptConnection();
    function retry() {
        connection = attemptConnection();
    }
</script>

<style>
    .loading-container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 80vh;
        flex-direction: column;
    }
</style>

{#await connection}
    <div class="loading-container">
        <p>{message}</p>
        <div uk-spinner="ratio: 3" />
    </div>
{:then value}
    <slot />
{:catch error}
    <p>
        <strong>Error connecting:</strong>
        {error.message}
    </p>
    <button on:click={retry} class="uk-button uk-button-primary">Retry</button>
{/await}
