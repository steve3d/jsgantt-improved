import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/jsgantt.ts',
    output: {
        dir: 'dist/',
        format: 'es'
    },
    plugins: [typescript()]
};
