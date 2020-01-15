export default function sleep(amount: number) {
    return new Promise(resolve => setTimeout(resolve, amount));
}
