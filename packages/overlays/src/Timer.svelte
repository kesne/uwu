<script>
    import moment from 'moment';
    import { time } from './stores';

    export let startMoment;

    $: minutes = startMoment.diff($time, 'minutes');
    $: seconds = startMoment.diff($time, 'seconds') % 60;
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

<!-- TODO: Negative should do WHAT? -->
<div class="timer">{minutes}M {String(seconds).padStart(2, '0')}S</div>
