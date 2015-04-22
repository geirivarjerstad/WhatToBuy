describe('Unittest.UserService: When calling UserService->createUser', function () {
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

        var username = "garg";
        var password = "asdasd";
        var email = "asd@asd.com";

        user = { username: username, password: password, email: email};
    }));

    it('should successfully create a user', function () {

        spyOn(ServerUrlStore, 'getServerUrlOrDefault').and.returnValue("An URL!");
        spyOn(LoginStore, 'getLoginDetails').and.returnValue({ username: 'garg1337', password: 'yup' });

        $httpBackend.whenGET(/^\w+.*/).respond("");
        $httpBackend.whenPOST(/^\w+.*/).respond({isSuccess: true, feedpassword : "abc1234"});

        var wasDone = false;
        var result = UserService.createUser(user).then(
            function (data) {
                console.log("UserService=>createUser=>onSuccess", data);
                expect(data).toEqual({isSuccess: true, feedpassword : "abc1234"});
            },
            function (reason) {
                console.log("Ajaxerror: UserService->createUser: " + reason);
                expect(reason).toBeNull();
            }).then(function () {
                wasDone = true;
            });

        // flush mock $httpBackend & promises
        $httpBackend.flush();
        $scope.$digest();

        expect(wasDone).toBe(true); // confirm callBacks were called
    });

    it('should fail if the server returns incorrect data', function () {

        spyOn(ServerUrlStore, 'getServerUrlOrDefault').and.returnValue("An URL!");
        spyOn(LoginStore, 'getLoginDetails').and.returnValue({ username: 'garg1337', password: 'yup' });

        $httpBackend.whenGET(/^\w+.*/).respond("");
        $httpBackend.whenPOST(/^\w+.*/).respond({incorrectData: true});

        var wasDone = false;

        var result = UserService.createUser(user).then(
            function (data) {
                console.log("UserService=>createUser=>onSuccess", data);
                expect(data).toBeNull();
            },
            function (reason) {
                console.log("Ajaxerror: UserService->createUser: " + reason);

                var jsonErr = JSON.stringify(reason);
                var expectedError = JSON.stringify({ name : 'UserServiceException', message : 'UserServiceException=>mapToDomain: \'data.isSuccess\' was null ' });
                expect(jsonErr).toEqual(expectedError);

            }).finally(function () {
                wasDone = true;
            });

        // flush mock $httpBackend & promises
        $httpBackend.flush();
        $scope.$digest();

        expect(wasDone).toBe(true); // confirm callBacks were called
    });

    it('should reject promise if creation was unsuccessfull', function () {

        spyOn(ServerUrlStore, 'getServerUrlOrDefault').and.returnValue("An URL!");
        spyOn(LoginStore, 'getLoginDetails').and.returnValue({ username: 'garg1337', password: 'yup' });

        $httpBackend.whenGET(/^\w+.*/).respond("");
        $httpBackend.whenPOST(/^\w+.*/).respond({isSuccess: false});

        var wasDone = false;

        var result = UserService.createUser(user).then(
            function (data) {
                expect(data).toBeNull();
                console.log("UserService=>createUser=>onSuccess", data);
            },
            function (reason) {
                console.log("Ajaxerror: UserService->createUser: " + reason);
                expect(reason).not.toBeNull();
            }).finally(function () {
                wasDone = true;
            });

        // flush mock $httpBackend & promises
        $httpBackend.flush();
        $scope.$digest();

        expect(wasDone).toBe(true); // confirm callBacks were called
    });

});