describe("Unittest.CommodityController: When force refreshing after inital load", function () {

    var $scope, $q, $timeout, $httpBackend, IonicLoadingExtension, CommodityRepository;

    var CommodityController, CommodityService, LoginStore, FeedServiceMock, initialFeedList, initialCommodityList;

    var CommodityRepositoryGetCommoditiesSpy, FeedServiceMockGetMyFeedListSpy, ControllerNavigationMock;

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
            CommodityRepository = $injector.get(repositoryNames.CommodityRepository);

            var mockFactory = $injector.get(toolNames.MockFactory);
            FeedServiceMock = mockFactory.FeedServiceMock;
            ControllerNavigationMock = mockFactory.ControllerNavigationMock;

            CommodityRepositoryGetCommoditiesSpy = spyOn(CommodityRepository, "getCommoditiesOrCached");
            FeedServiceMockGetMyFeedListSpy = spyOn(FeedServiceMock, "getFeedlist");
            var ErrorStoreMock = mockFactory.ErrorStoreMock;
            expect(getMethods(ErrorStoreMock)).toEqual(getMethods($injector.get(dataproviderNames.ErrorStore)));

            CommodityController = $controller("CommodityController", {
                $scope: $scope,
                FeedService: FeedServiceMock,
                ErrorStore: ErrorStoreMock,
                ControllerNavigation: ControllerNavigationMock
            });

            LoginStore.clearLoginDetails();

            spyOn(IonicLoadingExtension, "hideLoading");
            spyOn(IonicLoadingExtension, "showLoading");

            $httpBackend.whenGET(/^\w+.*/).respond("");

            initialCommodityList = [{
                commodityGuid: 'aa738f8d26054233983296811620b5e3',
                isPurchased: false,
                lastUpdated: '2014-04-18T15:08:49',
                name: 'Pølse1337'
            }];
            CommodityRepositoryGetCommoditiesSpy.and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(initialCommodityList);
                return deferred.promise;
            });

            initialFeedList = [{feedId: 'abc0', name: 'Ikea2013'}, {feedId: 'mno1', name: 'Kiwi'}];
            FeedServiceMockGetMyFeedListSpy.and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(initialFeedList);
                return deferred.promise;
            });

            CommodityController.refresh();

            $scope.$digest();
            $timeout.flush();
        });
    });

    it("should load intially successfully", function () {
        var vm = CommodityController;
        expect(vm.feedList).toEqual(initialFeedList);
        expect(vm.commodities).toEqual(initialCommodityList);
        expect(vm.selectedFeed).toEqual(initialFeedList[0]);
    });

    it("should force refresh successfully after initial load", function () {
        var commodityList = [{
            commodityGuid: 'aa738f8d26054233983296811620b5e3',
            isPurchased: false,
            lastUpdated: '2014-04-18T15:08:49',
            name: 'HeltNyttNavn'
        }];
        CommodityRepositoryGetCommoditiesSpy.and.callFake(function (feedId, forceRefresh) {
            expect(feedId).toBe(CommodityController.selectedFeed.feedId);
            expect(forceRefresh).toBe(true);
            var deferred = $q.defer();
            deferred.resolve(commodityList);
            return deferred.promise;
        });

        var feedList = [{feedId: 'qwer', name: 'Rema1000'}, {feedId: 'poiu', name: 'Møøø'}];
        FeedServiceMockGetMyFeedListSpy.and.callFake(function () {
            var deferred = $q.defer();
            deferred.resolve(feedList);
            return deferred.promise;
        });

        CommodityController.forceRefresh();

        $scope.$digest();
        $timeout.flush();

        expect(CommodityController.feedList).toEqual(feedList);
        expect(CommodityController.commodities).toEqual(commodityList);
        expect(CommodityController.selectedFeed).toEqual(feedList[0]);
    });

    it("should navigate to Feed if the Feedlist is empty", function () {

        var ControllerNavigationSpy = spyOn(ControllerNavigationMock, "toFeed");

        var feedList = [];
        FeedServiceMockGetMyFeedListSpy.and.callFake(function () {
            var deferred = $q.defer();
            deferred.resolve(feedList);
            return deferred.promise;
        });

        CommodityController.forceRefresh();

        $scope.$digest();
        $timeout.flush();

        expect(CommodityController.feedList).toEqual(feedList);
        expect(ControllerNavigationMock.toFeed).toHaveBeenCalled();
    });

});