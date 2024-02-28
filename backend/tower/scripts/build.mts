import esbuild from 'esbuild';

// check if the build is running in dev mode
const isDev: boolean = process.argv.includes('--dev');

console.log('Building Tower in', isDev ? 'development' : 'production', 'mode');
await esbuild.build({
    entryPoints: ['src/server.ts'],
    sourcemap: isDev ? 'inline' : false,
    outdir: 'dest',
});