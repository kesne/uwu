<script>
    import { onDestroy, onMount } from 'svelte';

    export let id;
    export let item;
    export let duration;
    export let onStart;
    export let onComplete;

    let seconds = 0;
    let interval;
    let timeout;

    function init(id) {
        seconds = 0;

        cleanup();

        onStart(item);

        interval = setInterval(() => {
            seconds += 1;
        }, 1000);

        timeout = setTimeout(() => {
            cleanup();
            onComplete(item);
        }, duration * 1000);
    }

    function cleanup() {
        clearTimeout(timeout);
        clearInterval(interval);
    }

    // NOTE: We need the id broken out here so that this only runs when the ID changes.
    $: init(id);

    onDestroy(cleanup);
</script>

<p>
    <strong>Redeemed By:</strong>
    {item.userName}
</p>
<progress class="uk-progress" value={seconds} max={duration} />
