import { readable, Writable } from 'svelte/store';

export default function queue<T>(
    store: Writable<T[]>,
    config: {
        duration: number;
        onStart(item: T): void;
        onComplete(): void;
    },
) {
    const nextValues: T[] = [];
    let timeout: ReturnType<typeof setTimeout> | null = null;
    let outerSet = (nextValue: T | null) => {};

    let setRemainingStore = (remaining: number) => {};
    const remainingStore = readable(0, (set) => {
        setRemainingStore = set;
    });

    const queueStore = readable<T | null>(null, (set) => {
        outerSet = set;

        const unsubscribe = store.subscribe((items) => {
            let nextValue = items.length ? items[0] : null;
            startNext(nextValue);
            if (!nextValue) return;
            const [, ...newItems] = items;
            store.set(newItems);
        });

        return () => {
            unsubscribe();
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    });

    function startNext(nextValue: T | null | undefined) {
        if (!nextValue) return;

        if (timeout) {
            nextValues.push(nextValue);
            setRemainingStore(nextValues.length);
        } else {
            outerSet(nextValue);
            config.onStart(nextValue);
            timeout = setTimeout(() => {
                timeoutDone();
            }, config.duration);
        }
    }

    function timeoutDone() {
        timeout = null;
        if (!nextValues.length) {
            config.onComplete();
            outerSet(null);
        } else {
            const nextNextValue = nextValues.shift();
            setRemainingStore(nextValues.length);
            startNext(nextNextValue);
        }
    }

    function skip() {
        if (timeout) {
            clearTimeout(timeout);
            timeoutDone();
        }
    }

    return [queueStore, remainingStore, skip] as const;
}
