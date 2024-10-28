import { Clients, ClientsParams } from './meta/Clients';
import Base from './Base';

export default class Tv {
    static async getPlayerResponse(params: ClientsParams) {
        const { url, payload, headers } = Clients.tv(params);

        return await Base.request(url, { payload, headers }, params, 'Tv');
    }
}
