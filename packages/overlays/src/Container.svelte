<style>
    .overlay {
        width: 1920px;
        height: 1080px;
        border: 4px solid red;
        overflow: hidden;
        box-sizing: content-box;
        position: relative;
    }
</style>

<div class="overlay">
    <slot />
</div>
