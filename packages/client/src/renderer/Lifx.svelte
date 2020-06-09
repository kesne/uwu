<script>
    import queue from './utils/queue';
    import Alert from './components/Alert.svelte';
    import color from 'color';
    import lifx, { RAINBOW } from './services/lifx';
    import ServiceModule from './ServiceModule.svelte';
    import { lights } from './stores';

    const { frontRgb, backRgb } = lifx;

    const [lightQueue] = queue(lights, {
        duration: 15 * 1000,
        async onStart(item) {
            if (item.scene) {
                await lifx.setScene(item.scene);
            } else {
                try {
                    if (item.userInput.toLowerCase() === RAINBOW) {
                        await lifx.rainbow();
                    } else {
                        const rgb = color(item.userInput.toLowerCase()).array();
                        await lifx.setLights(rgb);
                    }
                } catch (e) {
                    console.warn('Unknown color, did not set lights to any color');
                    console.warn(e);
                }
            }
        },
        onComplete() {
            lifx.setScene('default');
        },
    });

    function getColorString(rgb) {
        return `rgb(${rgb.join(', ')})`;
    }

    $: username = $lightQueue ? $lightQueue.userName : false;
</script>

<ServiceModule service={lifx}>
    <Alert title="Lifx" subtitle={username}>
        <div class="flex space-x-1 items-center">
            <div
                class="h-6 w-6 rounded-full shadow-md transition-colors duration-300"
                style="background: {getColorString($frontRgb)}" />
            <div
                class="h-6 w-6 rounded-full shadow-md transition-colors duration-300"
                style="background: {getColorString($backRgb)}" />
        </div>
    </Alert>
</ServiceModule>
