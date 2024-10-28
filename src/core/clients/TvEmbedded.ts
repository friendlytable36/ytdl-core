import { Clients, ClientsParams } from './meta/Clients';
import Base from './Base';

export default class TvEmbedded {
    static async getPlayerResponse(params: ClientsParams) {
        const { url, payload, headers } = Clients.tvEmbedded(params);

        return await Base.request(url, { payload, headers }, params, 'TvEmbedded');
    }
}
