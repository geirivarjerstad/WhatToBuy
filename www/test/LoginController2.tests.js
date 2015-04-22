describe("LoginController", function () {

    var $scope, MockLoginStore, deferred;

    var LoginController, MockLoginRepository;

    beforeEach(function () {
        module("whattobuy");

        inject(function ($rootScope, $controller, $q, _$timeout_) {

            $scope = $rootScope.$new();

            MockLoginRepository = {
                authenticate: function () {
                    deferred = $q.defer();
                    return deferred.promise;
                }
            };
            MockLoginStore = {
                hasLoginDetails: function () { return false }
            };

            var MockControllerNavigation = {
            };

            LoginController = $controller("LoginController", {
                $scope: $scope,
                LoginStore: MockLoginStore,
                LoginRepository: MockLoginRepository,
                ControllerNavigation: MockControllerNavigation
            });
        });
    });

    it("test contructor init when we DO NOT have logindetails", function () {

        var vm = LoginController;
        expect(vm.username).toEqual("");
        expect(vm.password).toEqual("");

    });

});