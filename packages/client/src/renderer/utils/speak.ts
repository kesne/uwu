import say from 'say';

export default function speak(message: string, args?: Record<string, string>) {
    if (args) {
        say.speak(message, args.voice || undefined, Number(args.speed) || 1, err => {
            if (err) {
                speak(message);
            }
        });
    } else {
        say.speak(message);
    }
}
