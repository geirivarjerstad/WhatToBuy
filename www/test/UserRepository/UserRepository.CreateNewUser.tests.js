describe("UserRepository: When creating new a user", function () {

    var $scope, $q, UserService, LoginRepository, $injector;

    var UserRepository, LoginStore, UserStore;

    beforeEach(function () {
        module("whattobuy");

        inject(function ($rootScope, _$injector_) {
            $scope = $rootScope.$new();

            $injector = _$injector_;

            $q = $injector.get('$q');
            UserRepository = $injector.get(repositoryNames.UserRepository);
            LoginRepository = $injector.get(repositoryNames.LoginRepository);
            UserService = $injector.get(serviceNames.UserService);
            LoginStore =  $injector.get(dataproviderNames.LoginStore);
            UserStore =  $injector.get(dataproviderNames.UserStore);
            spyOn(LoginStore, "saveLoginDetails");
            spyOn(UserStore, "saveFeedpassword");

        });
    });

    it("should create a new user and login successfully", function () {
        var username = "garg";
        var password = "asdasd";
        var email = "asd@asd.com";
        var user = { username : username, password : password, email : email};

        spyOn(UserService, "createUser").and.callFake(function (data) {
            expect(data).toEqual(user);

            var deferred = $q.defer();
            deferred.resolve({isSuccess: true, feedpassword : "abc1234"});
            return deferred.promise;
        });

        try {
            UserRepository.createUserAndLogin(user).then(function (data) {
                expect(data.isSuccess).toBe(true);

                expect(UserService.createUser).toHaveBeenCalledWith(user);
                expect(LoginStore.saveLoginDetails).toHaveBeenCalledWith(user.username, user.password);
                expect(UserStore.saveFeedpassword).toHaveBeenCalledWith("abc1234");

            });

            $scope.$digest();
        }
        catch (err) {
            expect(err).toBeNull(err);
            throw err;
        }

    });

    it("should fail if server returns unsuccessfully when creating user", function () {
        var username = "garg";
        var password = "asdasd";
        var email = "asd@asd.com";
        var user = { username : username, password : password, email : email};

        spyOn(UserService, "createUser").and.callFake(function (data) {
            expect(data).toEqual(user);

            var deferred = $q.defer();
            deferred.resolve({isSuccess: false});
            return deferred.promise;
        });

        try {
            UserRepository.createUserAndLogin(user).then(function (data) {
                expect(data).toBeNull();
            }).then(function (reason) {
                expect(reason).not.toBeNull();
            });

            $scope.$digest();

            expect(LoginStore.saveLoginDetails).not.toHaveBeenCalled();
        }
        catch (err) {
            expect(err).toBeNull(err);
            throw err;
        }
    });

    it("should fail if there is an exception with the UserService", function () {
        var username = "garg";
        var password = "asdasd";
        var email = "asd@asd.com";
        var user = { username : username, password : password, email : email};

        spyOn(UserService, "createUser").and.callFake(function (data) {
            expect(data).toEqual(user);

            var deferred = $q.defer();
            deferred.reject("for some reason!");
            return deferred.promise;
        });

        try {
            UserRepository.createUserAndLogin(user).then(function (data) {
                expect(data).toBeNull();
            }).then(function (reason) {
                expect(reason).not.toBeNull();
            });

            $scope.$digest();

            expect(LoginStore.saveLoginDetails).not.toHaveBeenCalled();
        }
        catch (err) {
            expect(err).toBeNull(err);
            throw err;
        }
    });

});
