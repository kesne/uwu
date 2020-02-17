<script>
    import parseMessage from './utils/parseMessage.js';

    export let message;
    export let tags;

    const words = parseMessage(message, tags);
</script>

<style>
    .message {
        background: black;
        padding: 22px;
        margin: 16px;
        border-radius: 20px;
        font-size: 23px;
        color: white;
        font-family: 'Noto Sans';
    }

    img {
        height: 28px;
    }

    .emote-only img {
        height: 56px;
    }

    .username {
        font-weight: bold;
    }
</style>

<div class="message" class:emote-only={tags['emote-only']}>
    <div class="username">
        {tags['display-name']}
    </div>
    {#each words as word}
        {#if word.image}
            <img alt="Emote" src={word.image} />
        {:else}
            <span>{word} </span>
        {/if}
    {/each}
</div>
