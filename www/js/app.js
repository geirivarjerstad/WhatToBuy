// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
//
//angular.module('whattobuy')
//    .config(['$httpProvider', function ($httpProvider) {
//        // ...
//
//        // delete header from client:
//        // http://stackoverflow.com/questions/17289195/angularjs-post-data-to-external-rest-api
//        $httpProvider.defaults.useXDomain = true;
//        delete $httpProvider.defaults.headers.common['X-Requested-With'];
//    }]);

function AppException(exception, cause) {
    this.name = 'AppException';
    this.date = new Date();
    this.message = exception.message;
    this.message = exception.stack;
    this.cause = cause;
    console.error(this.name + ": " + exception.message)
}

AppException.prototype = new Error();
AppException.prototype.constructor = AppException;

var repositoryNames = {
    UserRepository: "UserRepository",
    LoginRepository: "LoginRepository",
    CommodityRepository: "CommodityRepository",
    FeedRepository: "FeedRepository"
};

var serviceNames = {
    UserService: "UserService",
    CommodityService: "CommodityService",
    LoginService: "LoginService",
    FeedService: "FeedService",
    ErrorService: "ErrorService"
};

var dataproviderNames = {
    ServerUrlStore: "ServerUrlStore",
    LoginStore: "LoginStore",
    ErrorStore: "ErrorStore",
    UserStore: "UserStore",
    CommodityCache: "CommodityCache"
};

var toolNames = {
    PopupExtension: "PopupExtension",
    IonicLoadingExtension: "IonicLoadingExtension",
    UUID: "UUID",
    MockFactory: "MockFactory"
};

var controllerNames = {
    ControllerNavigation: "ControllerNavigation",
    SettingsController: "SettingsController"
}

var moduleNames = {
    whattobuyDataproviders: "whattobuy.dataproviders",
    whattobuyControllers: "whattobuy.controllers",
    whattobuyRepositories: "whattobuy.repositories"
};


angular.module('whattobuy.directives', []);
angular.module('whattobuy.repositories', []);
angular.module('whattobuy.controllers', []);
angular.module('whattobuy.dataproviders', []);
angular.module('whattobuy', ['ionic', 'ngCordova', 'angular-data.DSCacheFactory', 'whattobuy.controllers', 'whattobuy.dataproviders', 'whattobuy.repositories', 'whattobuy.directives'])

    .run(function ($ionicPlatform, DSCacheFactory,  $ionicPopup, IonicLoadingExtension) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

            $ionicPlatform.onHardwareBackButton(function () {
                IonicLoadingExtension.hideLoading();
                //if (true) { // your check here
                //    $ionicPopup.confirm({
                //        title: 'System warning',
                //        template: 'are you sure you want to exit?'
                //    }).then(function (res) {
                //        if (res) {
                //            navigator.app.exitApp();
                //        }
                //    })
                //}
            });
            //if (window.cordova) {
            //    $cordovaClipboard.copy('text to copy').then(function () {
            //        // success
            //    }, function () {
            //        // error
            //    });
            //}


            DSCacheFactory("commodityCache", {storageMode: "localStorage"});

//            $rootScope.$on("$routeChangeStart", function (event, next, current) {
//               console.log(event);
//               console.log(next);
//               console.log(current);
//            });

        });
    })
// register globals
    .
    value('globalData', _globalData)

    .config(function ($provide) {

        $provide.decorator("$exceptionHandler", function ($delegate, $injector) {
            return function (exception, cause) {
                var $rootScope = $injector.get("$rootScope");
                var ErrorStore = $injector.get("ErrorStore");

                console.error("$exceptionHandler **************");
                ErrorStore.addError(new AppException(exception, cause));
                $delegate(exception, cause);
            };
        });
    })

    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {


//        $httpProvider.defaults.useXDomain = true;
//        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            // setup an abstract state for the tabs directive
//            .state('tab', {
//                url: "/tab",
//                abstract: true,
//                templateUrl: "templates/tabs.html"
//            })
            .state('login', {
                url: '/login',
                templateUrl: 'app/x1-controller/Login/login.html'
            })

            .state('createuser', {
                url: '/createuser',
                templateUrl: 'app/x1-controller/User/createuser.html'
            })

            .state('errors', {
                url: '/errors',
                templateUrl: 'app/x1-controller/Error/error-simple.html'
            })

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html"
            })
            // Each tab has its own nav history stack:

            .state('app.commodities', {
                url: '/commodities',
                views: {
                    'menuContent': {
                        templateUrl: 'app/x1-controller/Commodity/tab-commodities.html'
                    }
                }
            })
            .state('app.feed', {
                url: '/feed',
                views: {
                    'menuContent': {
                        templateUrl: 'app/x1-controller/Feed/feed-index.html'
                    }
                }
            })
            .state('app.sharedfeed', {
                url: '/sharedfeed',
                views: {
                    'menuContent': {
                        templateUrl: 'app/x1-controller/SharedFeed/sharedfeed-index.html'
                    }
                }
            })
            .state('app.errors', {
                url: '/errors-index',
                views: {
                    'menuContent': {
                        templateUrl: 'app/x1-controller/Error/error-index.html'
                    }
                }
            })

            .state('app.settings', {
                url: '/settings',
                views: {
                    'menuContent': {
                        templateUrl: 'app/x1-controller/Settings/tab-settings.html'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/commodities');

    })
    .run(function ($rootScope, $location, LoginStore) {

        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
                console.log("$stateChangeStart: url:" + toState.url);
                if (toState.url === "/createuser") {
                    $location.path("/createuser");
                }
                else if (toState.url === "/errors") {
                    $location.path("/errors");
                }
                else if (!LoginStore.hasLoginDetails()) {
                    if (toState.url === "/login") {
                    } else {
                        $location.path("/login");
//                        event.preventDefault();
                    }
                    //  $location.path("/login");
                }


                // transitionTo() promise will be rejected with
                // a 'transition prevented' error
            })
    })
;
