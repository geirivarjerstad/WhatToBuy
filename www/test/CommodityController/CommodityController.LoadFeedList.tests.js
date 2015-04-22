describe("Unittest.CommodityController: Upon Controller creation the FeedList", function () {

    var $scope, $q, $timeout, $httpBackend, IonicLoadingExtension, CommodityRepository;

    var CommodityController, CommodityService, CommodityRepositoryGetCommoditySpy, LoginStore, FeedServiceMock;

    var beforeEachResponse = [{ commodityGuid : 'aa738f8d26054233983296811620b5e3', isPurchased : false, lastUpdated : '2014-04-18T15:08:49', name : 'Pølse1337' }];

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

            var mockFactory  = $injector.get(toolNames.MockFactory);

            FeedServiceMock = mockFactory.FeedServiceMock;
            expect(getMethods(FeedServiceMock)).toEqual(getMethods($injector.get(serviceNames.FeedService)));

            CommodityRepositoryGetCommoditySpy = spyOn(CommodityRepository, "getCommoditiesOrCached").and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(beforeEachResponse);
                return deferred.promise;
            });

            var ErrorStoreMock = mockFactory.ErrorStoreMock;
            expect(getMethods(ErrorStoreMock)).toEqual(getMethods($injector.get(dataproviderNames.ErrorStore)));

            CommodityController = $controller("CommodityController", {
                $scope: $scope,
                FeedService: FeedServiceMock,
                ErrorStore : ErrorStoreMock
            });

            LoginStore.clearLoginDetails();

            spyOn(IonicLoadingExtension, "hideLoading");
            spyOn(IonicLoadingExtension, "showLoading");

            $httpBackend.whenGET(/^\w+.*/).respond("");
        });
    });

    it("should be populated successfully", function () {

        spyOn(FeedServiceMock, "getFeedlist").and.callFake(function () {
            var deferred = $q.defer();
            deferred.resolve([{ feedId : 'abc0', name : 'Ikea2013'}, { feedId : 'mno1', name : 'Kiwi'}]);
            return deferred.promise;
        });

        var vm = CommodityController;
        CommodityController.loadSharedFeeds();

        $scope.$digest();
        $timeout.flush();

        expect(vm.feedList).not.toBeNull();
        expect(vm.feedList.length).toBe(2);

        expect(IonicLoadingExtension.showLoading).toHaveBeenCalled();
        expect(IonicLoadingExtension.hideLoading).toHaveBeenCalled();

    });

    it("fails to load feedlist", function () {

        spyOn(FeedServiceMock, "getFeedlist").and.callFake(function () {
            var deferred = $q.defer();
            deferred.reject(new Error("Hummhumm"));
            return deferred.promise;
        });

        var vm = CommodityController;
        CommodityController.loadSharedFeeds();

        $scope.$digest();
        $timeout.flush();

        expect(vm.feedList).toBeNull();

        expect(IonicLoadingExtension.showLoading).toHaveBeenCalled();
        expect(IonicLoadingExtension.hideLoading).toHaveBeenCalled();

    });

});