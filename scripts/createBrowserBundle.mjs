import esbuild, { analyzeMetafile } from 'esbuild';

esbuild
    .build({
        entryPoints: ['./package/platforms/Browser/Browser.js'],
        bundle: true,
        target: 'chrome70',
        metafile: true,
        keepNames: true,
        format: 'esm',
        define: {
            global: 'globalThis',
        },
        conditions: ['module'],
        outfile: './bundle/browser.min.js',
        platform: 'browser',
        minify: true,
        external: ['undici'],
    })
    .then(async (result) => {
        console.log(await analyzeMetafile(result.metafile));
    });
