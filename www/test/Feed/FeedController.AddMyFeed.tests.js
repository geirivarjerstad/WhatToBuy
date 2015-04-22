describe("Unittest.FeedController: When adding a feed", function () {

    var $scope, $q, $timeout, IonicLoadingExtension, $httpBackend;

    var FeedController, FeedService, FeedRepository, PopupExtension, LoginStore;

    var FeedServiceMock;

    beforeEach(function () {
        module("whattobuy");

        inject(function (_$q_, $rootScope, $injector, $controller, _$timeout_, _PopupExtension_, _IonicLoadingExtension_, _$httpBackend_) {

            $timeout = _$timeout_;
            $scope = $rootScope.$new();
            $q = _$q_;
            $httpBackend = _$httpBackend_;
            IonicLoadingExtension = _IonicLoadingExtension_;
            PopupExtension = _PopupExtension_;
            LoginStore = $injector.get(dataproviderNames.LoginStore);

            FeedService = $injector.get(serviceNames.FeedService);
            FeedRepository = $injector.get(repositoryNames.FeedRepository);

            LoginStore.clearLoginDetails();

            var mockFactory  = $injector.get(toolNames.MockFactory);
            FeedServiceMock = mockFactory.FeedServiceMock;

            spyOn(PopupExtension, "showError");
            spyOn(IonicLoadingExtension, "showLoading");
            spyOn(IonicLoadingExtension, "hideLoading");

            FeedController = $controller("FeedController", {
                $scope: $scope,
                FeedService : FeedServiceMock,
                CommodityCache : mockFactory.CommodityCacheMock,
                ErrorStore : mockFactory.ErrorStoreMock
            });

            expect(FeedController.newFeedName).toBeNull();

            $httpBackend.whenGET(/^\w+.*/).respond("");
        });
    });

    it("should add a personal feed successfully", function (   ) {

        var newName = "Ikea";
        var afterAddedFeed = { name: newName };

        spyOn(FeedServiceMock, "saveFeed").and.callFake(function (feed) {
            var deferred = $q.defer();
            expect(feed).toEqual(afterAddedFeed);
            deferred.resolve({isSuccess: true});
            return deferred.promise;
        });
        spyOn(FeedServiceMock, "getPrivateFeedlist").and.callThrough();

        FeedController.addFeed(newName);

        $scope.$digest();
        $timeout.flush();

        expect(PopupExtension.showError).not.toHaveBeenCalled();
        expect(FeedController.newFeedName).toBeNull();
        // once in the constructor init and second after call to "addFeed"
        expect(FeedServiceMock.getPrivateFeedlist.calls.count()).toEqual(1);

        expect(IonicLoadingExtension.showLoading.calls.count()).toEqual(2);
        expect(IonicLoadingExtension.hideLoading.calls.count()).toEqual(2);
    });

    it("should unsuccessfully add a personal feed", function (   ) {

        var newName = "Ikea";
        var afterAddedFeed = { name: newName };

        spyOn(FeedServiceMock, "saveFeed").and.callFake(function (feed) {
            var deferred = $q.defer();
            expect(feed).toEqual(afterAddedFeed);
            deferred.reject("Some reason!");
            return deferred.promise;
        });
        spyOn(FeedServiceMock, "getPrivateFeedlist").and.callThrough();

        FeedController.addFeed(newName);

        $scope.$digest();
        $timeout.flush();

        expect(PopupExtension.showError).toHaveBeenCalled();
        expect(FeedController.newFeedName).toBeNull();
        expect(FeedServiceMock.getPrivateFeedlist.calls.count()).toEqual(0);

        expect(IonicLoadingExtension.showLoading.calls.count()).toEqual(1);
        expect(IonicLoadingExtension.hideLoading.calls.count()).toEqual(1);
    });


});