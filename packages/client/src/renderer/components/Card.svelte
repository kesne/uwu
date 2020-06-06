<script>
    export let title;
</script>

<div class="bg-white overflow-hidden shadow rounded-lg m-2">
    <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">{title}</h3>
    </div>
    <div class="px-4 py-5 sm:px-6">
        <slot />
    </div>
</div>
