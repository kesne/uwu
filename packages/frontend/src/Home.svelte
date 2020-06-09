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
    <div class="text-gray-600 text-center m-2">Loading...</div>
{:then value}
    {#if value.data.me}
        <UserInfo user={value.data.me} />
    {:else}
        <SignIn />
    {/if}
{:catch error}
    <div class="text-red-800 m-2">
        <h3 class="text-lg font-bold mb-2">Error</h3>
        <p>{error.message}</p>
    </div>
{/await}
