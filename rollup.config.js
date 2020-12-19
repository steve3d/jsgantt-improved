import dts from 'rollup-plugin-dts'
import copy from 'rollup-plugin-copy'
import postcss from 'rollup-plugin-postcss'
import sourcemaps from 'rollup-plugin-sourcemaps';

export default [
    {
        input: '.tmp/jsgantt.js',
        // https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
        context: 'this',
        watch: {clearScreen: false},
        output: [
            {
                file: 'dist/lib/jsgantt.umd.js',
                name: 'JSGantt',
                sourcemap: true,
                format: 'umd',
                exports: 'named',
            },
            {
                file: 'dist/lib/jsgantt.amd.js',
                sourcemap: true,
                format: 'amd',
                exports: 'named',
            },
            {
                file: 'dist/lib/jsgantt.cjs.js',
                sourcemap: true,
                format: 'cjs',
                exports: 'named',
            },
            {
                file: 'dist/lib/jsgantt.esm.js',
                sourcemap: true,
                format: 'es',
                exports: 'named',
            },
        ],
        plugins: [
            sourcemaps(),
            copy({
                targets: [
                    {src: 'docs', dest: 'dist/docs'},
                    {src: 'src/jsgantt.scss', dest: 'dist/scss'},
                    {src: ['CONTRIBUTING.md', 'Documentation.md', 'LICENSE', 'README.md'], dest: 'dist'},
                    {src: 'package.json', dest: 'dist'}
                ]
            })
        ]
    },
    {
        input: './.tmp/jsgantt.d.ts',
        watch: {clearScreen: false},
        output: [{file: 'dist/jsgantt.d.ts', format: 'es'}],
        plugins: [dts()],
    },
    {
        input: './src/jsgantt.scss',
        output: {file: "dist/jsgantt.css", sourcemap: true},
        plugins: [
            postcss({extract: true, sourceMap: true}),
        ],
    }

]
