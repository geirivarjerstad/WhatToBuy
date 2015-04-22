// Karma configuration
// Generated on Thu Sep 18 2014 12:50:12 GMT+0200 (W. Europe Daylight Time)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'js/tools.js',
            'lib/angular/angular.js',
            'lib/angular-cache/dist/angular-cache.min.js',
            'lib/angular-animate/angular-animate.js',
            'lib/angular-sanitize/angular-sanitize.js',
            'lib/angular-ui-router/release/angular-ui-router.js',
            'lib/ng-midway-tester/src/ngMidwayTester.js',
            'lib/collide/collide.js',
            'lib/angular-mocks/angular-mocks.js',
            'lib/ionic/js/ionic.js',
            'lib/ionic/js/ionic-angular.js',
            'lib/ngCordova/dist/ng-cordova.js',
            'app/globals.js',
            'js/app.js',
            'app/x3-dataprovider/*.js',
            'app/x2-repository/*.js',
            'app/x1-controller/**/*.js',
            'app/PopupExtension.js',
            'app/IonicLoadingExtension.js',
            'app/UUID.js',
            'app/MockFactory.js',
            {pattern: 'templates/**', included: false, served: true},
//            {pattern: 'app/x1-controller/Commodity/**', included: false, served: true},
            {pattern: 'app/x1-controller/**', included: false, served: true},

//            'test/*tests.js',
//            'test/*.js',
            'test/**/*.js'
        ],


        // list of files to exclude
        exclude: [
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],

        proxies: {
            '/templates/': '/base/templates/',
            '/app/': '/base/app/'
        },

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
