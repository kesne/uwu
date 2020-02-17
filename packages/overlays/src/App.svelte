<script>
    import Container from './Container.svelte';
    import Starting from './Starting.svelte';
    import Background from './Background.svelte';
    import Chat from './Chat.svelte';
    import { SCENES } from './constants';
    import { scene } from './stores';
</script>

<Container>
    <Background />
    {#if $scene === SCENES.STARTING}
        <Starting />
    {/if}
</Container>
