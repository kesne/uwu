<script>
    import { catCam } from './stores';
    import Queue from './Queue/Queue.svelte';
    import ServiceModule from './ServiceModule.svelte';
    import obs, { SOURCES } from './services/obs';
    import { enhance } from './stores';

    setInterval(() => {
        $enhance = Math.max($enhance - 0.1, 1);
    }, 2000);

    $: obs.zoomCamera($enhance);

    function reset() {
        $enhance = 1;
    }
</script>

<ServiceModule title="Enhance" service={obs}>
    <div class="uk-card-body">
        Current zoom level:
        <strong>{$enhance}</strong>
    </div>
    <div class="uk-card-footer">
        <button on:click={reset} class="uk-button uk-button-default">Reset</button>
    </div>
</ServiceModule>
