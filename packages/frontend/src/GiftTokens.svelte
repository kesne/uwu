<script>
    import UIKit from 'uikit';
    import client, { gql } from './client';

    export let user;

    let modal;
    let loading = false;
    let error = null;

    async function handleSubmit(e) {
        const formData = new FormData(e.target);
        loading = true;
        error = null;
        try {
            await client.mutate({
                mutation: gql`
                    mutation GiftTokens($amount: Int!, $username: String!) {
                        giftTokens(amount: $amount, username: $username) {
                            id
                        }
                    }
                `,
                variables: {
                    amount: Number(formData.get('tokens')),
                    username: formData.get('twitch'),
                },
            });
            e.target.reset();
            UIKit.modal(modal).hide();
        } catch (e) {
            error = e;
        } finally {
            loading = false;
        }
    }
</script>

<!-- This is a button toggling the modal -->
<button uk-toggle="target: #gift-tokens-modal" class="uk-button uk-button-default">
    Gift Tokens
</button>

<!-- This is the modal -->
<div id="gift-tokens-modal" uk-modal bind:this={modal}>
    <div class="uk-modal-dialog uk-modal-body">
        <h2 class="uk-modal-title">Gift Tokens</h2>
        {#if error}
            <div class="uk-alert-danger" uk-alert>
                <h3>Error</h3>
                <p>{error.message}</p>
            </div>
        {/if}
        <p>
            You can gift
            <strong>{user.tokens.length}</strong>
            tokens to any twitch user.
        </p>
        <p>
            Please make sure the Twitch username exactly matches the user you would like to gift
            your tokens to.
        </p>
        <form class="uk-form-stacked" autocomplete="off" on:submit|preventDefault={handleSubmit}>
            <div class="uk-margin">
                <label class="uk-form-label">Tokens to gift</label>
                <div class="uk-form-controls">
                    <input
                        name="tokens"
                        class="uk-input"
                        placeholder="amount of tokens..."
                        min={0}
                        max={user.tokens.length}
                        type="number" />
                </div>
            </div>
            <div class="uk-margin">
                <label class="uk-form-label">Twitch Account</label>
                <div class="uk-form-controls">
                    <input name="twitch" class="uk-input" placeholder="twitch name..." />
                </div>
            </div>

            <p class="uk-text-right">
                <button class="uk-button uk-button-default uk-modal-close" type="button">
                    Cancel
                </button>
                <button class="uk-button uk-button-primary" type="submit" disabled={loading}>
                    {#if loading}
                        <div uk-spinner class="uk-margin-right" />
                    {/if}
                    Save
                </button>
            </p>
        </form>
    </div>
</div>
