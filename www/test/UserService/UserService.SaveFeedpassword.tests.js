describe('Unittest.UserService: When calling UserService->saveFeedpassword', function () {
    var $scope, $httpBackend;
    var UserService, ServerUrlStore, LoginStore;
    var user;
    beforeEach(module('whattobuy'));

    beforeEach(inject(function ($rootScope, _$httpBackend_, $injector) {
        $scope =  $rootScope.$new();
        $httpBackend = _$httpBackend_;
        UserService = $injector.get(serviceNames.UserService);
        ServerUrlStore = $injector.get(dataproviderNames.ServerUrlStore);
        LoginStore = $injector.get(dataproviderNames.LoginStore);

        spyOn(ServerUrlStore, 'getServerUrlOrDefault').and.returnValue("An URL!");
        spyOn(LoginStore, 'getLoginDetails').and.returnValue({ username: 'garg1337', password: 'yup' });
    }));

    it('should successfully update the feedpassword', function () {

        $httpBackend.whenGET(/^\w+.*/).respond("");
        $httpBackend.whenPOST(/^\w+.*/).respond({isSuccess: true});

        var wasDone = false;
        var feedpassword = "abc1234";
        var result = UserService.saveFeedpassword(feedpassword).then(
            function (data) {
                console.log("UserService=>createUser=>onSuccess", data);
                expect(data).toEqual({isSuccess: true});
            },
            function (reason) {
                console.log("Ajaxerror: UserService->createUser: " + reason);
                expect(reason).toBeNull();
            }).then(function () {
                wasDone = true;
            });

        $httpBackend.flush();
        $scope.$digest();

        expect(wasDone).toBe(true);
    });


});