<script>
    import moment from 'moment';
    import Timer from './Timer.svelte';
    import Chat from './Chat.svelte';
    import Background from './Background.svelte';
    import { textColor, Colors } from './stores';
</script>

<style>
    h1 {
        font-family: 'Noto Sans';
        font-size: 150px;
        font-weight: 800;
        line-height: 1.1;
    }

    h2 {
        font-family: 'Noto Sans';
        font-size: 80px;
        font-weight: bold;
        line-height: 1.1;
    }

    h3 {
        font-family: 'Noto Sans';
        font-size: 40px;
        font-weight: bold;
        line-height: 1.1;
        margin-bottom: 40px;
    }

    .white {
        color: white;
    }

    .black {
        color: black;
    }

    .outer {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        flex-direction: column;
        transition: color 4s ease-in-out;
    }

    .container {
        max-width: 85%;
        display: flex;
    }

    .section {
        flex: 1;
        padding: 20px 60px;
    }

    .left {
        border-right: 1px solid black;
    }
</style>

<Background />

<div
    class="outer"
    class:white={$textColor === Colors.WHITE}
    class:black={$textColor === Colors.BLACK}>
    <div class="container">
        <div class="section left">
            <h1>Stream starting soon</h1>
        </div>
        <div class="section">
            <h3>TONIGHT</h3>
            <h2>JavaScript Code Review | Building stream overlays in Svelte</h2>
        </div>
    </div>

    <Timer startMoment={moment().add({ minutes: 5 })} />
</div>
