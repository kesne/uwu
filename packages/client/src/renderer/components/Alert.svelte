<script>
    export let title;
    export let subtitle;
</script>

<div class="bg-white rounded shadow m-2 p-3">
    <div class="flex justify-between items-center">
        <div class="flex items-center space-x-2">
            <div class="text-gray-900 font-medium text-lg">{title}</div>
            {#if subtitle}
                <div class="text-gray-600">/</div>
                <div class="text-gray-600">{subtitle}</div>
            {/if}
        </div>
        <slot />
    </div>
    <slot name="panel" />
</div>
