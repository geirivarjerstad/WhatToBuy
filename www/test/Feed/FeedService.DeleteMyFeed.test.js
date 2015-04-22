describe('Unittest.FeedService: When deleting a personal feed', function () {

    var $httpBackend, LoginService, ServerUrlStore, FeedService, LoginStore;
    var wasDone = false;
    beforeEach(module('whattobuy'));

    beforeEach(inject(function (_$httpBackend_, $injector) {
        $httpBackend = _$httpBackend_;
        LoginService = $injector.get(serviceNames.LoginService);
        ServerUrlStore = $injector.get(dataproviderNames.ServerUrlStore);
        FeedService = $injector.get(serviceNames.FeedService);
        LoginStore = $injector.get(dataproviderNames.LoginStore);

        $httpBackend.whenGET(/^\w+.*/).respond("");
        spyOn(ServerUrlStore, 'getServerUrlOrDefault').and.returnValue("An URL!");
        spyOn(LoginStore, 'getLoginDetails').and.returnValue({ username: 'minhandleliste', password: 'yup' });

        wasDone = false;
    }));

    afterEach((function () {
        expect(wasDone).toBe(true); // confirm callBacks were called
    }));


    it('should successfully delete a feed', function () {

        $httpBackend.whenPOST(/^\w+.*/).respond({isSuccess: true});

        var feedId = "Ikea 2014";

        var result = FeedService.deleteFeed(feedId).then(
            function (data) {
                console.log("FeedService=>deleteFeed=>onSuccess", data);
                var exptectedData = {isSuccess: true};
                expect(data).toEqual(exptectedData);
            },
            function (reason) {
                console.log("Ajaxerror: FeedService->deleteFeed: " + reason);
                expect(reason).toBeNull();
            });
        result.finally(function () {
            wasDone = true;
        });

        // flush mock $httpBackend & promises
        $httpBackend.flush();
    });

    it('should reject if not successfully deleting a feed', function () {

        $httpBackend.whenPOST(/^\w+.*/).respond({isSuccess: false});

        var feedId = "Ikea 2014";

        var result = FeedService.deleteFeed(feedId).then(
            function (data) {
                console.log("FeedService=>deleteFeed=>onSuccess", data);
                expect(data).toBeNull();
            },
            function (reason) {
                console.log("Ajaxerror: FeedService->deleteFeed: " + reason);
                expect(reason).not.toBeNull();
            });
        result.finally(function () {
            wasDone = true;
        });

        // flush mock $httpBackend & promises
        $httpBackend.flush();
    });

    it('should fail to validate when new FeedId is empty', function () {
        $httpBackend.whenPOST(/^\w+.*/).respond({isSuccess: true});

        var feedId = null;

        var result = FeedService.deleteFeed(feedId).then(
            function (data) {
                console.log("FeedService=>deleteFeed=>onSuccess", data);
                expect(data).toBeNull();
            },
            function (reason) {
                console.log("Ajaxerror: FeedService->deleteFeed: " + reason);
                expect(reason).not.toBeNull();
            });
        result.finally(function () {
            wasDone = true;
        });

        // flush mock $httpBackend & promises
        $httpBackend.flush();
    });

    it('should fail when server throws 401 error', function () {

        $httpBackend.whenPOST(/^\w+.*/).respond(function(method, url, data, headers){
            console.log('Received these data:', method, url, data, headers);
            return [401, "Yarrr!", {}];
        });

        var feedId = null;

        var result = FeedService.deleteFeed(feedId).then(
            function (data) {
                console.log("FeedService=>deleteFeed=>onSuccess", data);
                expect(data).toBeNull();
            },
            function (reason) {
                console.log("Ajaxerror: FeedService->deleteFeed: " + reason);
                expect(reason).not.toBeNull();
            });
        result.finally(function () {
            wasDone = true;
        });

        // flush mock $httpBackend & promises
        $httpBackend.flush();
    });

});