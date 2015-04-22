describe('Unittest.FeedService: When saving a feed', function () {

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


    it('should successfully save a feed', function () {

        $httpBackend.whenPOST(/^\w+.*/).respond({isSuccess: true});

        var newFeed = {
            name: "Ikea 2014"
        };

        var result = FeedService.saveFeed(newFeed).then(
            function (data) {
                console.log("FeedService=>saveFeed=>onSuccess", data);
                var exptectedData = {isSuccess: true};
                expect(data).toEqual(exptectedData);
            },
            function (reason) {
                console.log("Ajaxerror: FeedService->saveFeed: " + reason);
                expect(reason).toBeNull();
            });
        result.finally(function () {
            wasDone = true;
        });

        // flush mock $httpBackend & promises
        $httpBackend.flush();
    });

    it('should fail to validate when new Feed Name is empty', function () {
        $httpBackend.whenPOST(/^\w+.*/).respond({isSuccess: true});

        var newFeed = {
            name: ""
        };

        var result = FeedService.saveFeed(newFeed).then(
            function (data) {
                expect(data).toBeNull();
            },
            function (reason) {
                console.log("Ajaxerror: FeedService->saveFeed: " + reason);
                expect(reason).not.toBeNull();
            });
        result.finally(function () {
            wasDone = true;
        });

        // flush mock $httpBackend & promises
        $httpBackend.flush();
    });

    it('should fail when server returns unsuccessfully', function () {

        $httpBackend.whenPOST(/^\w+.*/).respond({isSuccess: false});

        var newFeed = {
            name: "Wooty"
        };

        var result = FeedService.saveFeed(newFeed).then(
            function (data) {
                expect(data).toBeNull();
            },
            function (reason) {
                console.log("Ajaxerror: FeedService->saveFeed: " + reason);
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

        var newFeed = {
            name: "Wooty"
        };

        var result = FeedService.saveFeed(newFeed).then(
            function (data) {
                expect(data).toBeNull();
            },
            function (reason) {
                console.log("Ajaxerror: FeedService->saveFeed: " + reason);
                expect(reason).not.toBeNull();
            });
        result.finally(function () {
            wasDone = true;
        });

        // flush mock $httpBackend & promises
        $httpBackend.flush();
    });

});