<script>
    import TextApprover from './TextApprover.svelte';
    import websocket from './utils/websocket';

    let messages = [];

    websocket.addEventListener('message', event => {
        const message = JSON.parse(event.data);
        switch (message.type) {
            case 'TTS':
                messages = [...messages, message.userInput];
                // TODO: We should only parse arguments in front position, not anywhere.
                // if (message.userInput.includes(':')) {
                //     const messageParts = message.userInput.split(' ');
                //     const args: Record<string, string> = {};
                //     const text: string[] = [];
                //     messageParts.forEach((part: string) => {
                //         if (part.includes(':')) {
                //             const [key, value] = part.split(':');
                //             args[key] = value;
                //         } else {
                //             text.push(part);
                //         }
                //     });

                //     speak(text.join(' '), args);
                // } else {
                //     speak(message.userInput);
                // }
                break;
            default:
                console.warn(`Unknown type: ${message.type}`);
                break;
        }
    });

    function handleDone(event) {
        messages.splice(event.detail.index, 1);
        messages = messages;
    }
</script>

<div class="container">
    <h1 class="title">UwU Stream Manager</h1>
    {#each messages as message, i}
        <TextApprover on:done={handleDone} index={i} {message} />
    {/each}
</div>
