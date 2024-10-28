type NextApiResponses = {
    web: YT_NextApiResponse | null;
};

import type { YT_NextApiResponse } from '@/types';
import type { ClientsParams } from '@/core/types';

import { Web } from '@/core/clients';

import ApiBase from './Base';

export default class NextApi {
    static async getApiResponses(nextApiParams: ClientsParams): Promise<NextApiResponses> {
        const NEXT_API_PROMISE = {
                web: Web.getNextResponse(nextApiParams),
            },
            NEXT_API_PROMISES = await Promise.allSettled(Object.values(NEXT_API_PROMISE)),
            NEXT_API_RESPONSES: NextApiResponses = {
                web: ApiBase.checkResponse<YT_NextApiResponse>(NEXT_API_PROMISES[0], 'Next')?.contents || null,
            };

        return NEXT_API_RESPONSES;
    }
}
