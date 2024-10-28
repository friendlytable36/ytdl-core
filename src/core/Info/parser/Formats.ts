type YTDL_M3U8Data = { itag: number; url: string };

import type { YTDL_RequestOptions, YT_StreamingAdaptiveFormat, YT_PlayerApiResponse } from '@/types';

import { Fetcher } from '@/core/Fetcher';

import { Url } from '@/utils/Url';

export class FormatParser {
    static parseFormats(playerResponse: YT_PlayerApiResponse | null): Array<YT_StreamingAdaptiveFormat> {
        let formats: Array<YT_StreamingAdaptiveFormat> = [];

        if (playerResponse && playerResponse.streamingData) {
            formats = formats.concat(playerResponse.streamingData.formats).concat(playerResponse.streamingData.adaptiveFormats);
        }

        return formats;
    }

    static async getM3U8(url: string, options: YTDL_RequestOptions): Promise<Record<string, YTDL_M3U8Data>> {
        const _URL = new URL(url, Url.getBaseUrl()),
            BODY = await Fetcher.request<string>(_URL.toString(), options),
            FORMATS: Record<string, YTDL_M3U8Data> = {};

        BODY.split('\n')
            .filter((line) => /^https?:\/\//.test(line))
            .forEach((line) => {
                const MATCH = line.match(/\/itag\/(\d+)\//) || [],
                    ITAG = parseInt(MATCH[1]);

                FORMATS[line] = { itag: ITAG, url: line };
            });

        return FORMATS;
    }

    static parseAdditionalManifests(playerResponse: YT_PlayerApiResponse | null, options: YTDL_RequestOptions): Array<Promise<Record<string, YTDL_M3U8Data>>> {
        const STREAMING_DATA = playerResponse && playerResponse.streamingData,
            MANIFESTS: Array<Promise<Record<string, YTDL_M3U8Data>>> = [];

        if (STREAMING_DATA) {
            if (STREAMING_DATA.hlsManifestUrl) {
                MANIFESTS.push(this.getM3U8(STREAMING_DATA.hlsManifestUrl, options));
            }
        }

        return MANIFESTS;
    }
}
