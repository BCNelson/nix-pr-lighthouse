import esbuild from 'esbuild';
import nodemon from 'nodemon';
import JstoJson from './JstoJson.mjs';

// check if the build is running in dev mode
const isDev: boolean = process.argv.includes('--dev');
const isWatch: boolean = process.argv.includes('--watch');

console.log('Building Tower in', isDev ? 'development' : 'production', 'mode');
const ctx = await esbuild.context({
    bundle: true,
    platform: 'node',
    entryPoints: ['src/server.ts'],
    sourcemap: isDev ? 'inline' : false,
    minify: !isDev,
    outdir: 'dest',
    format: 'esm',
    treeShaking: true,
    plugins: [JstoJson('static')],
    outExtension: {
        '.js': '.mjs',
    },
    banner: {
        js: "import { createRequire } from 'module';const require = createRequire(import.meta.url);"
    },
});

if (!isWatch) {
    await ctx.rebuild();
    ctx.dispose();
    console.log('Build complete');
    process.exit(0);
}

const shutdownFuncs: Array<() => void> = [];

function shutdown() {
    console.log('Shutting down...');
    for (const func of shutdownFuncs) {
        func();
    }
    process.exit(0);
}

process.on('SIGINT', () => {
    shutdown();
});
shutdownFuncs.push(() => ctx.dispose());

await ctx.watch()

nodemon({
    script: 'dest/server.mjs',
    delay: 500,
    exec: isDev ? 'node --inspect' : 'node',
    runOnChangeOnly: true,
});

nodemon.on('start', () => {
    console.log('Server started');
});

nodemon.on('quit', () => {
    console.log('Server quit');
    shutdown();
});

nodemon.on('restart', () => {
    console.log('Server restarted');
});

