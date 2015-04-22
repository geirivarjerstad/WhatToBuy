describe('Unittest.FeedService: When getting my own feeds', function () {

    var $httpBackend, LoginService, ServerUrlStore, FeedService, LoginStore, $scope, UserStore;
    var wasDone = false;
    beforeEach(module('whattobuy'));

    beforeEach(inject(function ($rootScope, _$httpBackend_, $injector) {
        $scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        LoginService = $injector.get(serviceNames.LoginService);
        ServerUrlStore = $injector.get(dataproviderNames.ServerUrlStore);
        FeedService = $injector.get(serviceNames.FeedService);
        LoginStore = $injector.get(dataproviderNames.LoginStore);
        UserStore = $injector.get(dataproviderNames.UserStore);

        spyOn(ServerUrlStore, 'getServerUrlOrDefault').and.returnValue("myurl/");
        spyOn(LoginStore, 'getLoginDetails').and.returnValue({ username: 'minhandleliste', password: 'yup' });

        spyOn(UserStore, 'getFeedpassword').and.returnValue("bac123");

        wasDone = false;
    }));

    afterEach((function () {
        expect(wasDone).toBe(true); // confirm callBacks were called
    }));


    it('should successfully get my own feeds', function () {

        var feedList = [
            { name: "ikea2014", feedId: "abc1002"},
            { name: "Kiwi", feedId: "1337"},
            { name: "middag", feedId: "0569"}
        ];
        var feedListClone = angular.copy(feedList);

        $httpBackend.whenGET(/^\w+.*/).respond(feedList);

        var result = FeedService.getFeedlist().then(
            function (data) {
                console.log("Test: FeedService=>getFeedlist=>onSuccess", data);
                expect(data).toEqual(feedListClone);
            },
            function (reason) {
                console.log("Test: Ajaxerror: FeedService->getFeedlist: " + reason);
                expect(reason).toBeNull();
            });
        result.finally(function () {
            wasDone = true;
        });

        $httpBackend.flush();
    });

    it('should throw Error to validate if the server is responding with invalid fields', function () {
        var feedList = [
            { name: "ikea2014", feedId: "abc1002"},
            { name: "Kiwi", feedId: "1337"},
            { name: "middag"}
        ];

        $httpBackend.whenGET(/^\w+.*/).respond(feedList);

        var result = FeedService.getFeedlist().then(
            function (data) {
                console.log("Test: FeedService=>getFeedlist=>onSuccess", data);
                expect(data).toBeNull();
            },
            function (reason) {
                console.log("Test: Ajaxerror: FeedService->getFeedlist: " + reason);
                expect(reason).not.toBeNull();
            });
        result.finally(function () {
            wasDone = true;
        });

        $httpBackend.flush();
    });

    it('should fail when server throws 401 error', function () {

        $httpBackend.whenGET(/myurl.*/).respond(function (method, url, data, headers) {
            console.log('Received these data:', method, url, data, headers);
            return [401, "Yarrr!", {}];
        });
        $httpBackend.whenGET(/^\w+.*/).respond();

        var result = FeedService.getFeedlist().then(
            function (data) {
                console.log("Test: FeedService=>getFeedlist=>onSuccess", data);
                expect(data).toBeNull();
            },
            function (reason) {
                console.log("Test: Ajaxerror: FeedService->getFeedlist: " + reason);
                expect(reason).not.toBeNull();
                expect(reason.name).toEqual("FeedServiceException");
            });
        result.finally(function () {
            wasDone = true;
        });

        $scope.$digest();

        $httpBackend.flush();
        });

    });