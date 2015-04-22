describe("Unittest.SharedFeedController: When adding a feed", function () {

    var $scope, $q, $timeout, IonicLoadingExtensionMock, $httpBackend;

    var SharedFeedController, FeedService, FeedRepository, PopupExtensionMock, LoginStore;

    var FeedServiceMock;

    beforeEach(function () {
        module("whattobuy");

        inject(function (_$q_, $rootScope, $injector, $controller, _$timeout_, _$httpBackend_) {

            $timeout = _$timeout_;
            $scope = $rootScope.$new();
            $q = _$q_;
            $httpBackend = _$httpBackend_;
            LoginStore = $injector.get(dataproviderNames.LoginStore);

            FeedService = $injector.get(serviceNames.FeedService);
            FeedRepository = $injector.get(repositoryNames.FeedRepository);

            LoginStore.clearLoginDetails();

            var mockFactory  = $injector.get(toolNames.MockFactory);
            FeedServiceMock = mockFactory.FeedServiceMock;
            IonicLoadingExtensionMock = mockFactory.IonicLoadingExtensionMock;
            PopupExtensionMock = mockFactory.PopupExtensionMock;

            spyOn(PopupExtensionMock, "showError");
            spyOn(IonicLoadingExtensionMock, "showLoading");
            spyOn(IonicLoadingExtensionMock, "hideLoading");

            SharedFeedController = $controller("SharedFeedController", {
                $scope: $scope,
                FeedService : FeedServiceMock,
                CommodityCache : mockFactory.CommodityCacheMock,
                IonicLoadingExtension : IonicLoadingExtensionMock,
                PopupExtension : PopupExtensionMock,
                ErrorStore : mockFactory.ErrorStoreMock
            });

            $httpBackend.whenGET(/^\w+.*/).respond("");
        });
    });

    it("should addSharedFeed successfully", function (   ) {

        var shareId = "Ikea";
        var feedpassword = "ch56";

        spyOn(FeedServiceMock, "addSharedFeed").and.callFake(function (shareId, feedpassword) {
            var deferred = $q.defer();
            expect(shareId).toEqual(shareId);
            expect(feedpassword).toEqual(feedpassword);
            deferred.resolve({isSuccess: true});
            return deferred.promise;
        });

        SharedFeedController.addSharedFeed(shareId, feedpassword);

        $scope.$digest();
        $timeout.flush();

        expect(PopupExtensionMock.showError).not.toHaveBeenCalled();

        expect(IonicLoadingExtensionMock.showLoading.calls.count()).toEqual(2);
        expect(IonicLoadingExtensionMock.hideLoading.calls.count()).toEqual(2);

        expect(SharedFeedController.shareId).toBeNull();
        expect(SharedFeedController.feedpassword).toBeNull();
    });

    //it("should unsuccessfully add a personal feed", function (   ) {
    //
    //    var newName = "Ikea";
    //    var afterAddedFeed = { name: newName };
    //
    //    spyOn(FeedServiceMock, "saveFeed").and.callFake(function (feed) {
    //        var deferred = $q.defer();
    //        expect(feed).toEqual(afterAddedFeed);
    //        deferred.reject("Some reason!");
    //        return deferred.promise;
    //    });
    //    spyOn(FeedServiceMock, "getPrivateFeedlist").and.callThrough();
    //
    //    SharedFeedController.addFeed(newName);
    //
    //    $scope.$digest();
    //    $timeout.flush();
    //
    //    expect(PopupExtensionMock.showError).toHaveBeenCalled();
    //    expect(FeedServiceMock.getPrivateFeedlist.calls.count()).toEqual(0);
    //
    //    expect(IonicLoadingExtensionMock.showLoading.calls.count()).toEqual(1);
    //    expect(IonicLoadingExtensionMock.hideLoading.calls.count()).toEqual(1);
    //});


});