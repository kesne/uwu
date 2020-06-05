<script>
    import ConnectionManager from './ConnectionManager.svelte';
    import Settings from './Settings.svelte';
    import Lifx from './Lifx/Lifx.svelte';
    import TTS from './TTS.svelte';
    import CatCam from './CatCam.svelte';
    import Enhance from './Enhance.svelte';
</script>

<div>
    <nav class="sticky top-0 bg-gray-900">
        <a class="text-white" href="/">UwU</a>
        <Settings />
    </nav>
    <div class="uk-container uk-margin">
        <ConnectionManager>
            <div class="uk-child-width-1-2@s uk-child-width-1-3@m" uk-grid="masonry: true">
                <TTS />
                <Enhance />
                <div>
                    <CatCam />
                </div>
                <div>
                    <Lifx />
                </div>
            </div>
        </ConnectionManager>
    </div>
</div>
