<script>
    import ConnectionManager from './ConnectionManager.svelte';
    import Settings from './Settings.svelte';
    import Lifx from './Lifx/Lifx.svelte';
    import TTS from './TTS.svelte';
    import CatCam from './CatCam.svelte';
    import Enhance from './Enhance.svelte';
</script>

<div class="bg-gray-100 min-h-screen font-sans antialiased">
    <nav class="sticky top-0 bg-gray-800 text-center p-4 shadow-md">
        <a class="text-white text-lg font-medium" href="/">UwU</a>
        <!-- <Settings /> -->
    </nav>
    <div>
        <ConnectionManager>
            <TTS />
            <Enhance />
            <div>
                <CatCam />
            </div>
            <div>
                <Lifx />
            </div>
        </ConnectionManager>
    </div>
</div>
