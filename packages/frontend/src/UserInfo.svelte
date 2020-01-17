<script>
    import TotalTokens from './TotalTokens.svelte';
    import GiftTokens from './GiftTokens.svelte';

    export let user;
</script>

<div class="uk-card uk-card-default uk-width-1-2@m">
    <div class="uk-card-header">
        <h3 class="uk-card-title uk-margin-remove-bottom">{user.name}</h3>
        <p class="uk-text-meta uk-margin-remove-top">
            <strong>Tokens:</strong>
            {user.tokens.length}
        </p>
    </div>
    <div class="uk-card-body">
        {#each user.tokens as token}
            <dl class="uk-description-list">
                <dt>{token.reason}</dt>
                <dd>{new Date(Number(token.createdAt)).toDateString()}</dd>
            </dl>
        {/each}
    </div>
    <div class="uk-card-footer">
        <GiftTokens {user} />
    </div>
</div>

<TotalTokens />
