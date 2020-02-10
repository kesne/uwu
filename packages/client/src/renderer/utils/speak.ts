import say from 'say';
import { promisify } from 'util';

export function stop() {
    say.stop();
}

const sayAsync = promisify(say.speak.bind(say));

export default async function speak(message: string, args?: Record<string, string>) {
    if (args) {
        try {
            await sayAsync(message, args.voice || undefined, Number(args.speed) || 1);
        } catch {
            await speak(message);
        }
    } else {
        await sayAsync(message, undefined, undefined);
    }
}
