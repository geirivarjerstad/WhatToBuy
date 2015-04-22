describe("Unittest.CommodityController: When setting the selected feedId in the dropdown", function () {

    var $scope, $httpBackend, $timeout;

    var CommodityController, UserStore, PopupExtension;

    beforeEach(function () {
        module("whattobuy");

        inject(function ($rootScope, $controller, $injector) {

            $scope = $rootScope.$new();
            $httpBackend = $injector.get("$httpBackend");
            $timeout =   $injector.get("$timeout");
            UserStore = $injector.get(dataproviderNames.UserStore);
            PopupExtension = $injector.get(toolNames.PopupExtension);

            var mockFactory  = $injector.get(toolNames.MockFactory);
            var ErrorStoreMock = mockFactory.ErrorStoreMock;
            expect(getMethods(ErrorStoreMock)).toEqual(getMethods($injector.get(dataproviderNames.ErrorStore)));


            CommodityController = $controller("CommodityController", {
                $scope: $scope,
                ErrorStore : ErrorStoreMock
            });

            $httpBackend.whenGET(/^\w+.*/).respond("");

            spyOn(PopupExtension, "showError");

            spyOn(UserStore, "saveFeedId").and.callFake(function () {

            });
        });
    });


    it("should set it to the selected feedId from UserStore successfully", function () {

        CommodityController.selectedFeed = "abc1337";

        spyOn(UserStore, "hasFeedId").and.callFake(function () {
            return true;
        });
        spyOn(UserStore, "getFeedId").and.callFake(function () {
            return "nmo1";
        });

        CommodityController.feedList = [{ feedId : 'abc0', name : 'Ikea2013'}, { feedId : 'nmo1', name : 'Kiwi'}];
        CommodityController.setSelectedFeed();

        $scope.$digest();
        $timeout.flush();

        expect(CommodityController.selectedFeed).toBe(CommodityController.feedList[1]);
        expect(PopupExtension.showError).not.toHaveBeenCalled();
        expect(UserStore.saveFeedId).not.toHaveBeenCalled();

    });

    it("should set selected feedId to the first element in the FeedList if the UserStore is empty", function () {

        CommodityController.selectedFeed = "abc1337";

        spyOn(UserStore, "hasFeedId").and.callFake(function () {
            return false;
        });
        spyOn(UserStore, "getFeedId").and.callFake(function () {
            return "nmo1";
        });

        CommodityController.feedList = [{ feedId : 'abc0', name : 'Ikea2013'}, { feedId : 'nmo1', name : 'Kiwi'}];
        CommodityController.setSelectedFeed();

        $scope.$digest();
        $timeout.flush();

        expect(CommodityController.selectedFeed).toBe(CommodityController.feedList[0]);
        expect(PopupExtension.showError).not.toHaveBeenCalled();
        expect(UserStore.saveFeedId).toHaveBeenCalled();

    });

    it("should set selected feedId to the first element in the FeedList if the UserStore.FeedId is unknown", function () {

        CommodityController.selectedFeed = "abc1337";

        spyOn(UserStore, "hasFeedId").and.callFake(function () {
            return true;
        });
        spyOn(UserStore, "getFeedId").and.callFake(function () {
            return "ukjentFeedId";
        });

        CommodityController.feedList = [{ feedId : 'abc0', name : 'Ikea2013'}, { feedId : 'nmo1', name : 'Kiwi'}];
        CommodityController.setSelectedFeed();

        expect(CommodityController.selectedFeed).toBe(CommodityController.feedList[0]);
        expect(UserStore.saveFeedId).toHaveBeenCalled();
        expect(PopupExtension.showError).not.toHaveBeenCalled();

    });

    it("should show error if the FeedList is empty", function () {

        CommodityController.selectedFeed = "abc1337";

        spyOn(UserStore, "hasFeedId").and.callFake(function () {
            return true;
        });
        spyOn(UserStore, "getFeedId").and.callFake(function () {
            return "ukjentFeedId";
        });

        CommodityController.feedList = [];
        CommodityController.setSelectedFeed();

        expect(PopupExtension.showError).toHaveBeenCalled();

    });

});