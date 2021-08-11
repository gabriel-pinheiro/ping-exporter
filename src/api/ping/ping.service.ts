import { configProvider } from "../../config/config.service";
import {Service} from "../../utils/decorators/service";
import { PingDto } from "./data/ping.dto";
import * as execa from 'execa';

const debug = require('debug')('app:ping');

const INTERVAL = configProvider.getNumber('PING_INTERVAL');
const HOSTS = configProvider.getArray('PING_HOSTS');

@Service()
export class PingService {
    private lastPingData: PingDto[] = [];

    constructor() {
        this.probe();
        setInterval(() => this.probe(), INTERVAL * 1000);
    }

    getLastPingData(): PingDto[] {
        return this.lastPingData;
    }

    private async probe() {
        debug('probing hosts');
        const results = await Promise.all(HOSTS.map(h => this.smartPing(h)));
        this.lastPingData = results;
    }

    private async smartPing(host: string): Promise<PingDto> {
        const initial = await this.ping(host, 5);
        if(initial.loss === 0 || initial.loss === 100) {
            return initial;
        }
    
        debug('detected partial loss for host ' + host + ', continuing to ping');
        const longPing = await this.ping(host, 15);
        return initial.merge(longPing);
    }

    private async ping(host: string, count: number): Promise<PingDto> {
        try {
            const {stdout} = await execa('ping', [host, '-A', `-c${count}`]) as {stdout: string};
            const { min, avg, max } = stdout.match(/min.*?=\s*(?<min>.+?)\/(?<avg>.+?)\/(?<max>.+?)(\s|\/)/).groups;
            const { loss } = stdout.match(/(?<loss>\d+(,\d+)?)%/).groups;
            debug(`pinged ${host} ${count} times, got ${loss}% loss and ${avg}ms on average`);
    
            return PingDto.of(count, host, min, avg, max, loss.replace(',', '.'));
        } catch(e) {
            debug(e);
            return PingDto.ofError(count, host);
        }
    }
}
