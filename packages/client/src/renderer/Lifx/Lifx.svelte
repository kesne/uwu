<script>
    import Tetris from '../Tetris/Tetris.svelte';
    let tetris = false;
</script>

<div class="uk-card uk-card-default uk-card-hover uk-margin">
    <div class="uk-card-header">
        <h3 class="uk-card-title">Lifx</h3>
    </div>
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
</div>
