<script>
    import queue from './utils/queue';
    import { catCam } from './stores';
    import ServiceModule from './ServiceModule.svelte';
    import obs, { SOURCES } from './services/obs';
    import Alert from './components/Alert.svelte';
    import Button from './components/Button.svelte';

    const [catCamQueue, remainingQueue, skip] = queue(catCam, {
        duration: 30 * 1000,
        onStart() {
            obs.setCatCamVisible(true);
        },
        onComplete() {
            obs.setCatCamVisible(false);
        },
    });

    $: username = $catCamQueue ? $catCamQueue.userName : false;
</script>

<ServiceModule service={obs}>
    {#if $catCamQueue}
        <Alert title="Cat Cam" subtitle={username}>
            <Button on:click={() => skip()}>
                Skip
                {#if $remainingQueue > 0}({$remainingQueue}){/if}
            </Button>
        </Alert>
    {/if}
</ServiceModule>
