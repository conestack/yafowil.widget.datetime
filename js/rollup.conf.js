import cleanup from 'rollup-plugin-cleanup';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';

const out_dir = 'src/yafowil/widget/datetime/resources';

const outro = `
window.yafowil = window.yafowil || {};
window.yafowil.datetime = exports;
`;

export default args => {

    ////////////////////////////////////////////////////////////////////////////
    // DEFAULT
    ////////////////////////////////////////////////////////////////////////////

    let bundle_default = {
        input: 'js/src/default/bundle.js',
        plugins: [
            cleanup()
        ],
        output: [{
            name: 'yafowil_datetime',
            file: `${out_dir}/default/widget.js`,
            format: 'iife',
            outro: outro,
            globals: {
                jquery: 'jQuery'
            },
            interop: 'default'
        }],
        external: [
            'jquery'
        ]
    };
    if (args.configDebug !== true) {
        bundle_default.output.push({
            name: 'yafowil_datetime',
            file: `${out_dir}/default/widget.min.js`,
            format: 'iife',
            plugins: [
                terser()
            ],
            outro: outro,
            globals: {
                jquery: 'jQuery'
            },
            interop: 'default'
        });
    }
    let scss_timepicker_default = {
        input: ['scss/default/timepicker.scss'],
        output: [{
            file: `${out_dir}/default/timepicker.css`,
            format: 'es',
            plugins: [terser()],
        }],
        plugins: [
            postcss({
                extract: true,
                minimize: true,
                use: [
                    ['sass', { outputStyle: 'compressed' }],
                ],
            }),
        ],
    };
    let scss_datepicker_default = {
        input: ['scss/default/datepicker.scss'],
        output: [{
            file: `${out_dir}/default/datepicker.css`,
            format: 'es',
            plugins: [terser()],
        }],
        plugins: [
            postcss({
                extract: true,
                minimize: true,
                use: [
                    ['sass', { outputStyle: 'compressed' }],
                ],
            }),
        ],
    };

    ////////////////////////////////////////////////////////////////////////////
    // BOOTSTRAP5
    ////////////////////////////////////////////////////////////////////////////

    let bundle_bs5 = {
        input: 'js/src/bootstrap5/bundle.js',
        plugins: [
            cleanup()
        ],
        output: [{
            name: 'yafowil_datetime',
            file: `${out_dir}/bootstrap5/widget.js`,
            format: 'iife',
            outro: outro,
            globals: {
                jquery: 'jQuery',
                popper: 'Popper'
            },
            interop: 'default'
        }],
        external: [
            'jquery',
            'bootstrap',
            'popper'
        ]
    };
    if (args.configDebug !== true) {
        bundle_bs5.output.push({
            name: 'yafowil_datetime',
            file: `${out_dir}/bootstrap5/widget.min.js`,
            format: 'iife',
            plugins: [
                terser()
            ],
            outro: outro,
            globals: {
                jquery: 'jQuery',
                popper: 'Popper'
            },
            interop: 'default'
        });
    }
    let scss_timepicker_bs5 = {
        input: ['scss/bootstrap5/timepicker.scss'],
        output: [{
            file: `${out_dir}/bootstrap5/timepicker.css`,
            format: 'es',
            plugins: [terser()],
        }],
        plugins: [
            postcss({
                extract: true,
                minimize: true,
                use: [
                    ['sass', { outputStyle: 'compressed' }],
                ],
            }),
        ],
    };
    let scss_datepicker_bs5 = {
        input: ['scss/bootstrap5/datepicker.scss'],
        output: [{
            file: `${out_dir}/bootstrap5/datepicker.css`,
            format: 'es',
            plugins: [terser()],
        }],
        plugins: [
            postcss({
                extract: true,
                minimize: true,
                use: [
                    ['sass', { outputStyle: 'compressed' }],
                ],
            }),
        ],
    };

    return [
        bundle_default, scss_datepicker_default, scss_timepicker_default,
        bundle_bs5, scss_datepicker_bs5, scss_timepicker_bs5
    ];
};
