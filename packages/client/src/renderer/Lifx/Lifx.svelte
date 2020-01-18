<script>
    import lifx from '../services/lifx';
    import Tetris from '../Tetris/Tetris.svelte';
    import ServiceModule from '../ServiceModule.svelte';

    let tetris = false;
</script>

<ServiceModule title="Lifx" service={lifx}>
    <div class="uk-card-body">
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
