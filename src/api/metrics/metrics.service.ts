import * as Boom from "@hapi/boom";
import {Service} from "../../utils/decorators/service";
import { PingService } from "../ping/ping.service";

@Service()
export class MetricsService {
    constructor(
        private readonly pingService: PingService,
    ) { }

    async getMetrics(): Promise<string> {
        const pings = this.pingService.getLastPingData();
        if(!pings.length) {
            throw Boom.tooEarly('Ping data isn\'t ready yet');
        }

        return `# HELP ping_latency_min Min latency to chosen host in milliseconds
# TYPE ping_latency_min gauge
${pings.map(p => `ping_latency_min{host="${p.host}"} ${p.min}`).join('\n')}
# HELP ping_latency_avg Average latency to chosen host in milliseconds
# TYPE ping_latency_avg gauge
${pings.map(p => `ping_latency_avg{host="${p.host}"} ${p.avg}`).join('\n')}
# HELP ping_latency_max Max latency to chosen host in milliseconds
# TYPE ping_latency_max gauge
${pings.map(p => `ping_latency_max{host="${p.host}"} ${p.max}`).join('\n')}
# HELP ping_loss Packet loss percentage to chosen host
# TYPE ping_loss gauge
${pings.map(p => `ping_loss{host="${p.host}"} ${p.loss}`).join('\n')}`;
    }
}
