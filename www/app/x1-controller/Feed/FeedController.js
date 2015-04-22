(function () {

    var FeedController = function ($scope, FeedService, FeedRepository, PopupExtension, IonicLoadingExtension, $timeout, CommodityCache, ErrorStore, ControllerNavigation) {

        var vm = this;
        vm.newFeedName = null;

        vm.loadPrivateFeeds = function () {

            IonicLoadingExtension.showLoading();

            FeedService.getPrivateFeedlist().then(
                function (data) {
                    $timeout(function () {
                        vm.feedList = data;
                        IonicLoadingExtension.hideLoading();
                    }, 200);
                },
                function (error) {
                    // Error
                    vm.error = error;
                    IonicLoadingExtension.hideLoading();
                    PopupExtension.showError(error);
                    ErrorStore.addError(error);
                })
        };

        vm.addFeed = function (newFeedName) {
            var feed = {
                name: newFeedName
            };

            IonicLoadingExtension.showLoading();
            FeedService.saveFeed(feed).then(
                function () {
                    IonicLoadingExtension.hideLoading();
                    vm.loadPrivateFeeds();
                    CommodityCache.clearCommodities();
                    vm.newFeedName = null;
                },
                function (error) {
                    // Error
                    IonicLoadingExtension.hideLoading();
                    PopupExtension.showError("Unable to add feed: " + error.message);
                    ErrorStore.addError(error);
                });
        };

        vm.navigateToCommodityByFeedId = function (feedId) {
            ControllerNavigation.toCommoditiesByFeedId(feedId);
        };

        vm.deletePrivateFeed = function (feedId) {

            IonicLoadingExtension.showLoading();
            FeedService.deleteFeed(feedId).then(
                function () {
                    IonicLoadingExtension.hideLoading();
                    vm.loadPrivateFeeds();
                    vm.newFeedName = null;
                    CommodityCache.clearCommodities();
                },
                function (error) {
                    // Error
                    IonicLoadingExtension.hideLoading();
                    PopupExtension.showError("Unable to delete feed: " + error);
                    ErrorStore.addError(error);
                });
        };

        vm.FeedController = function () {
            console.log("FeedController init");
            vm.loadPrivateFeeds();
        };
    };

    var module = angular.module("whattobuy.controllers");
    module.controller("FeedController", FeedController);

}());