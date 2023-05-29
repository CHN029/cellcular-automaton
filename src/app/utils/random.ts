export default class Random {
    static getRandomInt(max: number) {
        return Math.floor(Math.random() * max);
    }
}