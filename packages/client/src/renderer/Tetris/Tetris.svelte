<script>
    import { onMount } from 'svelte';
    import Tetris from 'tetris-core/dist/index.cjs.js';
    import config from './config';
    import twitch from '../services/twitch';
    import canvasSync, { TILE_PIXELS } from '../utils/canvasSync';

    export let onDone = () => {};

    let canvas;
    let tetris = new Tetris(config);

    function handleDone() {
        twitch.send(`Game over! Final score: ${tetris.getState().score}`);
        onDone();
    }

    // Sometimes the tetris app can get stuck, so force it to end after a period of time:
    let timeout;
    const FORCE_DONE = 5000;
    function forceDone() {
        clearTimeout(timeout);
        timeout = setTimeout(handleDone, FORCE_DONE);
    }

    function handleTwitch(channel, tags, message) {
        const command = message.trim().split(' ')[0];
        switch (command) {
            case '!left':
                tetris.moveLeft();
                break;
            case '!right':
                tetris.moveRight();
                break;
            case '!down':
                tetris.moveDown();
                break;
            case '!rotate':
                tetris.rotate();
                break;
        }
    }

    onMount(() => {
        const ctx = canvas.getContext('2d');

        twitch.send(
            'Tetris is played on the LIFX Tiles. You can play with the following commands: !left, !right, !down, !rotate',
        );

        forceDone();

        tetris.on('end', handleDone);
        tetris.on('render', data => {
            forceDone();

            if (!data.display) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            data.display.forEach((row, colIndex) => {
                row.forEach((color, rowIndex) => {
                    if (color === 0) return;
                    ctx.fillStyle = color;
                    ctx.fillRect(rowIndex * 4, colIndex * 4, 4, 4);
                });
            });

            // Sync canvas state to lifx tiles:
            canvasSync(ctx);
        });

        twitch.connection.on('message', handleTwitch);
        tetris.start();

        return () => twitch.connection.removeListener('message', handleTwitch);
    });
</script>

<style>
    .container {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .canvas {
        width: 100px;
        height: 250px;
        border: 1px solid rbga(0, 0, 0, 0.8);
        border-radius: 2px;
        image-rendering: -moz-crisp-edges;
        image-rendering: -webkit-crisp-edges;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
    }
    .overlay {
        position: absolute;
        top: 0;
        width: 100px;
        height: 250px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(5, 1fr);
        grid-gap: 0px;
        opacity: 0.1;
    }

    .tile {
        border: 1px solid black;
    }
</style>

<div class="container">
    <canvas class="canvas" bind:this={canvas} width={2 * TILE_PIXELS} height={5 * TILE_PIXELS} />

    <div class="overlay">
        {#each Array(10) as _, i}
            <div class="tile" />
        {/each}
    </div>
</div>
