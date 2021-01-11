import { babel } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';

export default {
    input: 'src/index.js',
    output: [
        {
            name: 'garea',
            file: 'dist/garea.js',
            format: 'umd'
        },
        {
            name: 'garea',
            file: 'dist/garea.common.js',
            format: 'cjs',
            exports: 'auto'
        },
        {
            name: 'garea',
            file: 'dist/garea.esm.js',
            format: 'esm'
        }
    ],
    plugin: [
        resolve(),
        babel({
            babelHelpers: 'bundled',
            exclude: ["node_modules/**"],
        })
    ]
}