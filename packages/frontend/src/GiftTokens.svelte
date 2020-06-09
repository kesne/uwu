<script>
    import client, { gql } from './client';

    export let user;

    let visible = false;
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
            visible = false;
        } catch (e) {
            error = e;
        } finally {
            loading = false;
        }
    }
</script>

<!-- This is a button toggling the modal -->
<span class="inline-flex rounded-md shadow-sm">
    <button
        on:click={() => (visible = true)}
        type="button"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5
        font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none
        focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition
        ease-in-out duration-150">
        Gift Tokens
    </button>
</span>

<!-- This is the modal -->
{#if visible}
    <div
        class="fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center
        sm:justify-center">

        <div class="fixed inset-0 transition-opacity">
            <div class="absolute inset-0 bg-gray-500 opacity-75" />
        </div>

        <div
            class="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform
            transition-all sm:max-w-lg sm:w-full sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline">
            <form autocomplete="off" on:submit|preventDefault={handleSubmit}>
                <div class="sm:flex sm:items-start">
                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                            Gift Tokens
                        </h3>
                        <div class="mt-2">
                            <div class="text-sm leading-5 text-gray-600 space-y-4">
                                {#if error}
                                    <div class="text-red-700">
                                        <h3>Error:</h3>
                                        <p>{error.message}</p>
                                    </div>
                                {/if}
                                <p>
                                    You can gift
                                    <strong>{user.tokens.length}</strong>
                                    tokens to any twitch user.
                                </p>
                                <p>
                                    Please make sure the Twitch username exactly matches the user
                                    you would like to gift your tokens to.
                                </p>
                                <div>
                                    <label
                                        for="tokens_to_gift"
                                        class="block text-sm font-medium leading-5 text-gray-700">
                                        Tokens to Gift
                                    </label>
                                    <div class="mt-1 relative rounded-md shadow-sm">
                                        <input
                                            id="tokens_to_gift"
                                            name="tokens"
                                            class="form-input block w-full sm:text-sm sm:leading-5"
                                            placeholder="1"
                                            value={1}
                                            min={1}
                                            max={user.tokens.length}
                                            type="number" />
                                    </div>
                                </div>
                                <div>
                                    <label
                                        for="twitch_account"
                                        class="block text-sm font-medium leading-5 text-gray-700">
                                        Twitch Account
                                    </label>
                                    <div class="mt-1 relative rounded-md shadow-sm">
                                        <input
                                            id="twitch_account"
                                            name="twitch"
                                            class="form-input block w-full sm:text-sm sm:leading-5"
                                            placeholder="VapeJuiceJordan" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <span class="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                        <button
                            type="submit"
                            class="inline-flex justify-center w-full rounded-md border
                            border-transparent px-4 py-2 bg-indigo-600 text-base leading-6
                            font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none
                            focus:border-indigo-700 focus:shadow-outline-indigo transition
                            ease-in-out duration-150 sm:text-sm sm:leading-5"
                            disabled={loading}>
                            Gift Tokens
                        </button>
                    </span>
                    <span class="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                        <button
                            on:click={() => (visible = false)}
                            type="button"
                            class="inline-flex justify-center w-full rounded-md border
                            border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium
                            text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none
                            focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out
                            duration-150 sm:text-sm sm:leading-5">
                            Cancel
                        </button>
                    </span>
                </div>
            </form>
        </div>
    </div>
{/if}
