module.exports = function(config) {
    config.set({
        basePath: '.',
        frameworks: ['mocha', 'chai'],
        files: [
            { pattern: 'index.js', type: 'module', nocache: true },
            { pattern: 'tests/*.test.js', type: 'module', nocache: true },
            { pattern: 'tests/config/*.json', included: false, served: true, watched: false, nocache: true }
        ],
        proxies: {
            '/config/': '/base/tests/config/'
        },
        reporters: ['mocha'],
        port: 9876, // karma web server port
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadless'],
        autoWatch: false,
        // singleRun: false, // Karma captures browsers, runs the tests and exits
        concurrency: Infinity
    });
};
