describe("LoginController", function () {

    var $scope, $q, $timeout, MockLoginRepository, deferred;

    var PopupExtension;
    var LoginController, MockLoginStore, MockUserStore, MockCommodityCache, MockControllerNavigation, MockFeedService;

    beforeEach(function () {
        module("whattobuy");


        inject(function ($httpBackend, $rootScope, $controller, $injector, _$timeout_) {

            // create a scope object for us to use.
            $scope = $rootScope.$new();

            $timeout = _$timeout_;
            PopupExtension = $injector.get(toolNames.PopupExtension);
            $q = $injector.get("$q");

            MockLoginRepository = {
                authenticate: function () {
                    deferred = $q.defer();
                    return deferred.promise;
                }
            };

            MockCommodityCache = {
                clearCommodities: function () {
                }
            };

            MockUserStore = {
                clearUserDetails: function () {
                }
            };

            MockLoginStore = {
                saveLoginDetails: function () {
                },
                getLoginDetails: function () {
                    return {"username": "feedME!", "password": "knockknock"}
                },
                hasLoginDetails: function () {
                    return true
                }
            };

            MockControllerNavigation = {
                toCommoditiesOrFeed: function () {},
                toCreateNewUser: function () {}
            };

            MockFeedService = {
                getFeedlist: function () {}
            };

            spyOn(MockControllerNavigation, "toCommoditiesOrFeed").and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            });
            spyOn(MockControllerNavigation, "toCreateNewUser").and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            });

            var mockFactory  = $injector.get(toolNames.MockFactory);

            LoginController = $controller("LoginController", {
                $scope: $scope,
                LoginStore: MockLoginStore,
                UserStore: MockUserStore,
                LoginRepository: MockLoginRepository,
                ControllerNavigation: MockControllerNavigation,
                FeedService : MockFeedService,
                CommodityCache : MockCommodityCache,
                ErrorStore : mockFactory.ErrorStoreMock,
                ErrorService : mockFactory.ErrorServiceMock,
                IonicLoadingExtension : mockFactory.IonicLoadingExtensionMock
            });

            spyOn(MockLoginStore, "saveLoginDetails").and.callThrough();
            spyOn(MockLoginStore, "getLoginDetails").and.callThrough();
            spyOn(MockLoginStore, "hasLoginDetails").and.callThrough();

            spyOn(PopupExtension, "showAlert");
            spyOn(PopupExtension, "showError");

            $httpBackend.whenGET(/^\w+.*/).respond("");
        });
    });

    //LoginService, LoginRepository

    it("test contructor init when we have logindetails", function () {
        var vm = LoginController;
        vm.LoginController();
        expect(vm.username).toEqual("feedME!");
        expect(vm.password).toEqual("knockknock");

    });

    it("testLogin with success", function () {
        var vm = LoginController;
        console.log(vm.username);
        vm.login("asdasd1", "asdasd2");
        deferred.resolve({"isSuccess": true, "feedIdExists": true});
        $scope.$digest();

        expect(vm.username).toEqual("asdasd1");
        expect(vm.password).toEqual("asdasd2");
        expect(vm.isLoginSuccess).toEqual(true);
        expect(MockControllerNavigation.toCommoditiesOrFeed).toHaveBeenCalled();
    });

    it("testLogin with failure, but feedIdExists", function () {
        var vm = LoginController;
        console.log(vm.username);
        vm.login("asdasd1", "asdasd2");

        var loginDetails = { username: 'asdasd1', password: 'asdasd2' };
        expect(MockLoginStore.saveLoginDetails).not.toHaveBeenCalled();
        expect(vm.username).toEqual("asdasd1");
        expect(vm.password).toEqual("asdasd2");
    });

    // som egentlig er en ugyldig tilstand...
    it("testLogin with failure and the feedIdExists is also false", function () {
        var vm = LoginController;
        console.log(vm.username);
        vm.login("asdasd1", "asdasd2");
        deferred.resolve({"isSuccess": false, "feedIdExists": false});
        $scope.$digest();

        var loginDetails = { username: 'asdasd1', password: 'asdasd2' };
        expect(MockLoginStore.saveLoginDetails).not.toHaveBeenCalled();
        expect(vm.username).toEqual("asdasd1");
        expect(vm.password).toEqual("asdasd2");
    });

    it("testLogin with server error", function () {
        var vm = LoginController;
        console.log(vm.username);
        vm.login("asdasd1", "asdasd2");
        deferred.reject("It wasn't me..");
        $scope.$digest();
        expect(vm.error).toEqual("It wasn't me..");
    });

    it("click on CreateUser with success", function () {
        var vm = LoginController;
        vm.createNewUser();
        expect(MockControllerNavigation.toCreateNewUser).toHaveBeenCalled();
    });

    it("should try to navigate to commodities when a Handleliste is already created", function () {
        var vm = LoginController;

        vm.tryNavigateToCommodities();

        $scope.$digest();
        $timeout.flush();

        expect(MockControllerNavigation.toCommoditiesOrFeed).toHaveBeenCalled();
        expect(PopupExtension.showAlert).not.toHaveBeenCalled();
        expect(PopupExtension.showError).not.toHaveBeenCalled();
    });

});