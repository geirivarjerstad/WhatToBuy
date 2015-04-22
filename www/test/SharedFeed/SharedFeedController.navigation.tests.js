describe("Unittest.SharedFeedController: When adding a feed", function () {

    var $scope, $q, $timeout, IonicLoadingExtensionMock, $httpBackend;

    var SharedFeedController, ControllerNavigationMock, PopupExtensionMock;

    var FeedServiceMock;

    beforeEach(function () {
        module("whattobuy");

        inject(function (_$q_, $rootScope, $injector, $controller, _$timeout_, _$httpBackend_) {

            $timeout = _$timeout_;
            $scope = $rootScope.$new();
            $q = _$q_;
            $httpBackend = _$httpBackend_;

            var mockFactory  = $injector.get(toolNames.MockFactory);
            FeedServiceMock = mockFactory.FeedServiceMock;
            IonicLoadingExtensionMock = mockFactory.IonicLoadingExtensionMock;
            PopupExtensionMock = mockFactory.PopupExtensionMock;
            ControllerNavigationMock = mockFactory.ControllerNavigationMock;

            spyOn(PopupExtensionMock, "showError");
            spyOn(IonicLoadingExtensionMock, "showLoading");
            spyOn(IonicLoadingExtensionMock, "hideLoading");

            SharedFeedController = $controller("SharedFeedController", {
                $scope: $scope,
                FeedService : FeedServiceMock,
                CommodityCache : mockFactory.CommodityCacheMock,
                IonicLoadingExtension : IonicLoadingExtensionMock,
                PopupExtension : PopupExtensionMock,
                ControllerNavigation : ControllerNavigationMock,
                ErrorStore : mockFactory.ErrorStoreMock
            });

            $httpBackend.whenGET(/^\w+.*/).respond("");
        });
    });

    it("should addSharedFeed successfully", function (   ) {

        spyOn(ControllerNavigationMock, "toCommoditiesByFeedId");

        var feedId = "Ikea";

        SharedFeedController.navigateToCommodityByFeedId(feedId);

        $scope.$digest();
        $timeout.flush();

        expect(ControllerNavigationMock.toCommoditiesByFeedId).toHaveBeenCalledWith(feedId);
    });


});