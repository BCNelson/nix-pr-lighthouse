import type { Plugin } from 'esbuild';
import Path from 'path';

export default function JstoJson(StaticPath: string): Plugin {
    return {
        name: 'JstoJson',
        setup(build) {

            build.onResolve({ filter: /^@static\/.*\.js/, namespace: "file" }, (args) => {
                return {
                    path: args.path,
                    namespace: "static-js"
                };
            });
        
            build.onLoad({ filter: /^@static\/.*\.js/, namespace: "static-js" }, async (args) => {
                //remove the @static/ prefix
                let path = args.path.replace(/^@static\//, "");
                path = Path.resolve(StaticPath, path);
                try{
                    const contents = await import(path);
                    return {
                        contents: JSON.stringify(contents.default),
                        loader: "json",
                        warnings: contents.__esbuild?.warnings
                    };
                } catch (e) {
                    return {
                        errors: [{text: `Could not load file ${path} from static folder: ${e}`}]
                    }
                }
            });
        },
    }
}