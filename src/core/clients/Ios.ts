import { Clients, ClientsParams } from './meta/Clients';
import Base from './Base';

export default class Ios {
    static async getPlayerResponse(params: ClientsParams) {
        const { url, payload, headers } = Clients.ios(params);

        return await Base.request(url, { payload, headers }, params, 'Ios');
    }
}
