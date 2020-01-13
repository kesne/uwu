<script>
    import { createEventDispatcher, onDestroy } from 'svelte';

    export let id;
    export let redeemer;

    const dispatch = createEventDispatcher();

    const CAT_CAM_DURATION = 30 * 1000;

    let seconds = 0;
    let interval;
    let timeout;

    function init(id) {
        seconds = 0;

        cleanup();

        interval = setInterval(() => {
            seconds += 1;
        }, 1000);

        timeout = setTimeout(() => {
            cleanup();
            dispatch('complete');
        }, CAT_CAM_DURATION);
    }

    function cleanup() {
        clearTimeout(timeout);
        clearInterval(interval);
    }

    $: init(id);

    onDestroy(cleanup);
</script>

<p>
    <strong>Redeemed By:</strong>
    {redeemer}
</p>
<progress class="uk-progress" value={seconds} max={CAT_CAM_DURATION / 1000} />
