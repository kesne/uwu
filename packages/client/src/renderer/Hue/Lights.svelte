<script>
import hue from '../services/hue';
import { lights } from '../stores';

// const { frontRgb, backRgb } = hue;
const frontRgb = hue.frontRgb;
const backRgb = hue.backRgb;

function getColorString(rgb) {
    return `rgb(${rgb.join(', ')})`;
}

$: {
    const nextColor = $lights.pop();
    if (nextColor) {
        hue.setLights(nextColor);
    }
}

</script>

<style>
.container {
    display: flex;
}

.light-container {
    margin-bottom: 34px;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.light {
    transition: 0.5s ease background;
    background: red;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    width: 80px;
    height: 80px;
    border: 1px dashed black;
}
</style>

<div class="container">
    <div class="light-container"><div class="light" style="background: {getColorString($frontRgb)}" /></div>
    <div class="light-container"><div class="light" style="background: {getColorString($frontRgb)}"/></div>
</div>
<div class="container">
    <div class="light-container"><div class="light" style="background: {getColorString($backRgb)}" /></div>
    <div class="light-container"><div class="light" style="background: {getColorString($backRgb)}" /></div>
</div>
