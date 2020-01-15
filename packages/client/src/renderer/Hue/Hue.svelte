<script>
    import Lights from './Lights.svelte';
    // import { lights } from './stores';

    // function nextRedemption() {
    //     $catCam.shift();
    //     $catCam = $catCam;
    // }

    // let manualId = 0;
    // function activate() {
    //     $catCam = [...$catCam, { id: `system-${++manualId}`, userName: 'Manual activation' }];
    // }

    // $: {
    //     if ($catCam.length > 0) {
    //         obs.setCatCamVisible(true);
    //     } else {
    //         obs.setCatCamVisible(false);
    //     }
    // }
</script>

<div class="uk-card uk-card-default uk-card-hover uk-margin">
    <div class="uk-card-header">
        <h3 class="uk-card-title">Philips Hue</h3>
    </div>
    <div class="uk-card-body">
        <Lights />
    </div>
    <div class="uk-card-footer">
        <button class="uk-button uk-button-default">Something</button>
    </div>
</div>
