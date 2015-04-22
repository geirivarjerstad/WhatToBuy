describe('Unittest.UserService: When calling UserService->createUser', function () {
    var $scope, $httpBackend;
    var UserService, ServerUrlStore, LoginService, LoginStore;
    var user;
    beforeEach(module('whattobuy'));

    beforeEach(inject(function ($rootScope, _$httpBackend_, $injector) {
        $scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        LoginService = $injector.get(serviceNames.LoginService);
        ServerUrlStore = $injector.get(dataproviderNames.ServerUrlStore);
        LoginStore = $injector.get(dataproviderNames.LoginStore);

    }));

    it('should make a mocked XHR GET for Authentication success', function () {
        $httpBackend.whenGET(/^\w+.*/).respond({isSuccess: true, userExists: true});

        var wasDone = false;
        LoginService.authenticate("asdasd", "asdasd").then(
            function (data) {
                console.log("LoginRepository=>authenticate=>onSuccess", data);
                expect(data).toEqual({isSuccess: true, userExists: true});
            },
            function (reason) {
                console.log("Ajaxerror: LoginRepository->authenticate: " + reason);
            }).then(function () {
                wasDone = true;
            });

        $httpBackend.flush();
        $scope.$digest();

        expect(wasDone).toBe(true);
    });

    it('should make a mocked XHR GET for Authentication fail', function () {
        $httpBackend.whenGET(/^\w+.*/).respond({isSuccess: false, userExists: false});

        var _err;
        try {
            var wasDone = false;
            LoginService.authenticate("asdasd", "asdasd").then(
                function (data) {
                    console.log("LoginRepository=>authenticate=>onSuccess", data);
                    expect(data).toEqual({isSuccess: true, userExists: true});
                },
                function (reason) {
                    console.log("Ajaxerror: LoginRepository->authenticate: " + reason);
                    _err = reason;
                }).then(function () {
                    wasDone = true;
                });

            $httpBackend.flush();
            $scope.$digest();
        }
        catch (err) {

        }
        expect(_err instanceof Error).toBeTruthy();
    });

});
