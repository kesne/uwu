<script>
    import { catCam } from './stores';
    import CatCamProgress from './CatCamProgress.svelte';
    import obs, { SOURCES } from './utils/obs';

    function nextRedemption() {
        $catCam.shift();
        $catCam = $catCam;
    }

    let manualId = 0;
    function activate() {
        $catCam = [...$catCam, { id: `system-${++manualId}`, userName: 'Manual activation' }];
    }

    $: {
        if ($catCam.length > 0) {
            setCatCam(true);
        } else {
            setCatCam(false);
        }
    }

    async function setCatCam(visible) {
        await obs.send('SetSceneItemProperties', {
            item: SOURCES.CAT_CAM,
            visible,
        });
    }
</script>

<div class="uk-card uk-card-default uk-card-hover uk-margin">
    <div class="uk-card-header">
        <h3 class="uk-card-title">Cat Cam</h3>
    </div>
    <div class="uk-card-body">
        {#if $catCam.length > 0}
            <CatCamProgress
                id={$catCam[0].id}
                redeemer={$catCam[0].userName}
                on:complete={nextRedemption} />
        {:else}
            <p>No cat cams currently active.</p>
        {/if}

        {#if $catCam.length > 1}
            <p>
                <strong>Next Up:</strong>
                {$catCam[1].userName}
            </p>
        {/if}
    </div>
    <div class="uk-card-footer">
        <button on:click={activate} class="uk-button uk-button-default">Activate</button>
        <button
            on:click={nextRedemption}
            disabled={$catCam.length === 0}
            class="uk-button uk-button-default">
            Skip
        </button>
    </div>
</div>
