describe("Unittest.CommodityController: When clicking a commodity", function () {

    var $scope, $q;

    var CommodityController, CommodityService, CommodityRepository, CommodityServiceSpy, PopupExtension;

    beforeEach(function () {
        module("whattobuy");

        inject(function (_$q_, $rootScope, $injector, $controller, _PopupExtension_) {

            $scope = $rootScope.$new();
            $q = _$q_;

            CommodityService = $injector.get(serviceNames.CommodityService);
            CommodityRepository = $injector.get(repositoryNames.CommodityRepository);
            PopupExtension = _PopupExtension_;

            spyOn(CommodityRepository, "getCommoditiesOrCached").and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve([{}]);
                return deferred.promise;
            });

            CommodityServiceSpy = spyOn(CommodityService, "saveCommodity");
            spyOn(PopupExtension, "showAlert");
            spyOn(PopupExtension, "showError");

            var mockFactory  = $injector.get(toolNames.MockFactory);
            var ErrorStoreMock = mockFactory.ErrorStoreMock;
            expect(getMethods(ErrorStoreMock)).toEqual(getMethods($injector.get(dataproviderNames.ErrorStore)));

            CommodityController = $controller("CommodityController", {
                $scope: $scope,
                ErrorStore : ErrorStoreMock
            });

            CommodityController.feedList = [{ feedId : 'abc0', name : 'Ikea2013'}, { feedId : 'nmo1', name : 'Kiwi'}];
            CommodityController.selectedFeed = CommodityController.feedList[0];
        });
    });

    it("should buy a commodity successfully", function () {

        var clickedCommodity = { commodityGuid : 'aa738f8d26054233983296811620b5e3', isPurchased : false, lastUpdated : '2014-04-18T15:08:49', name : 'Pølse' };
        var clonedClickedCommodity = { commodityGuid : 'aa738f8d26054233983296811620b5e3', isPurchased : true, lastUpdated : '2014-04-18T15:08:49', name : 'Pølse' };



        CommodityServiceSpy.and.callFake(function (feedId, commodity) {
            var deferred = $q.defer();
            expect(feedId).toEqual(CommodityController.selectedFeed.feedId);
            expect(commodity).toEqual(clonedClickedCommodity);
            deferred.resolve({isSuccess: true});
            return deferred.promise;
        });

        CommodityController.clickedCommodity(clickedCommodity);

        $scope.$digest();

        expect(clickedCommodity.isPurchased).toEqual(clonedClickedCommodity.isPurchased);
        expect(PopupExtension.showAlert).not.toHaveBeenCalled();
    });

   it("should buy a commodity UNsuccessfully", function () {

        var clickedCommodity = { commodityGuid : 'aa738f8d26054233983296811620b5e3', isPurchased : false, lastUpdated : '2014-04-18T15:08:49', name : 'Pølse' };
        var clonedClickedCommodity = { commodityGuid : 'aa738f8d26054233983296811620b5e3', isPurchased : true, lastUpdated : '2014-04-18T15:08:49', name : 'Pølse' };

        CommodityServiceSpy.and.callFake(function (feedId, commodity) {
            var deferred = $q.defer();
            expect(feedId).toEqual(CommodityController.selectedFeed.feedId);
            expect(commodity).toEqual(clonedClickedCommodity);
            deferred.reject("Oh noes!!");
            return deferred.promise;
        });
       CommodityController.clickedCommodity(clickedCommodity);

       $scope.$digest();

       expect(clickedCommodity.isPurchased).not.toEqual(clonedClickedCommodity.isPurchased);
       expect(PopupExtension.showError).toHaveBeenCalled();
    });

});