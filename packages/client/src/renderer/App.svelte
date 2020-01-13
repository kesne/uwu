<script>
    import { messages } from './stores';
    import { start } from './utils/obs';
    import Settings from './Settings.svelte';
    import TextApprover from './TextApprover.svelte';
    import CatCam from './CatCam.svelte';

    const connection = start();

    function handleDone(event) {
        // TODO: Have a method to do this:
        $messages.splice(event.detail.index, 1);
        $messages = $messages;
    }
</script>

<style>
    .loading-container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 80vh;
        flex-direction: column;
    }
</style>

<div>
    <nav class="uk-navbar-container" uk-navbar uk-sticky>
        <div class="uk-navbar-left">
            <a class="uk-navbar-item uk-logo" href="/">UwU</a>
        </div>
        <div class="uk-navbar-right">
            <Settings />
        </div>
    </nav>
    <div class="uk-container uk-margin">
        {#await connection}
            <div class="loading-container">
                <p>Connecting to OBS...</p>
                <div uk-spinner="ratio: 3" />
            </div>
        {:then value}
            <CatCam />
            {#each $messages as message, i}
                <TextApprover on:done={handleDone} index={i} {message} />
            {/each}
        {:catch error}
            <p>Error connecting to OBS. Probably put a retry button here.</p>
        {/await}
    </div>
</div>
