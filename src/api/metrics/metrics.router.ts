import {Provider} from "../../utils/decorators/provider";
import {IRouter} from "../../utils/router";
import {MetricsController} from "./metrics.controller";

@Provider()
export class MetricsRouter implements IRouter{
    constructor(
        private readonly controller: MetricsController,
    ) { }

    async getRoutes() {
        return [{
            method: 'GET',
            path: '/metrics',
            handler: this.controller.listAll.bind(this.controller),
        }];
    }
}
