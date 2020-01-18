<script>
    import color from 'color';
    import Lights from './Lights.svelte';
    import Queue from '../Queue/Queue.svelte';
    import ServiceModule from '../ServiceModule.svelte';
    import { lights } from '../stores';
    import hue from '../services/hue';

    async function start(item) {
        if (item.scene) {
            await hue.setScene(item.scene);
        } else {
            try {
                const rgb = color(item.userInput).array();
                await hue.setLights(rgb);
            } catch (e) {
                console.warn('Unknown color, did not set lights to any color');
                console.warn(e);
            }
        }
    }

    function complete() {
        hue.setScene('default');
    }
</script>

<ServiceModule title="Philips Hue" service={hue}>
    <div class="uk-card-body">
        <Lights />
        <Queue duration={15} store={lights} onStart={start} onComplete={complete} />
    </div>
    <!-- <div class="uk-card-footer">
        <button class="uk-button uk-button-default">Do Something</button>
    </div> -->
</ServiceModule>
