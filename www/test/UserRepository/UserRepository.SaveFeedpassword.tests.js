describe("UserRepository: When updating the feedpassword", function () {

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

    it("should update feedpassword localstore successfully", function () {

        var feedpassword = "abc1234";
        spyOn(UserService, "saveFeedpassword").and.callFake(function (data) {
            expect(data).toEqual(feedpassword);

            var deferred = $q.defer();
            deferred.resolve({isSuccess: true});
            return deferred.promise;
        });

        UserRepository.saveFeedpassword(feedpassword).then(function (data) {
            expect(data.isSuccess).toBe(true);
        });

        $scope.$digest();

        expect(UserService.saveFeedpassword).toHaveBeenCalledWith(feedpassword);
        expect(UserStore.saveFeedpassword).toHaveBeenCalledWith(feedpassword);
    });

    it("should fail to update feedpassword", function () {

        var feedpassword = "abc1234";
        spyOn(UserService, "saveFeedpassword").and.callFake(function (data) {
            expect(data).toEqual(feedpassword);

            var deferred = $q.defer();
            deferred.resolve({isSuccess: false});
            return deferred.promise;
        });

        UserRepository.saveFeedpassword(feedpassword).then(function (data) {
            expect(data.isSuccess).toBe(false);
        });

        $scope.$digest();

        expect(UserService.saveFeedpassword).toHaveBeenCalledWith(feedpassword);
        expect(UserStore.saveFeedpassword).not.toHaveBeenCalledWith(feedpassword);
    });

    it("should fail to update feedpassword upon server exception", function () {

        var feedpassword = "abc1234";
        spyOn(UserService, "saveFeedpassword").and.callFake(function (data) {
            expect(data).toEqual(feedpassword);

            var deferred = $q.defer();
            deferred.reject(new Error("Whoop"));
            return deferred.promise;
        });

        var _error;
        UserRepository.saveFeedpassword(feedpassword).catch(function (error) {
            _error = error;
        });

        $scope.$digest();

        expect(_error instanceof Error).toBeTruthy();
        expect(UserService.saveFeedpassword).toHaveBeenCalledWith(feedpassword);
        expect(UserStore.saveFeedpassword).not.toHaveBeenCalledWith(feedpassword);
    });


});
