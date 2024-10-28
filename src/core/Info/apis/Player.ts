enum CLIENTS_NUMBER {
    web = 0,
    webCreator = 1,
    webEmbedded = 2,
    tvEmbedded = 3,
    ios = 4,
    android = 5,
    mweb = 6,
    tv = 7,
}

enum UPPERCASE_CLIENTS {
    web = 'Web',
    webCreator = 'WebCreator',
    webEmbedded = 'WebEmbedded',
    tvEmbedded = 'TvEmbedded',
    ios = 'Ios',
    android = 'Android',
    mweb = 'MWeb',
    tv = 'Tv',
}

type PlayerApiResponses = {
    web: YT_PlayerApiResponse | null;
    webCreator: YT_PlayerApiResponse | null;
    webEmbedded: YT_PlayerApiResponse | null;
    tvEmbedded: YT_PlayerApiResponse | null;
    ios: YT_PlayerApiResponse | null;
    android: YT_PlayerApiResponse | null;
    mweb: YT_PlayerApiResponse | null;
    tv: YT_PlayerApiResponse | null;
};

import type { YT_PlayerApiResponse, YTDL_ClientTypes } from '@/types';
import type { ClientsParams } from '@/core/types';

import { Web, WebCreator, WebEmbedded, TvEmbedded, Ios, Android, MWeb, Tv } from '@/core/clients';
import { UnrecoverableError } from '@/core/errors';

import { Logger } from '@/utils/Log';

import ApiBase from './Base';

export default class PlayerApi {
    static async getApiResponses(playerApiParams: ClientsParams, clients: Array<YTDL_ClientTypes>): Promise<{ isMinimalMode: boolean; responses: PlayerApiResponses }> {
        const PLAYER_API_PROMISE = {
                web: clients.includes('web') ? Web.getPlayerResponse(playerApiParams) : Promise.reject(null),
                webCreator: clients.includes('webCreator') ? WebCreator.getPlayerResponse(playerApiParams) : Promise.reject(null),
                webEmbedded: clients.includes('webEmbedded') ? WebEmbedded.getPlayerResponse(playerApiParams) : Promise.reject(null),
                tvEmbedded: clients.includes('tvEmbedded') ? TvEmbedded.getPlayerResponse(playerApiParams) : Promise.reject(null),
                ios: clients.includes('ios') ? Ios.getPlayerResponse(playerApiParams) : Promise.reject(null),
                android: clients.includes('android') ? Android.getPlayerResponse(playerApiParams) : Promise.reject(null),
                mweb: clients.includes('mweb') ? MWeb.getPlayerResponse(playerApiParams) : Promise.reject(null),
                tv: clients.includes('tv') ? Tv.getPlayerResponse(playerApiParams) : Promise.reject(null),
            },
            PLAYER_API_PROMISES = await Promise.allSettled(Object.values(PLAYER_API_PROMISE)),
            PLAYER_API_RESPONSES: PlayerApiResponses = {
                web: null,
                webCreator: null,
                webEmbedded: null,
                tvEmbedded: null,
                ios: null,
                android: null,
                mweb: null,
                tv: null,
            };

        clients.forEach((client) => {
            PLAYER_API_RESPONSES[client] = ApiBase.checkResponse(PLAYER_API_PROMISES[CLIENTS_NUMBER[client]], UPPERCASE_CLIENTS[client])?.contents || null;
        });

        const IS_MINIMUM_MODE = PLAYER_API_PROMISES.every((r) => r.status === 'rejected');

        if (IS_MINIMUM_MODE) {
            const ERROR_TEXT = `All player APIs responded with an error. (Clients: ${clients.join(', ')})\nFor details, specify \`logDisplay: ["debug", "info", "success", "warning", "error"]\` in the constructor options of the YtdlCore class.`;

            if (PLAYER_API_RESPONSES.ios && !PLAYER_API_RESPONSES.ios.videoDetails) {
                throw new UnrecoverableError(ERROR_TEXT + `\nNote: This error cannot continue processing. (Details: ${JSON.stringify(PLAYER_API_RESPONSES.ios.playabilityStatus.reason)})`, PLAYER_API_RESPONSES.ios.playabilityStatus.reason);
            }

            if (!PLAYER_API_RESPONSES.web) {
                Logger.info('As a fallback to obtain the minimum information, the web client is forced to adapt.');
                const WEB_CLIENT_PROMISE = (await Promise.allSettled([Web.getPlayerResponse(playerApiParams)]))[0];
                PLAYER_API_RESPONSES.web = ApiBase.checkResponse(WEB_CLIENT_PROMISE, 'Web')?.contents || null;
            }

            Logger.error(ERROR_TEXT);
            Logger.info('Only minimal information is available, as information from the Player API is not available.');
        }

        return {
            isMinimalMode: IS_MINIMUM_MODE,
            responses: PLAYER_API_RESPONSES,
        };
    }
}
