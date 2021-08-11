export class PingDto {
    constructor(
        private readonly count: number,
        public readonly host: string,
        public readonly min: number,
        public readonly avg: number,
        public readonly max: number,
        public readonly loss: number,
    ) {}

    merge(target: PingDto): PingDto {
        if(this.host !== target.host) {
            throw new Error(`Cannot merge pings of different hosts`);
        }

        return new PingDto(
            this.count + target.count,
            this.host,
            Math.min(this.min, target.min),
            this.weightedAverageMerge(this.avg, target.avg, this.count, target.count),
            Math.max(this.max, target.max),
            Math.round(this.weightedAverageMerge(this.loss, target.loss, this.count, target.count)),
        );
    }

    private weightedAverageMerge(a: number, b: number, aWeight: number, bWeight: number) {
        return (a*aWeight + b*bWeight) / (aWeight + bWeight);
    }

    static of(count: number, host:string,  min: string, avg: string, max: string, loss: string): PingDto {
        return new PingDto(count, host, Number(min), Number(avg), Number(max), Number(loss));
    }
    
    static ofError(count: number, host: string): PingDto {
        return new PingDto(count, host, NaN, NaN, NaN, 100);
    }
}
