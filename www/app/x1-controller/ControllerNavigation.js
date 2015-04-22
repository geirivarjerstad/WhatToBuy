(function () {

    function ControllerNavigationException(message) {
        this.name = 'ControllerNavigationException';
        this.message = message;
        console.error(this.name + ": " + message)
    }

    ControllerNavigationException.prototype = new Error();
    ControllerNavigationException.prototype.constructor = ControllerNavigationException;

    var controllerNavigation = function ($q, $location, FeedService, PopupExtension, UserStore, CommodityCache) {

        var toFeed = function () {
            $location.path("/app/feed");
        };

        var toCommodities = function () {
            $location.path("/app/commodities");
        };

        var toCommoditiesByFeedId = function (feedId) {
            UserStore.saveFeedId(feedId);
            CommodityCache.clearCommodities();
            toCommodities();
        };

        var toCommoditiesOrFeed = function () {

            var deferred = $q.defer();

            FeedService.getFeedlist().then(
                function (data) {
                    if (data.length == 0) {
                            PopupExtension.showAlert("Du må lage en handleliste først");
                            toFeed();
                    }
                    else {
                        toCommodities();
                    }
                    deferred.resolve();
                },
                function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        var toCreateNewUser = function () {
            $location.path("/createuser");
        };

        var toErrors = function () {
            $location.path("/errors");
        };

        var toLogin = function () {
            $location.path("/login");
        };


        return {
            toCommoditiesOrFeed: toCommoditiesOrFeed,
            toCreateNewUser: toCreateNewUser,
            toLogin: toLogin,
            toErrors: toErrors,
            toCommodities: toCommodities,
            toCommoditiesByFeedId: toCommoditiesByFeedId,
            toFeed: toFeed
        };
    };

    var module = angular.module("whattobuy.controllers");
    module.factory("ControllerNavigation", controllerNavigation);

}());
