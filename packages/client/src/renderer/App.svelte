<script>
    import { messages } from './stores';
    import ConnectionManager from './ConnectionManager.svelte';
    import Settings from './Settings.svelte';
    import Hue from './Hue/Hue.svelte';
    import Lifx from './Lifx/Lifx.svelte';
    import TextApprover from './TextApprover.svelte';
    import CatCam from './CatCam.svelte';

    function handleDone(event) {
        // TODO: Have a method to do this:
        $messages.splice(event.detail.index, 1);
        $messages = $messages;
    }
</script>

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
        <ConnectionManager>
            <div class="uk-child-width-1-2@s uk-child-width-1-3@m" uk-grid="masonry: true">
                <div>
                    <CatCam />
                </div>
                <div>
                    <Hue />
                </div>
                <div>
                    <Lifx />
                </div>
            </div>
            <!-- TODO: This needs to be moved into the approver module itself, it doesn't belong in the app. -->
            {#each $messages as message, i}
                <TextApprover on:done={handleDone} index={i} {message} />
            {/each}
        </ConnectionManager>
    </div>
</div>
