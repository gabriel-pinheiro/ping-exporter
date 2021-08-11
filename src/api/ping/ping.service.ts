import {Service} from "../../utils/decorators/service";
import { PingDto } from "./data/ping.dto";

@Service()
export class PingService {

    getLastPingData(): PingDto[] {
        return [PingDto.of(5, '1.1.1.1', '20', '21', '22', '5'), PingDto.of(5, '192.168.1.1', '0', '1', '1', '0')];
    }
}
