describe("Unittest.FeedController: When getting my own feeds", function () {

    var $scope, $q, $timeout;

    var FeedController, FeedServiceMock, PopupExtension, IonicLoadingExtension, $httpBackend;

    beforeEach(function () {
        module("whattobuy");

        inject(function (_$q_, $rootScope, $injector, $controller, _$timeout_, _PopupExtension_, _IonicLoadingExtension_, _$httpBackend_) {

            $timeout = _$timeout_;
            $scope = $rootScope.$new();
            $q = _$q_;
            $httpBackend = _$httpBackend_;
            IonicLoadingExtension = _IonicLoadingExtension_;
            PopupExtension = _PopupExtension_;

            var mockFactory  = $injector.get(toolNames.MockFactory);
            FeedServiceMock = mockFactory.FeedServiceMock;
            expect(getMethods(FeedServiceMock)).toEqual(getMethods($injector.get(serviceNames.FeedService)));

            var CommodityCacheMock = mockFactory.CommodityCacheMock;
            expect(getMethods(CommodityCacheMock)).toEqual(getMethods($injector.get(dataproviderNames.CommodityCache)));

            spyOn(PopupExtension, "showError");
            spyOn(IonicLoadingExtension, "showLoading");
            spyOn(IonicLoadingExtension, "hideLoading");

            FeedController = $controller("FeedController", {
                $scope: $scope,
                FeedService : FeedServiceMock,
                CommodityCache : CommodityCacheMock,
                ErrorStore : mockFactory.ErrorStoreMock
            });

            expect(FeedController.newFeedName).toBeNull();
            expect(FeedController.error).toBeUndefined();

            $httpBackend.whenGET(/^\w+.*/).respond("");
        });
    });


    it("should get my own feeds successfully", function (   ) {

        var feedList = [
            { name : "ikea2014"},
            { name : "Kiwi"},
            { name : "middag"}
        ];

        spyOn(FeedServiceMock, "getPrivateFeedlist").and.callFake(function () {
            var deferred = $q.defer();
            deferred.resolve(feedList);
            return deferred.promise;
        });

        FeedController.loadPrivateFeeds();

        $scope.$digest();
        $timeout.flush();

        expect(FeedController.error).toBeUndefined();
        expect(PopupExtension.showError).not.toHaveBeenCalled();

        expect(FeedServiceMock.getPrivateFeedlist.calls.count()).toEqual(1);
        expect(FeedController.feedList).toEqual(feedList);

        expect(IonicLoadingExtension.showLoading.calls.count()).toEqual(1);
        expect(IonicLoadingExtension.hideLoading.calls.count()).toEqual(1);
    });

    it("should fail if the call to server was unsuccessfully", function () {

        spyOn(FeedServiceMock, "getPrivateFeedlist").and.callFake(function () {
            var deferred = $q.defer();
            deferred.reject("Yarr reason!");
            return deferred.promise;
        });

        FeedController.loadPrivateFeeds();

        $scope.$digest();
        $timeout.flush();

        expect(FeedController.error).not.toBeUndefined();
        expect(PopupExtension.showError).toHaveBeenCalled();

        expect(FeedController.feedList).toBeUndefined();

        expect(IonicLoadingExtension.showLoading.calls.count()).toEqual(1);
        expect(IonicLoadingExtension.hideLoading.calls.count()).toEqual(1);
    });
});