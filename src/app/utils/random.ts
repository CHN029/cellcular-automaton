export default class Random {
    static getRandomInt(max: number) {
        return Math.floor(Math.random() * max);
    }

    static getGaussianRandom(mid: number) {
        return Math.floor(this.gaussianRandom() * mid * 2);
    }

    private static gaussianRandom(): number {
        const n = 10;
        var rand = 0;
        for (var i = 0; i < n; i += 1) {
            rand += Math.random();
        }
        return rand / n;
    }
}