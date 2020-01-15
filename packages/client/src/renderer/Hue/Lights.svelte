<script>
    import hue from '../services/hue';

    const { frontRgb, backRgb } = hue;

    function getColorString(rgb) {
        return `rgb(${rgb.join(', ')})`;
    }
</script>

<style>
    .container {
        display: flex;
    }

    .light-container {
        padding: 16px;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .light {
        transition: 0.5s ease background;
        background: red;
        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);
        border-radius: 50%;
        width: 60px;
        height: 60px;
        border: 1px dashed black;
    }
</style>

<div class="container">
    <div class="light-container">
        <div class="light" style="background: {getColorString($frontRgb)}" />
    </div>
    <div class="light-container">
        <div class="light" style="background: {getColorString($frontRgb)}" />
    </div>
</div>
<div class="container">
    <div class="light-container">
        <div class="light" style="background: {getColorString($backRgb)}" />
    </div>
    <div class="light-container">
        <div class="light" style="background: {getColorString($backRgb)}" />
    </div>
</div>
