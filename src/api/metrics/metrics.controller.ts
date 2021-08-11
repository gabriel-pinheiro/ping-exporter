import {Provider} from "../../utils/decorators/provider";
import * as Hapi from '@hapi/hapi';
import {MetricsService} from "./metrics.service";

@Provider()
export class MetricsController {
    constructor(
        private readonly service: MetricsService,
    ) { }

    async listAll(_: Hapi.Request, h: Hapi.ResponseToolkit) {
        const metrics = await this.service.getMetrics();
        return h
            .response(metrics)
            .header('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
    }
}
