<script>
    import { catCam } from './stores';
    import ServiceModule from './ServiceModule.svelte';
    import obs, { SOURCES } from './services/obs';
    import { enhance } from './stores';
    import Alert from './components/Alert.svelte';

    setInterval(() => {
        $enhance = Math.max($enhance - 0.2, 1);
    }, 2000);

    $: obs.zoomCamera($enhance);

    function reset() {
        $enhance = 1;
    }
</script>

<ServiceModule service={obs}>
    {#if $enhance > 1}
        <Alert title="Enhance">
            <div class="text-gray-600">{$enhance.toFixed(1)}</div>
        </Alert>
    {/if}
</ServiceModule>
