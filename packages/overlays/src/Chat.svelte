<script>
    import { quintOut } from 'svelte/easing';
    import { crossfade } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    import { chats } from './stores';
    import Message from './Message.svelte';

    var tags = {"badge-info":{"subscriber":"11"},"badges":{"moderator":"1","subscriber":"6","glhf-pledge":"1"},"color":"#FF69B4","display-name":"uwu_its_cayden","emotes":{"2":["36-37"],"301126518":["39-48"]},"flags":null,"id":"b59f14e6-bf15-4877-a340-bfc2e838dd7c","mod":true,"room-id":"99472289","subscriber":true,"tmi-sent-ts":"1581817191503","turbo":false,"user-id":"114763460","user-type":"mod","emotes-raw":"2:36-37/301126518:39-48","badge-info-raw":"subscriber/11","badges-raw":"moderator/1,subscriber/6,glhf-pledge/1","username":"uwu_its_cayden","message-type":"chat"};
    var message = 'Ooooo he said he can’t come tonight :( aniemalDed'

    const [send, receive] = crossfade({
        fallback(node, params) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;

            return {
                duration: 600,
                easing: quintOut,
                css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t};
				`,
            };
        },
    });
</script>

<style>
    .container {
        display: flex;
        flex-direction: column-reverse;
        height: 400px;
        overflow: hidden;
        mask-image: linear-gradient(0deg, black, black 70%, transparent);
        -webkit-mask-image: linear-gradient(0deg, black, black 70%, transparent);
    }
</style>

<div class="container">
    {#each $chats as chat (chat.message)}
        <div
            in:receive={{ key: chat.message }}
            out:send={{ key: chat.message }}
            animate:flip>
            <Message message={chat.message} tags={chat.tags} />
        </div>
    {/each}
</div>
