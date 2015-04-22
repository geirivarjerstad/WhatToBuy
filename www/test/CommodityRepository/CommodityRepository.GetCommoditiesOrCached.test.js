describe('Unittest.CommodityRepositoryOrCached: When getting commodities', function () {

    var $q, $scope, $httpBackend, $http, $timeout, $rootScope;
    var CommodityRepository, CommodityService, CommodityCache;

    beforeEach(module('whattobuy'));

    beforeEach(inject(function ($rootScope, _$q_, _$httpBackend_, $injector) {
        $scope = $rootScope.$new();
        $q = _$q_;
        $httpBackend = _$httpBackend_;


        CommodityCache = $injector.get(dataproviderNames.CommodityCache);
        CommodityService = $injector.get(serviceNames.CommodityService);

        CommodityRepository = $injector.get(repositoryNames.CommodityRepository);

    }));

    it('should successfully return a list of commodities', function () {
        spyOn(CommodityCache, 'getCommodities').and.returnValue(null);
        spyOn(CommodityCache, 'saveCommodities').and.returnValue(null);

        spyOn(CommodityService, 'getCommodities').and.callFake(function () {
            var deferred = $q.defer();
            var exptectedData = [{ commodityGuid : 'aa738f8d26054233983296811620b5e3', isPurchased : false, lastUpdated : '2014-04-18T15:08:49', name : 'Pølse' }];
            deferred.resolve(exptectedData);
            return deferred.promise;
        });

        var wasDone = false;

        CommodityRepository.getCommoditiesOrCached().then(
            function (data) {
                console.log("CommodityService=>getCommodities=>onSuccess", data);
                var exptectedData = [
                    { commodityGuid: 'aa738f8d26054233983296811620b5e3', isPurchased: false, lastUpdated: '2014-04-18T15:08:49', name: 'Pølse' }
                ];
                expect(data).toEqual(exptectedData);
            },
            function (reason) {
                console.log("Ajaxerror: CommodityService->getCommodities: " + reason);
                expect(reason).toBeNull();
            }).finally(function () {
                wasDone = true;
            });

        $scope.$digest();


        try {
        }
        catch (err) {
            expect(err).toBeNull(err);
            throw err;
        }

        expect(CommodityService.getCommodities).toHaveBeenCalled();
        expect(wasDone).toBeTruthy();
    });

    it('should successfully return a list of cached commodities', function () {

        var cachedData = [
            { commodityGuid: 'aa738f8d26054233983296811620b5e3', isPurchased: false, lastUpdated: '2014-04-18T15:08:49', name: 'Pølse' }
        ];

        spyOn(CommodityCache, 'getCommodities').and.returnValue(cachedData);

        var wasDone = false;

        var onSuccess = function (data) {
            console.log("CommodityService=>getCommodities=>onSuccess", data);
            expect(data).toEqual(cachedData);
        };

        var onError = function (reason) {
            console.log("Ajaxerror: CommodityService->getCommodities: " + reason);
            expect(reason).toBeNull();
        };

        var onFinally = function () {
            wasDone = true;
        };


        var result = CommodityRepository.getCommoditiesOrCached().then(onSuccess, onError).finally(onFinally);

        $scope.$digest();

        expect(wasDone).toBe(true); // confirm callBacks were called
    });


    it('should successfully force refresh cached commodities with new', function () {

        var oldCachedData = [
            { commodityGuid: 'aa738f8d26054233983296811620b5e3', isPurchased: false, lastUpdated: '2014-04-18T15:08:49', name: 'Pølse' }
        ];
        var newCachedData = [
            { commodityGuid: 'd60dbec301574ac6a13b1ad9d956d339', isPurchased: true, lastUpdated: '1980-04-02T15:08:49', name: 'Pølsefest' }
        ];
        var mockCommoditiesFromServer = [
            {"commodityGuid": "d60dbec301574ac6a13b1ad9d956d339", "name": "Pølsefest", "isPurchased": true, "lastUpdated": "1980-04-02T15:08:49", "LastUpdated1337": "\/Date(1411825804185+0200)\/"}
        ];

        spyOn(CommodityCache, 'getCommodities').and.returnValue(oldCachedData);
        spyOn(CommodityCache, 'saveCommodities').and.returnValue(null);

        spyOn(CommodityService, 'getCommodities').and.callFake(function () {
            var deferred = $q.defer();
            deferred.resolve(newCachedData);
            return deferred.promise;
        });

        var wasDone = false;

        var onSuccess = function (data) {
            console.log("CommodityService=>getCommodities=>onSuccess", data);
            expect(data).not.toEqual(oldCachedData);
            expect(data).toEqual(newCachedData);
        };

        var onError = function (reason) {
            console.log("Ajaxerror: CommodityService->getCommodities: " + reason);
            expect(reason).toBeNull();
        };

        var forceRefresh = true;
        var feedId = "abc123";
        var result = CommodityRepository.getCommoditiesOrCached(feedId, forceRefresh).then(onSuccess, onError)

        result.finally(function () {
            wasDone = true;
        });

        $scope.$digest();

        expect(wasDone).toBe(true); // confirm callBacks were called
    });

    it('should successfully force refresh cached commodities with new when no cache exist', function () {
        var oldCachedData = [
            { commodityGuid: 'aa738f8d26054233983296811620b5e3', isPurchased: false, lastUpdated: '2014-04-18T15:08:49', name: 'Pølse' }
        ];
        var newCachedData = [
            { commodityGuid: 'd60dbec301574ac6a13b1ad9d956d339', isPurchased: true, lastUpdated: '1980-04-02T15:08:49', name: 'Pølsefest' }
        ];
        var mockCommoditiesFromServer = [
            {"commodityGuid": "d60dbec301574ac6a13b1ad9d956d339", "name": "Pølsefest", "isPurchased": true, "lastUpdated": "1980-04-02T15:08:49", "LastUpdated1337": "\/Date(1411825804185+0200)\/"}
        ];

        spyOn(CommodityService, 'getCommodities').and.callFake(function () {
            var deferred = $q.defer();
            deferred.resolve(newCachedData);
            return deferred.promise;
        });


        spyOn(CommodityCache, 'getCommodities').and.returnValue(null);
        spyOn(CommodityCache, 'saveCommodities').and.returnValue(null);

        var wasDone = false;

        var onSuccess = function (data) {
            console.log("CommodityService=>getCommodities=>onSuccess", data);
            expect(CommodityCache.saveCommodities).toHaveBeenCalled();
            expect(data).not.toEqual(oldCachedData);
            expect(data).toEqual(newCachedData);
        };

        var onError = function (reason) {
            console.log("Ajaxerror: CommodityService->getCommodities: " + reason);
            expect(reason).toBeNull();
        };

        var forceRefresh = true;
        var feedId = "abc123";
        var result = CommodityRepository.getCommoditiesOrCached(feedId, forceRefresh).then(onSuccess, onError)

        result.finally(function () {
            wasDone = true;
        });

        // flush mock $httpBackend & promises
        $scope.$digest();

        expect(wasDone).toBe(true); // confirm callBacks were called
    });

});