describe("Unittest.CommodityController: When getting commodities", function () {

    var $scope, $q, $timeout, $httpBackend, IonicLoadingExtension, CommodityRepository;

    var CommodityController, CommodityService, CommodityRepositoryGetCommoditySpy, LoginStore, FeedService;

    var beforeEachResponse = [
        { commodityGuid: 'aa738f8d26054233983296811620b5e3', isPurchased: false, lastUpdated: '2014-04-18T15:08:49', name: 'Pølse1337' }
    ];

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
            FeedService = $injector.get(serviceNames.FeedService);
            var userStore = $injector.get(dataproviderNames.UserStore);

            CommodityRepositoryGetCommoditySpy = spyOn(CommodityRepository, "getCommoditiesOrCached").and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(beforeEachResponse);
                return deferred.promise;
            });

            var UserStoreMock = {
                clearUserDetails: function () {
                },
                saveFeedId: function () {
                },
                getFeedpassword: function () {
                },
                saveFeedpassword: function () {
                },

                getFeedId: function () {
                    var userDetails = {
                        feedId: "myfeedId"
                    };
                    return userDetails;
                },
                hasFeedId: function () {
                    return true;
                }
            };
            expect(getMethods(UserStoreMock)).toEqual(getMethods(userStore));

            var mockFactory  = $injector.get(toolNames.MockFactory);
            var ErrorStoreMock = mockFactory.ErrorStoreMock;
            expect(getMethods(ErrorStoreMock)).toEqual(getMethods($injector.get(dataproviderNames.ErrorStore)));


            CommodityController = $controller("CommodityController", {
                $scope: $scope,
                UserStore: UserStoreMock,
                ErrorStore : ErrorStoreMock
            });

            LoginStore.clearLoginDetails();

            spyOn(IonicLoadingExtension, "hideLoading");
            spyOn(IonicLoadingExtension, "showLoading");

            spyOn(FeedService, "getFeedlist").and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve([
                    { feedId: 'abc0', name: 'Ikea2013'},
                    { feedId: 'mno1', name: 'Kiwi'}
                ]);
                return deferred.promise;
            });

        });
    });

    it("commodities should have been loaded on controller construction", function () {
        $httpBackend.whenGET(/^\w+.*/).respond("");

        CommodityController.CommodityController();

        $scope.$digest();
        $timeout.flush();

        expect(CommodityRepository.getCommoditiesOrCached.calls.any()).toEqual(true);
        expect(CommodityController.commodities).toEqual(beforeEachResponse);

        expect(IonicLoadingExtension.showLoading).toHaveBeenCalled();
        expect(IonicLoadingExtension.hideLoading).toHaveBeenCalled();

    });

    it("with force refresh commodities success", function () {

        var forceRefreshTrue = [
            { commodityGuid: 'aa738f8d26054233983296811620b5e3', isPurchased: false, lastUpdated: '2014-04-18T15:08:49', name: 'Pølse' }
        ];
        var forceRefreshFalse = {"commodityGuid": "0276fd665a2a4491ac01e158495fadbf", "isPurchased": false, "lastUpdated": "2014-04-18T15:08:49", "name": "Aiiight"};

        CommodityRepositoryGetCommoditySpy.and.callFake(function (forceRefresh) {
            var deferred = $q.defer();
            if (forceRefresh) {
                deferred.resolve(forceRefreshTrue);
            } else {
                deferred.resolve(forceRefreshFalse);
            }
            return deferred.promise;
        });

        try {
            CommodityController.loadCommodities("abc123", true);

            $httpBackend.whenGET(/^\w+.*/).respond("");

            $scope.$digest();
            $timeout.flush();

            expect(CommodityController.commodities).toEqual(forceRefreshTrue);
            expect(CommodityController.commodities).not.toEqual(forceRefreshFalse);
            expect(CommodityController.commodities).not.toEqual(beforeEachResponse);
            expect(IonicLoadingExtension.showLoading).toHaveBeenCalled();
            expect(IonicLoadingExtension.hideLoading).toHaveBeenCalled();
        }
        catch (err) {
            expect(err).toBeNull(err);
            console.log(err);
            console.log(err.stack);
            console.log(err.message);
        }
        ;
    });

    it("without refreshing commodities success", function () {
        spyOn(LoginStore, "hasLoginDetails").and.returnValue(true);

        var forceRefreshTrue = [
            { commodityGuid: 'aa738f8d26054233983296811620b5e3', isPurchased: false, lastUpdated: '2014-04-18T15:08:49', name: 'Pølse' }
        ];
        var forceRefreshFalse = {"commodityGuid": "0276fd665a2a4491ac01e158495fadbf", "isPurchased": false, "lastUpdated": "2014-04-18T15:08:49", "name": "Aiiight"};

        CommodityRepositoryGetCommoditySpy.and.callFake(function (forceRefresh) {
            var deferred = $q.defer();
            if (forceRefresh) {
                deferred.resolve(forceRefreshTrue);
            } else {
                deferred.resolve(forceRefreshFalse);
            }
            return deferred.promise;
        });

        try {
            CommodityController.loadCommodities(false);

            $scope.$digest();

            expect(CommodityController.commodities).toEqual(forceRefreshFalse);
            expect(CommodityController.commodities).not.toEqual(forceRefreshTrue);
            expect(CommodityController.commodities).not.toEqual(beforeEachResponse);
            expect(IonicLoadingExtension.showLoading).not.toHaveBeenCalled();
            expect(IonicLoadingExtension.hideLoading).not.toHaveBeenCalled();
        }
        catch (err) {
            expect(err).toBeNull(err);
            console.log(err);
            console.log(err.stack);
            console.log(err.message);
        }
        ;
    });


});