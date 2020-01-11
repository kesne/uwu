import say from 'say';
import backend from 'magic-api/lib/backend';
import Observable from 'zen-observable';

function speak(message: string, args?: Record<string, string>) {
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

export let ttsRequests: Set<ZenObservable.Observer<any>> = new Set();

export default backend({
    ttsRequests() {
        return new Observable((observer) => {
            ttsRequests.add(observer);
            return () => {
                ttsRequests.delete(observer);
            };
        });
    },
    speak(message: string, args?: Record<string, string>) {
        speak(message, args);

        return true;
    },
}).start(1337);
