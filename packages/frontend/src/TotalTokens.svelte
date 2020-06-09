<script>
    import client, { gql } from './client';
    const totalTokensQuery = client.query({
        query: gql`
            query TotalTokens {
                totalTokens
            }
        `,
    });
</script>

{#await totalTokensQuery then value}
    <p class="text-center my-4">
        <strong>Total tokens in circulation:</strong>
        {value.data.totalTokens}
    </p>
{/await}
