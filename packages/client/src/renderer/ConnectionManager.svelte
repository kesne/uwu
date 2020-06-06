<script>
    import uwu from './services/uwu';
    import obs from './services/obs';
    import twitch from './services/twitch';
    import lifx from './services/lifx';
    import Button from './components/Button.svelte';
    import Card from './components/Card.svelte';

    // These are the services that we'll be interacting with:
    const services = [uwu, obs, twitch, lifx];

    let failedService;
    let skippedServices = new Set();

    $: nonSkippedServices = services.filter((service) => !skippedServices.has(service));

    async function attemptConnection() {
        failedService = null;
        await Promise.all(
            services.map(async (service) => {
                if (skippedServices.has(service)) {
                    console.log(`Skipping initialization of service ${service.name}`);
                    return;
                }

                try {
                    await service.start();
                } catch (e) {
                    failedService = service;
                    throw e;
                }
            }),
        );
    }

    function skipService() {
        skippedServices.add(failedService);
        skippedServices = skippedServices;
        connection = attemptConnection();
    }

    let connection = attemptConnection();
    function retry() {
        connection = attemptConnection();
    }
</script>

{#await connection}
    <Card title="Starting...">
        <p class="text-center">
            {#each nonSkippedServices as service}
                {#if !service.connection}
                    <div>Connecting to {service.name}...</div>
                {/if}
            {/each}
        </p>
    </Card>
{:then value}
    <slot />
{:catch error}
    <Card title={`Service "${failedService.name}" Failed`}>
        <p class="mb-4">
            <strong>Error connecting:</strong>
            {error.message}
        </p>
        <Button on:click={retry}>Retry</Button>
        <Button on:click={skipService}>Skip "{failedService.name}" Service</Button>
    </Card>
{/await}
