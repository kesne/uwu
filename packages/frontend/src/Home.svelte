<script>
    import client, { gql } from './client';
    import SignIn from './SignIn.svelte';
    import UserInfo from './UserInfo.svelte';

    const meQuery = client.query({
        query: gql`
            query Me {
                me {
                    id
                    name
                    tokens {
                        id
                        reason
                        createdAt
                    }
                }
            }
        `,
    });
</script>

{#await meQuery}
    <div uk-spinner />
{:then value}
    {#if value.data.me}
        <UserInfo user={value.data.me} />
    {:else}
        <SignIn />
    {/if}
{:catch error}
    <div class="uk-alert-danger" uk-alert>
        <h3>Error</h3>
        <p>{error.message}</p>
    </div>
{/await}
