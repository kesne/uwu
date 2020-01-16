<script>
    import uwu from './services/uwu';
    import obs from './services/obs';
    import twitch from './services/twitch';
    import hue from './services/hue';
    import lifx from './services/lifx';

    // These are the services that we'll be interacting with:
    const services = [uwu, /*obs,*/ twitch, hue, lifx];

    let message = 'Starting...';

    async function attemptConnection() {
        for (const service of services) {
            message = `Connecting to ${service.name}...`;
            await service.start();
        }
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
        min-height: 70vh;
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
