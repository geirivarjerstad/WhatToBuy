describe('Unittest.CommodityService: When saving a commodity', function () {

    var $httpBackend, $http, LoginService, ServerUrlStore, CommodityService, LoginStore;

    beforeEach(module('whattobuy'));

    beforeEach(inject(function (_$httpBackend_, _LoginService_, _ServerUrlStore_, _CommodityService_, _LoginStore_, _$http_) {
        $httpBackend = _$httpBackend_;
        LoginService = _LoginService_;
        ServerUrlStore = _ServerUrlStore_;
        CommodityService = _CommodityService_;
        LoginStore = _LoginStore_;
        $http = _$http_;
    }));

    it('should successfully save a commodity', function () {

        spyOn(ServerUrlStore, 'getServerUrlOrDefault').and.returnValue("An URL!");
        spyOn(LoginStore, 'getLoginDetails').and.returnValue({ username: 'minhandleliste', password: 'yup' });

        var mockedResponseFromServer = {isSuccess: true, feedIdExists: true};

        $httpBackend.whenGET(/^\w+.*/).respond("");
        $httpBackend.whenPOST(/^\w+.*/).respond(mockedResponseFromServer);
        var wasDone = false;

        var onSuccess = function (data) {
            console.log("CommodityService=>saveCommodity=>onSuccess", data);
            var exptectedData =
                {isSuccess: true, feedIdExists: true}
                ;
            expect(data).toEqual(exptectedData);
        };

        var onError = function (reason) {
            console.log("Ajaxerror: CommodityService->saveCommodity: " + reason);
            expect(reason).toBeNull();
        };
        var newCommodity = {
            name: "Taco!",
            isPurchased: false,
            commodityGuid: "6b6f551ea96944c9b336fd2d406412e1"
        };
        var result;
        var feedId = "asdv";
        try {
            var result = CommodityService.saveCommodity(feedId, newCommodity).then(onSuccess, onError);
            result.finally(function () {
                wasDone = true;
            });

            // flush mock $httpBackend & promises
            $httpBackend.flush();

            expect(wasDone).toBe(true); // confirm callBacks were called
        }
        catch (err) {
            expect(err).toBeNull(err);
            console.log(err);
            console.error(err.stack);
        }
        ;

    });

    it('should fail when new Commodity Name is not set', function () {
        spyOn(ServerUrlStore, 'getServerUrlOrDefault').and.returnValue("An URL!");
        spyOn(LoginStore, 'getLoginDetails').and.returnValue({ username: 'minhandleliste', password: 'yup' });

        var mockedResponseFromServer = {isSuccess: true, feedIdExists: true};

        $httpBackend.whenGET(/^\w+.*/).respond("");
        $httpBackend.whenPOST(/^\w+.*/).respond(mockedResponseFromServer);
        var wasDone = false;

        var onSuccess = function (data) {
            console.log("CommodityService=>saveCommodity=>onSuccess", data);
            var exptectedData = {isSuccess: true, feedIdExists: true};
            expect(data).toEqual(exptectedData);
        };

        var onError = function (reason) {
            console.log("Ajaxerror: CommodityService->saveCommodity: " + reason);

            var jsonErr = JSON.stringify(reason);
            var expectedError = JSON.stringify({ name: 'CommodityServiceException', message: 'name was null' });
            console.error(reason);
            expect(jsonErr).toEqual(expectedError);
        };
        var newCommodity = {
            name: "",
            isPurchased: false,
            commodityGuid: "6b6f551ea96944c9b336fd2d406412e1"
        };
        var result;
        var feedId = "asd123";
        try {
            var result = CommodityService.saveCommodity(feedId, newCommodity).then(onSuccess, onError);
            result.finally(function () {
                wasDone = true;
            });

            // flush mock $httpBackend & promises
            $httpBackend.flush();

            expect(wasDone).toBe(true); // confirm callBacks were called
        }
        catch (err) {
            console.log(err);
            console.error(err.stack);
            expect(err).toBeNull();
        }
        ;

    });


    it('should show loading icon when saving commodity successfully', function () {
        spyOn(ServerUrlStore, 'getServerUrlOrDefault').and.returnValue("mockserver.no/");
        spyOn(LoginStore, 'getLoginDetails').and.returnValue({ username: 'minhandleliste', password: 'yup' });


        var mockedResponseFromServer = {isSuccess: true, feedIdExists: true};

        $httpBackend.whenGET(/^\w+.*/).respond("");
        $httpBackend.whenPOST(/^\w+.*/).respond(function (method, url, data, headers) {
            console.log('Received these data:', method, url, data, headers);
            return [200, {isSuccess: true}, {}];
        });

        var wasDone = false;

        var onSuccess = function (data) {

        };

        var onError = function (reason) {
            expect(reason).toBeNull();
        };

        var newCommodity = {
            name: "Sjokkis!",
            isPurchased: false,
            commodityGuid: "6b6f551ea96944c9b336fd2d406412e1"
        };

        var result;
        var feedId = "asdv";
        try {
            var result = CommodityService.saveCommodity(feedId, newCommodity).then(onSuccess, onError);
            result.finally(function () {
                wasDone = true;
            });

            // flush mock $httpBackend & promises
            $httpBackend.flush();

            expect(wasDone).toBe(true); // confirm callBacks were called
        }
        catch (err) {
            expect(err).toBeNull();
        }
        ;

    });

    it('should show loading icon when saving commodity with failure', function () {
        spyOn(ServerUrlStore, 'getServerUrlOrDefault').and.returnValue("mockserver.no/");
        spyOn(LoginStore, 'getLoginDetails').and.returnValue({ username: 'minhandleliste', password: 'yup' });

        var mockedResponseFromServer = {isSuccess: true, feedIdExists: true};

        $httpBackend.whenGET(/^\w+.*/).respond("");
        $httpBackend.whenPOST(/^\w+.*/).respond(function (method, url, data, headers) {
            console.log('Received these data:', method, url, data, headers);
            return [200, {isSuccess: false}, {}];
        });

        var wasDone = false;

        var onSuccess = function (data) {
            expect(data).toBeNull();
        };

        var onError = function (reason) {
            expect(reason).not.toBeNull();

        };

        var newCommodity = {
            name: "Sjokkis!",
            isPurchased: false,
            commodityGuid: "6b6f551ea96944c9b336fd2d406412e1"
        };

        var result;
        var feedId = "asdv";
        try {
            var result = CommodityService.saveCommodity(feedId, newCommodity).then(onSuccess, onError);
            result.finally(function () {
                wasDone = true;
            });

            // flush mock $httpBackend & promises
            $httpBackend.flush();

            expect(wasDone).toBe(true); // confirm callBacks were called
        }
        catch (err) {
            expect(err).toBeNull();
        }
        ;

    });

    it('should show loading icon when saving commodity and fail with 401 error', function () {
        spyOn(ServerUrlStore, 'getServerUrlOrDefault').and.returnValue("mockserver.no/");
        spyOn(LoginStore, 'getLoginDetails').and.returnValue({ username: 'minhandleliste', password: 'yup' });


        var mockedResponseFromServer = {isSuccess: true, feedIdExists: true};

        $httpBackend.whenGET(/^\w+.*/).respond("");
        var reason401 = "Arrr, my matey";
        $httpBackend.whenPOST(/^\w+.*/).respond(function (method, url, data, headers) {
            console.log('Received these data:', method, url, data, headers);
            return [401, reason401, {}];
        });

        var wasDone = false;

        var newCommodity = {
            name: "Sjokkis!",
            isPurchased: false,
            commodityGuid: "6b6f551ea96944c9b336fd2d406412e1"
        };

        var result;
        var feedId = "asdv";
        try {
            var result = CommodityService.saveCommodity(feedId, newCommodity).then(
                function (data) {
                    expect(data).toBeNull();

                },
                function (reason) {
                    expect(reason instanceof Error).toBeTruthy();
                    expect(reason.message).toEqual("Servererror: Arrr, my matey");

                });
            result.finally(function () {
                wasDone = true;
            });

            // flush mock $httpBackend & promises
            $httpBackend.flush();

            expect(wasDone).toBe(true); // confirm callBacks were called
        }
        catch (err) {
            expect(err).toBeNull();
        }
        ;

    });

});