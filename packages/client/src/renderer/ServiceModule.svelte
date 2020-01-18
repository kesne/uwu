<script>
    export let title;
    export let service;

    let connection = Promise.reject('Failed');
    function retry() {
        connection = service.start();
    }
</script>

<div class="uk-card uk-card-default uk-card-hover uk-margin">
    <div class="uk-card-header">
        <h3 class="uk-card-title">{title}</h3>
    </div>
    {#if service.connection}
        <slot />
    {:else}
        {#await connection}
            <div class="uk-card-body">
                <div uk-spinner />
            </div>
        {:then value}
            <slot />
        {:catch error}
            <div class="uk-card-body">
                <p>The service "{service.name}" failed to connect.</p>
                <div class="uk-margin">
                    <button class="uk-button uk-button-default" on:click={retry}>Retry</button>
                </div>
            </div>
        {/await}
    {/if}
</div>
