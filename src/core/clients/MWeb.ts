import { Clients, ClientsParams } from './meta/Clients';
import Base from './Base';

export default class MWeb {
    static async getPlayerResponse(params: ClientsParams) {
        const { url, payload, headers } = Clients.mweb(params);

        return await Base.request(url, { payload, headers }, params, 'MWeb');
    }
}
