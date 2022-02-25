import { terser } from 'rollup-plugin-terser';
import { babel } from '@rollup/plugin-babel';
import commonjs from "@rollup/plugin-commonjs";
import resolve from '@rollup/plugin-node-resolve';

const packageJson = require('./package.json');

module.exports = {
    input: 'src/core.js',
    output: [
        {
            name: packageJson.name,
            file: packageJson.browser,
            format: 'umd'
        },
        {
            name: packageJson.name,
            file: packageJson.main,
            format: 'cjs',
            exports: 'auto'
        },
        {
            name: packageJson.name,
            file: packageJson.module,
            format: 'esm'
        }
    ],
    plugins: [
        resolve({
            jsnext: true,
            main: true,
            browser: true,
        }),
        babel({
            babelHelpers: 'bundled',
            exclude: ["node_modules/**"],
        }),
        commonjs(),
        terser()
    ]
}
