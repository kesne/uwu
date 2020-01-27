<script>
    import color from 'color';
    import lifx from '../services/lifx';
    import Lights from './Lights.svelte';
    import Queue from '../Queue/Queue.svelte';
    import Tetris from '../Tetris/Tetris.svelte';
    import ServiceModule from '../ServiceModule.svelte';
    import { lights } from '../stores';

    let tetris = false;

    async function start(item) {
        if (item.scene) {
            await lifx.setScene(item.scene);
        } else {
            try {
                const rgb = color(item.userInput.toLowerCase()).array();
                await lifx.setLights(rgb);
            } catch (e) {
                console.warn('Unknown color, did not set lights to any color');
                console.warn(e);
            }
        }
    }

    function complete() {
        lifx.setScene('default');
    }
</script>

<ServiceModule title="Lifx" service={lifx}>
    <div class="uk-card-body">
        <Lights />
        <Queue duration={15} store={lights} onStart={start} onComplete={complete} />
    </div>
    <div class="uk-card-body">
        TILES
        <strong>Scene:</strong>
        Morph
        <div>
            {#if tetris}
                <Tetris onDone={() => (tetris = false)} />
            {/if}
        </div>
    </div>
    <div class="uk-card-footer">
        <button class="uk-button uk-button-default" on:click={() => (tetris = true)}>Tetris</button>
    </div>
</ServiceModule>
