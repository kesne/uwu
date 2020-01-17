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

{#await totalTokensQuery}
    <div uk-spinner />
{:then value}
    <p>
        <strong>Total tokens in circulation:</strong>
        {value.data.totalTokens}
    </p>
{/await}
