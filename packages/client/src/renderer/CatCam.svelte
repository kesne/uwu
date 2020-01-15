<script>
    import { catCam } from './stores';
    import Queue from './Queue/Queue.svelte';
    import obs, { SOURCES } from './services/obs';

    function skip() {
        $catCam.shift();
        $catCam = $catCam;
    }

    let manualId = 0;
    function activate() {
        $catCam = [...$catCam, { id: `system-${++manualId}`, userName: 'Manual activation' }];
    }

    function start() {
        obs.setCatCamVisible(true);
    }

    function complete() {
        obs.setCatCamVisible(false);
    }
</script>

<div class="uk-card uk-card-default uk-card-hover uk-margin">
    <div class="uk-card-header">
        <h3 class="uk-card-title">Cat Cam</h3>
    </div>
    <div class="uk-card-body">
        <Queue duration={30} store={catCam} onStart={start} onComplete={complete}>
            <p>No cat cams currently active.</p>
        </Queue>
    </div>
    <div class="uk-card-footer">
        <button on:click={activate} class="uk-button uk-button-default">Activate</button>
        <button on:click={skip} disabled={$catCam.length === 0} class="uk-button uk-button-default">
            Skip
        </button>
    </div>
</div>
