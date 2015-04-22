(function () {

    var SharedFeedController = function ($scope, FeedService, FeedRepository, PopupExtension, IonicLoadingExtension, $timeout, CommodityCache, ErrorStore, ControllerNavigation) {

        var vm = this;
        vm.shareId = null;
        vm.feedpassword = null;

        vm.loadSharedFeeds = function () {

            IonicLoadingExtension.showLoading();

            FeedService.getSharedFeedlist().then(
                function (data) {
                    $timeout(function () {
                        vm.sharedFeedList = data;
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

        vm.addSharedFeed = function (shareId, feedpassword) {

            IonicLoadingExtension.showLoading();
            FeedService.addSharedFeed(shareId, feedpassword).then(
                function () {
                    IonicLoadingExtension.hideLoading();
                    vm.loadSharedFeeds();
                    CommodityCache.clearCommodities();
                    vm.resetModel();
                },
                function (error) {
                    // Error
                    IonicLoadingExtension.hideLoading();
                    PopupExtension.showError("Unable to add sharedfeed: " + error);
                    ErrorStore.addError(error);
                });
        };

        vm.resetModel = function (){
            vm.shareId = null;
            vm.feedpassword = null;
        };

        vm.deleteSharedFeed = function (feedId) {

            IonicLoadingExtension.showLoading();
            FeedService.deleteFeed(feedId).then(
                function () {
                    IonicLoadingExtension.hideLoading();
                    vm.loadSharedFeeds();
                    vm.shareId = null;
                    vm.feedpassword = null;
                    CommodityCache.clearCommodities();
                },
                function (error) {
                    // Error
                    IonicLoadingExtension.hideLoading();
                    handleError("Unable to delete feed: ", error);
                });
        };

        vm.navigateToCommodityByFeedId = function (feedId) {
            ControllerNavigation.toCommoditiesByFeedId(feedId);
        };

        var handleError = function (message, error) {
            PopupExtension.showError("Ajaxerror: SharedFeedController: " + error);
            ErrorStore.addError(error);
        };

        vm.SharedFeedController = function () {
            console.log("SharedFeedController init");
            vm.loadSharedFeeds();
        };


    };

    var module = angular.module("whattobuy.controllers");
    module.controller("SharedFeedController", SharedFeedController);

}());