import cleanup from 'rollup-plugin-cleanup';
import {terser} from 'rollup-plugin-terser';

const out_dir = 'src/yafowil/widget/datetime/resources';

const outro = `
if (window.yafowil === undefined) {
    window.yafowil = {};
}
window.yafowil.datetime = exports;
`;

export default args => {
    let conf = {
        input: 'js/src/bundle.js',
        plugins: [
            cleanup()
        ],
        output: [{
            file: `${out_dir}/widget.js`,
            name: 'yafowil_datetime',
            format: 'iife',
            outro: outro,
            globals: {
                jquery: 'jQuery'
            },
            interop: 'default',
            sourcemap: false
        }],
        external: [
            'jquery'
        ]
    };
    if (args.configDebug !== true) {
        conf.output.push({
            file: `${out_dir}/widget.min.js`,
            name: 'yafowil_datetime',
            format: 'iife',
            plugins: [
                terser()
            ],
            outro: outro,
            globals: {
                jquery: 'jQuery'
            },
            interop: 'default',
            sourcemap: false
        });
    }
    return conf;
};
