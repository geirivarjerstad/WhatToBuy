describe("Unittest.FeedController: When delete a feed that is mine", function () {

    var $scope, $q, $timeout;

    var FeedController, FeedServiceMock, PopupExtension, IonicLoadingExtension, $httpBackend;

    beforeEach(function () {
        module("whattobuy");

        inject(function (_$q_, $rootScope, $injector, $controller, _$timeout_, _PopupExtension_, _IonicLoadingExtension_, _$httpBackend_) {
            $httpBackend = _$httpBackend_;
            $timeout = _$timeout_;
            $scope = $rootScope.$new();
            $q = _$q_;
            IonicLoadingExtension = _IonicLoadingExtension_;
            PopupExtension = _PopupExtension_;

            var mockFactory  = $injector.get(toolNames.MockFactory);

            spyOn(PopupExtension, "showError");
            spyOn(IonicLoadingExtension, "showLoading");
            spyOn(IonicLoadingExtension, "hideLoading");

            FeedServiceMock = mockFactory.FeedServiceMock;
            FeedController = $controller("FeedController", {
                $scope: $scope,
                FeedService : FeedServiceMock ,
                CommodityCache : mockFactory.CommodityCacheMock,
                ErrorStore : mockFactory.ErrorStoreMock
            });

            spyOn(FeedServiceMock, "getFeedlist").and.callThrough();

            $httpBackend.whenGET(/^\w+.*/).respond("");
            $httpBackend.flush();
        });
    });

    it("should delete a personal feed successfully", function (   ) {
        var feedId = "Ikea0001";

        spyOn(FeedServiceMock, "deleteFeed").and.callFake(function (feed) {
            var deferred = $q.defer();
            expect(feed).toEqual(feedId);
            deferred.resolve({isSuccess: true});
            return deferred.promise;
        });

        FeedController.deletePrivateFeed(feedId);

        $scope.$digest();
        $timeout.flush();

        expect(PopupExtension.showError).not.toHaveBeenCalled();
        expect(FeedController.newFeedName).toBeNull();

        expect(IonicLoadingExtension.showLoading.calls.count()).toEqual(2);
        expect(IonicLoadingExtension.hideLoading.calls.count()).toEqual(2);
    });

    it("should unsuccessfully delete a personal feed", function (   ) {
        var feedId = "Ikea0001";

        spyOn(FeedServiceMock, "deleteFeed").and.callFake(function (feed) {
            var deferred = $q.defer();
            expect(feed).toEqual(feedId);
            deferred.reject("Some reason!");
            return deferred.promise;
        });

        FeedController.deletePrivateFeed(feedId);

        $scope.$digest();
        $timeout.flush();

        expect(PopupExtension.showError).toHaveBeenCalled();
        expect(FeedController.newFeedName).toBeNull();

        expect(IonicLoadingExtension.showLoading.calls.count()).toEqual(1);
        expect(IonicLoadingExtension.hideLoading.calls.count()).toEqual(1);
    });

    it("the service throws an Error", function (   ) {
        var feedId = "Ikea0001";

        spyOn(FeedServiceMock, "deleteFeed").and.callFake(function (feed) {
            var deferred = $q.defer();
            expect(feed).toEqual(feedId);
            deferred.reject(new Error("Test error"));
            return deferred.promise;
        });

        FeedController.deletePrivateFeed(feedId);

        $scope.$digest();
        $timeout.flush();

        expect(PopupExtension.showError).toHaveBeenCalled();
        expect(FeedController.newFeedName).toBeNull();
        expect(IonicLoadingExtension.showLoading.calls.count()).toEqual(1);
        expect(IonicLoadingExtension.hideLoading.calls.count()).toEqual(1);
    });


});