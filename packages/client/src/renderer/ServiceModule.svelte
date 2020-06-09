<script>
    import App from './App.svelte';

    export let service;

    let connection = Promise.resolve();
    function retry() {
        connection = service.start();
    }
</script>

{#if service.connection}
    <slot />
{:else}
    {#await connection}
        <div class="text-gray-600 text-center p-2 text-sm">Connecting to {service.name}...</div>
    {:then value}
        <slot />
    {:catch error}
        <div class="text-red-600 p-2 text-sm flex justify-between opacity-75">
            The service "{service.name}" failed to connect.
            <button class="text-indigo-600 underline" on:click={retry}>Retry</button>
        </div>
    {/await}
{/if}
