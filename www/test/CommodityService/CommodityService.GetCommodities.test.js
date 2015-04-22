describe('myApp', function () {
    it('should simulate promise', inject(function ($q, $rootScope) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        var resolvedValue;

        promise.then(function (value) {
            resolvedValue = value;
        });
        expect(resolvedValue).toBeUndefined();

        // Simulate resolving of promise
        deferred.resolve(123);
        // Note that the 'then' function does not get called synchronously.
        // This is because we want the promise API to always be async, whether or not
        // it got called synchronously or asynchronously.
        expect(resolvedValue).toBeUndefined();

        // Propagate promise resolution to 'then' functions using $apply().
        $rootScope.$apply();
        expect(resolvedValue).toEqual(123);
    }));
});

describe("Asynchronous specs", function () {
    var value = 0;

    function funcRunInBackground() {
        value = 1;
    };

    function wrapFuncRunInBackground(done) {
        // setup for simmulating the async operation, a function run in the background
        setTimeout(function () {
            funcRunInBackground();
            done();
        }, 3000);
    }

    beforeEach(function (done) {
        wrapFuncRunInBackground(done);
        console.log("wrap function returns immediately but value = 1 is set 3 seconds later. value is still " + value);
    });


    it("should support async execution of test preparation", function () {
        expect(value).toBeGreaterThan(0);
    });
});

describe('Unittest.CommodityService: When getting commodities', function () {

    var scope, $httpBackend, $http, LoginService, ServerUrlStore, CommodityService, CommodityCache, LoginStore, $timeout, $rootScope, LoginStore;

//    var mockCommoditiesFromServer = [
//        {"commodityGuid": "aa738f8d26054233983296811620b5e3", "name": "Pølse", "isPurchased": false, "lastUpdated": "2014-04-18T15:08:49", "LastUpdated1337": "\/Date(1411825804185+0200)\/"}
////            {"commodityGuid": "c1ecb4ea7a7643d4bcad06de1f78ea9a", "name": "Pølse2", "isPurchased": false, "lastUpdated": "2014-04-18T15:08:49", "LastUpdated1337": "\/Date(1411825804185+0200)\/"},
////            {"commodityGuid": "d60dbec301574ac6a13b1ad9d956d339", "name": "Pølsefest", "isPurchased": false, "lastUpdated": "2014-04-18T15:08:49", "LastUpdated1337": "\/Date(1411825804185+0200)\/"},
////            {"commodityGuid": "d9976b29fc4146fd81e4551927ea99f6", "name": "Ppøøø", "isPurchased": false, "lastUpdated": "2014-04-18T15:08:49", "LastUpdated1337": "\/Date(1411825804185+0200)\/"},
////            {"commodityGuid": "0276fd665a2a4491ac01e158495fadbf", "name": "Aiiight", "isPurchased": false, "lastUpdated": "2014-04-18T15:08:49", "LastUpdated1337": "\/Date(1411825804185+0200)\/"},
////            {"commodityGuid": "04390dded548405b8829fc1c8c399c83", "name": "bøøø", "isPurchased": false, "lastUpdated": "2014-04-18T15:08:49", "LastUpdated1337": "\/Date(1411825804185+0200)\/"},
////            {"commodityGuid": "231aa0a91d1b47fe9bb6556363dbf773", "name": "okok", "isPurchased": false, "lastUpdated": "2014-04-18T15:08:49", "LastUpdated1337": "\/Date(1411825804185+0200)\/"},
////            {"commodityGuid": "6b6f551ea96944c9b336fd2d406412e1", "name": "kult!", "isPurchased": false, "lastUpdated": "2014-04-18T15:08:49", "LastUpdated1337": "\/Date(1411825804185+0200)\/"}
//    ];

    beforeEach(module('whattobuy'));

    beforeEach(inject(function (_$httpBackend_, $injector, _$http_, _$timeout_, _$rootScope_) {
        $httpBackend = _$httpBackend_;
        $http = _$http_;
        $timeout = _$timeout_;
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();


        LoginService = $injector.get(serviceNames.LoginService);
        ServerUrlStore = $injector.get(dataproviderNames.ServerUrlStore);
        CommodityService = $injector.get(serviceNames.CommodityService);
        LoginStore = $injector.get(dataproviderNames.LoginStore);
        CommodityCache = $injector.get(dataproviderNames.CommodityCache);
        LoginStore = $injector.get(dataproviderNames.LoginStore);


    }));

    it('should successfully return a list of commodities', function () {
        spyOn(ServerUrlStore, 'getServerUrlOrDefault').and.returnValue("An URL!");
        spyOn(LoginStore, 'getLoginDetails').and.returnValue("the login details!");
        spyOn(CommodityCache, 'getCommodities').and.returnValue(null);
        spyOn(CommodityCache, 'saveCommodities').and.returnValue(null);

        var mockCommoditiesFromServer = [
            {"commodityGuid": "aa738f8d26054233983296811620b5e3", "name": "Pølse", "isPurchased": false, "lastUpdated": "2014-04-18T15:08:49", "LastUpdated1337": "\/Date(1411825804185+0200)\/"}
        ];

        $httpBackend.whenGET(/^\w+.*/).respond(mockCommoditiesFromServer);
        var wasDone = false;

        var feedId = "abcd";
        CommodityService.getCommodities(feedId).then(
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
            });

        $httpBackend.flush();
        scope.$apply();
        $timeout.flush();
    });

    it('should fail return a list of commodities if feedId is not defined', function () {
        spyOn(ServerUrlStore, 'getServerUrlOrDefault').and.returnValue("An URL!");
        spyOn(LoginStore, 'getLoginDetails').and.returnValue("the login details!");
        spyOn(CommodityCache, 'getCommodities').and.returnValue(null);
        spyOn(CommodityCache, 'saveCommodities').and.returnValue(null);

        var mockCommoditiesFromServer = [
            {"commodityGuid": "aa738f8d26054233983296811620b5e3", "name": "Pølse", "isPurchased": false, "lastUpdated": "2014-04-18T15:08:49", "LastUpdated1337": "\/Date(1411825804185+0200)\/"}
        ];

        $httpBackend.whenGET(/^\w+.*/).respond(mockCommoditiesFromServer);
        var wasDone = false;

        CommodityService.getCommodities().then(
            function (data) {
                expect(data).toBeNull();

            },
            function (reason) {
                console.log("Ajaxerror: CommodityService->getCommodities: " + reason);
                expect(reason).not.toBeNull();
                expect(reason instanceof Error).toBeTruthy();
            });

        $httpBackend.flush();
        scope.$apply();
        $timeout.flush();
    });



});