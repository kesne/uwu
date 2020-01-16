<script>
    import color from 'color';
    import Lights from './Lights.svelte';
    import Queue from '../Queue/Queue.svelte';
    import { lights } from '../stores';
    import hue from '../services/hue';

    function start(item) {
        if (item.scene) {
            hue.setScene(item.scene);
        } else {
            const rgb = color(item.userInput).array();
            hue.setLights(rgb);
        }
    }

    function complete() {
        hue.setScene('default');
    }
</script>

<div class="uk-card uk-card-default uk-card-hover uk-margin">
    <div class="uk-card-header">
        <h3 class="uk-card-title">Philips Hue</h3>
    </div>
    <div class="uk-card-body">
        <Lights />
        <Queue duration={15} store={lights} onStart={start} onComplete={complete} />
    </div>
    <!-- <div class="uk-card-footer">
        <button class="uk-button uk-button-default">Do Something</button>
    </div> -->
</div>
