<script>
    import { onDestroy } from 'svelte';
    import moment from 'moment';

    export let startMoment;

    let now = moment();
    const interval = setInterval(() => (now = moment()), 1000);

    $: minutes = startMoment.diff(now, 'minutes');
    $: seconds = startMoment.diff(now, 'seconds') % 60;

    onDestroy(() => clearInterval(interval));
</script>

<style>
    .timer {
        position: absolute;
        top: 900px;
        text-align: center;
        font-family: 'Noto Sans';
        font-size: 40px;
        font-weight: bold;
    }
</style>

<div class="timer">{minutes}M {String(seconds).padStart(2, '0')}S</div>
