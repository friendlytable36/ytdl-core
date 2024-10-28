import { Readable } from 'stream';

/** Reference: LuanRT/YouTube.js - Utils.ts */
async function* streamToIterable(stream: ReadableStream<Uint8Array>) {
    const READER = stream.getReader();

    try {
        while (true) {
            const { done, value } = await READER.read();
            if (done) {
                return;
            }

            yield value;
        }
    } finally {
        READER.releaseLock();
    }
}

export function toPipeableStream(stream: ReadableStream<Uint8Array>): Readable {
    return Readable.from(streamToIterable(stream));
}
