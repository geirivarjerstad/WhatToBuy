(function () {

    function CommodityControllerException(message) {
        this.name = 'CommodityControllerException';
        this.message= message;
        console.error(this.name + ": "+ message)
    }
    CommodityControllerException.prototype = new Error();
    CommodityControllerException.prototype.constructor = CommodityControllerException;
    
    var CommodityController = function ($scope, $q, CommodityService, CommodityRepository, PopupExtension, IonicLoadingExtension, $timeout, FeedService, UserStore, ErrorStore, ControllerNavigation) {

        var vm = this;
        vm.newCommodityName = null;
        vm.selectedFeed = null;
        vm.feedList = null;

        vm.loadCommodities = function (feedId, forceRefresh) {

            if (forceRefresh) {
                IonicLoadingExtension.showLoading();
            }
            CommodityRepository.getCommoditiesOrCached(feedId, forceRefresh).then(
                function (data) {
                    if (forceRefresh) {
                        $timeout(function () {
                            IonicLoadingExtension.hideLoading();
                        }, 200);
                    }
                    vm.commodities = data;
                },
                function (error) {
                    IonicLoadingExtension.hideLoading();
                    PopupExtension.showError(error.message);
                    ErrorStore.addError(error);
                })
        };

        vm.clickedCommodity = function (commodity) {
            console.info(commodity);
            console.log(commodity.commodityGuid);
            var commodityClone = angular.copy(commodity);
            commodityClone.isPurchased = !commodityClone.isPurchased;

            IonicLoadingExtension.showLoading();
            CommodityService.saveCommodity(vm.selectedFeed.feedId, commodityClone).then(
                function () {
                    // Success
                    IonicLoadingExtension.hideLoading();
                    commodity.isPurchased = commodityClone.isPurchased;
                },
                function (error) {
                    // Error
                    IonicLoadingExtension.hideLoading();
                    PopupExtension.showError(error);
                    ErrorStore.addError(error);
                });
        };

        vm.addCommodity = function (newCommodityName) {
            var deferred = $q.defer();
            var commodity = {
                name: newCommodityName,
                isPurchased: false
            };
            IonicLoadingExtension.showLoading();
            CommodityService.saveCommodity(vm.selectedFeed.feedId, commodity).then(
                function () {
                    IonicLoadingExtension.hideLoading();
                    vm.loadCommodities(vm.selectedFeed.feedId, true);
                    vm.newCommodityName = null;
                    deferred.resolve();
                },
                function (error) {
                    // Error
                    IonicLoadingExtension.hideLoading();
                    PopupExtension.showError("Error: CommodityController=>addCommodity", error);
                    ErrorStore.addError(error);
                    deferred.reject();
                });

            return deferred.promise;
        };

        vm.setSelectedFeed = function () {
            if (UserStore.hasFeedId()) {
                var feedId = UserStore.getFeedId();
                for (var i = 0; i < vm.feedList.length; i++) {
                    if (vm.feedList[i].feedId == feedId) {
                        vm.selectedFeed = vm.feedList[i];
                        return;
                    }
                }
            }

            if (vm.feedList.length > 0) {
                vm.selectedFeed = vm.feedList[0];
                UserStore.saveFeedId(vm.selectedFeed);
                return;
            }

            var error = new CommodityControllerException("Error when trying to set selectedFeed");
            PopupExtension.showError(error);
            ErrorStore.addError(error);

        };

        vm.loadSharedFeeds = function () {
            var deferred = $q.defer();
            IonicLoadingExtension.showLoading();

            FeedService.getFeedlist().then(
                function (data) {
                    $timeout(function () {
                        vm.feedList = data;
                        deferred.resolve();
                        IonicLoadingExtension.hideLoading();
                    }, 200);
                },
                function (error) {
                    // Error
                    vm.error = error;
                    IonicLoadingExtension.hideLoading();
                    console.error("Ajaxerror: CommodityController->loadMyFeeds: " + JSON.stringify(error));
                    PopupExtension.showError("Unable to load feed: ", error);
                    ErrorStore.addError(error);
                    deferred.reject();
                });
            return deferred.promise;
        };

        vm.feedDropdownChange = function () {
            UserStore.saveFeedId(vm.selectedFeed.feedId);
            vm.setSelectedFeed();
            vm.loadCommodities(vm.selectedFeed.feedId, true);
        };

        vm.forceRefresh = function () {
            vm.refresh(true);
        };

        vm.refresh = function (forceRefresh) {
            vm.loadSharedFeeds().then(function () {
                if(vm.feedList.length == 0){
                    PopupExtension.showAlert("Du må lage en handleliste først");
                    ControllerNavigation.toFeed();
                    return;
                }
                vm.setSelectedFeed();
                vm.loadCommodities(vm.selectedFeed.feedId, forceRefresh);
            });
        };

        vm.CommodityController = function () {
            console.log("CommodityController init");
            vm.refresh();
        };

    };

    var module = angular.module("whattobuy.controllers");
    module.controller("CommodityController", CommodityController);

}());