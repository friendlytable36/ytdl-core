import { Clients, ClientsParams } from './meta/Clients';
import Base from './Base';

export default class WebCreator {
    static async getPlayerResponse(params: ClientsParams) {
        const { url, payload, headers } = Clients.webCreator(params);

        return await Base.request(url, { payload, headers }, params, 'WebCreator');
    }
}
