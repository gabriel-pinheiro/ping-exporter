import {IRouter} from "./utils/router";
import {Provider} from "./utils/decorators/provider";
import {MetricsRouter} from "./api/metrics/metrics.router";

@Provider()
export class MainRouter implements IRouter {
    constructor(
        private readonly metricsRouter: MetricsRouter,
    ) { }

    async getRoutes() {
        const routes = await Promise.all([
            this.metricsRouter.getRoutes(),
        ]);

        return routes.flat();
    }
}
