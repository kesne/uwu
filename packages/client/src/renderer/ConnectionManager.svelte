<script>
    import uwu from './services/uwu';
    import obs from './services/obs';
    import twitch from './services/twitch';
    import hue from './services/hue';
    import lifx from './services/lifx';

    // These are the services that we'll be interacting with:
    const services = [uwu, obs, twitch, hue, lifx];

    let message;
    let failedService;
    let skippedServices = [];

    async function attemptConnection() {
        failedService = null;
        for (const service of services) {
            if (skippedServices.includes(service)) {
                console.log(`Skipping initialization of service ${service.name}`);
                continue;
            }

            message = `Connecting to ${service.name}...`;
            try {
                await service.start();
            } catch (e) {
                failedService = service;
                throw e;
            }
        }
    }

    function skipService() {
        skippedServices.push(failedService);
        connection = attemptConnection();
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
    <div>
        <h4 class="uk-title">Service "{failedService.name}" Failed</h4>
        <p>
            <strong>Error connecting:</strong>
            {error.message}
        </p>
    </div>
    <button on:click={retry} class="uk-button uk-button-primary">Retry</button>
    <button on:click={skipService} class="uk-button uk-button-default">
        Skip "{failedService.name}" Service
    </button>
{/await}
