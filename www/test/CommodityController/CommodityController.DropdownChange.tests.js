describe("Unittest.CommodityController: When changing feedId from the dropdown", function () {

    var $scope, $q, $timeout, $httpBackend, IonicLoadingExtension;

    var CommodityController, CommodityService, LoginStore, FeedServiceMock, UserStoreMock, CommodityRepositoryMock;

    var CommodityRepositoryGetCommoditiesSpy, FeedServiceMockGetMyFeedListSpy;

    beforeEach(function () {
        module("whattobuy");

        inject(function (_$q_, $rootScope, $controller, $injector, _IonicLoadingExtension_) {

            $scope = $rootScope.$new();
            $q = _$q_;
            IonicLoadingExtension = _IonicLoadingExtension_;
            $timeout = $injector.get("$timeout");
            $httpBackend = $injector.get("$httpBackend");
            LoginStore = $injector.get(dataproviderNames.LoginStore);
            CommodityService = $injector.get(serviceNames.CommodityService);

            var mockFactory  = $injector.get(toolNames.MockFactory);

            CommodityRepositoryMock = {
                getCommoditiesOrCached: function () {

                }
            };

            UserStoreMock = mockFactory.UserStoreMock;
            expect(getMethods(UserStoreMock)).toEqual(getMethods($injector.get(dataproviderNames.UserStore)));


            FeedServiceMock = mockFactory.FeedServiceMock;
            expect(getMethods(FeedServiceMock)).toEqual(getMethods($injector.get(serviceNames.FeedService)));

            var ErrorStoreMock = mockFactory.ErrorStoreMock;
            expect(getMethods(ErrorStoreMock)).toEqual(getMethods($injector.get(dataproviderNames.ErrorStore)));

            CommodityController = $controller("CommodityController", {
                $scope: $scope,
                FeedService: FeedServiceMock,
                UserStore : UserStoreMock,
                CommodityRepository : CommodityRepositoryMock,
                ErrorStore : ErrorStoreMock
            });


//            CommodityRepositoryGetCommoditiesSpy = spyOn(CommodityRepositoryMock, "getCommoditiesOrCached");
            FeedServiceMockGetMyFeedListSpy = spyOn(FeedServiceMock, "getFeedlist");

            LoginStore.clearLoginDetails();

            spyOn(IonicLoadingExtension, "hideLoading");
            spyOn(IonicLoadingExtension, "showLoading");

            $httpBackend.whenGET(/^\w+.*/).respond("");

            $scope.$digest();
            $timeout.flush();
        });
    });

    it("should update selected feedId", function () {

        CommodityController.feedList = [{ feedId : 'yolo', name : 'Rema1000'}, { feedId : 'poiu', name : 'Møøø'}];
        CommodityController.selectedFeed = CommodityController.feedList[0];
        var vm = CommodityController;
        spyOn(UserStoreMock, "hasFeedId").and.callFake(function () {
            return true;
        });
        spyOn(UserStoreMock, "getFeedId").and.callFake(function () {
            return "poiu";
        });
        spyOn(UserStoreMock, "saveFeedId").and.callFake(function () {
        });

        spyOn(CommodityRepositoryMock, "getCommoditiesOrCached").and.callFake(function () {
            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        });

//        CommodityRepositoryGetCommoditiesSpy.and.callFake(function (feedId, forceRefresh) {
//           expect(feedId).toBe(vm.selectedFeed.feedId);
//           expect(forceRefresh).toBeTruthy();
//        });

        CommodityController.feedDropdownChange();

        $scope.$digest();
        $timeout.flush();

        expect(UserStoreMock.saveFeedId).toHaveBeenCalled();
        expect(CommodityRepositoryMock.getCommoditiesOrCached).toHaveBeenCalled();
        expect(CommodityController.selectedFeed.feedId).toBe(CommodityController.feedList[1].feedId);

    });


});