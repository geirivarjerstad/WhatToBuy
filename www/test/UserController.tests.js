describe("UserController", function () {

    function TestErrorException(message) {
        this.name = 'LoginStoreException';
        this.message= message;
        console.error(this.name + ": "+ message)
    }
    TestErrorException.prototype = new Error();
    TestErrorException.prototype.constructor = TestErrorException;

    var $scope, $q, $timeout, ControllerNavigation, deferred, $location, UserRepository, PopupExtension;

    var UserController, MockLoginStore, $state;

    beforeEach(function () {
        module("whattobuy");


        inject(function ($rootScope, $controller, _$q_, _$timeout_, _$state_, _$location_, _UserRepository_, _PopupExtension_, _ControllerNavigation_) {

            // create a scope object for us to use.
            $scope = $rootScope.$new();
            $timeout = _$timeout_;
            $state = _$state_;
            $location = _$location_;
            UserRepository = _UserRepository_;
            $q = _$q_;
            PopupExtension = _PopupExtension_;
            ControllerNavigation = _ControllerNavigation_;
            UserController = $controller("UserController", {
                $scope: $scope
            });

            spyOn($state, "go");
            spyOn($location, "path");
            spyOn(PopupExtension, "showError");

            spyOn(ControllerNavigation, "toCommoditiesOrFeed").and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            })
        });
    });


    it("test create a user successfully", function () {
        var vm = UserController;
        var username = "garg";
        var password = "asdasd";
        var email = "asd@asd.com";
        var user = { username : username, password : password, email : email};
        spyOn(UserRepository, "createUserAndLogin").and.callFake(function (data) {
            expect(data).toEqual(user);

            var deferred = $q.defer();
            deferred.resolve({isSuccess: true});
            return deferred.promise;
        });

        vm.createUserAndLogin(username, password, email);

        $scope.$digest();

        expect(vm.isCreateUserSuccess).toBeTruthy();
        expect(ControllerNavigation.toCommoditiesOrFeed).toHaveBeenCalled();
    });

    it("test create a user and fail", function () {
        var vm = UserController;
        var username = "garg";
        var password = "asdasd";
        var email = "asd@asd.com";
        var user = { username : username, password : password, email : email};
        spyOn(UserRepository, "createUserAndLogin").and.callFake(function (data) {
            expect(data).toEqual(user);

            var deferred = $q.defer();
            deferred.reject(new TestErrorException("Some reason!"));
            return deferred.promise;
        });

        vm.createUserAndLogin(username, password, email);

        $scope.$digest();

        expect(vm.isCreateUserSuccess).toBeFalsy();
        expect(vm.error.message).toEqual("Some reason!");
        expect($location.path).not.toHaveBeenCalledWith("/commodities");
        expect(PopupExtension.showError).toHaveBeenCalled();

    });

    it("test contructor init", function () {
        var vm = UserController;
        expect(vm.username).toBeDefined();
        expect(vm.password).toBeDefined();
        expect(vm.email).toBeDefined();

        expect(vm.username).toBeNull();
        expect(vm.password).toBeNull();
        expect(vm.email).toBeNull();
    });


});