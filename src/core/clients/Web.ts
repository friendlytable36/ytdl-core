import { Clients, ClientsParams } from './meta/Clients';
import Base from './Base';

export default class Web {
    static async getPlayerResponse(params: ClientsParams) {
        const { url, payload, headers } = Clients.web(params);

        return await Base.request(url, { payload, headers }, params, 'Web');
    }

    static async getNextResponse(params: ClientsParams) {
        const { url, payload, headers } = Clients.web_nextApi(params);

        return await Base.request(url, { payload, headers }, params, 'Next');
    }
}
