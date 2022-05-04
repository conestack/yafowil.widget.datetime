// chromium binary
process.env.CHROME_BIN = '/usr/bin/chromium';

// karma config
module.exports = function(config) {
    config.set({
        basePath: 'karma',
        frameworks: [
            'qunit'
        ],
        files: [{
            pattern: '../../node_modules/vanillajs-datepicker/dist/js/datepicker.js',
            included: true
        }, {
            pattern: '../../node_modules/jquery/src/**/*.js',
            type: 'module',
            included: false
        }, {
            pattern: '../src/*.js',
            type: 'module',
            included: false
        }, {
            pattern: '../tests/test_*.js',
            type: 'module'
        },
        {
            pattern: '../../src/yafowil/widget/datetime/resources/timepicker.css',
            included: true
        },
        {
            pattern: '../../src/yafowil/widget/datetime/resources/datepicker.css',
            included: true
        }],
        browsers: [
            'ChromeHeadless'
        ],
        autoWatch: false,
        singleRun: true,
        reporters: [
            'progress',
            'coverage'
        ],
        preprocessors: {
            '../src/*.js': [
                'coverage',
                'module-resolver'
            ],
            '../tests/*.js': [
                'coverage',
                'module-resolver'
            ]
        },
        moduleResolverPreprocessor: {
            addExtension: 'js',
            customResolver: null,
            ecmaVersion: 6,
            aliases: {
                jquery: '../../node_modules/jquery/src/jquery.js'
            }
        }
    });
};