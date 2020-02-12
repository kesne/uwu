<style>
    .overlay {
        width: 1920px;
        height: 1080px;
        border: 4px solid red;
        background: linear-gradient(217deg, #7A3A94, #DB4CBA);
        overflow: hidden;
        box-sizing: content-box;
        position: relative;
    }
</style>

<div class="overlay">
    <slot />
</div>
