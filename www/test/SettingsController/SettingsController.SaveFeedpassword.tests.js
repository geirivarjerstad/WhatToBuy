describe("Unittest.SettingsController: When setting the saving feedpassword", function () {

    var $scope, $httpBackend, $q, $timeout;

    var SettingsController, UserStore, PopupExtension, UserRepository;

    beforeEach(function () {
        module("whattobuy");

        inject(function ($rootScope, $controller, $injector) {

            $scope = $rootScope.$new();
            $httpBackend = $injector.get("$httpBackend");
            $timeout = $injector.get("$timeout");
            $q = $injector.get("$q");
            UserStore = $injector.get(dataproviderNames.UserStore);
            PopupExtension = $injector.get(toolNames.PopupExtension);
            UserRepository = $injector.get(repositoryNames.UserRepository);
            var mockFactory  = $injector.get(toolNames.MockFactory);

            SettingsController = $controller("SettingsController", {
                $scope: $scope,
                ErrorStore : mockFactory.ErrorStoreMock
            });

            $httpBackend.whenGET(/^\w+.*/).respond("");

            spyOn(PopupExtension, "showError");
        });
    });


    it("should save feedpassword successfully", function () {
        spyOn(UserRepository, "saveFeedpassword").and.callFake(function () {
            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        });

        SettingsController.feedpassword = "abc1234";
        SettingsController.saveFeedpassword();

        expect(UserRepository.saveFeedpassword).toHaveBeenCalledWith("abc1234");

        $scope.$digest();
        $timeout.flush();
    });

    it("should fail to save feedpassword for some error", function () {

        spyOn(UserRepository, "saveFeedpassword").and.callFake(function () {
            var deferred = $q.defer();
            deferred.reject(new Error("some error"));
            return deferred.promise;
        });

        SettingsController.feedpassword = "abc1234";
        SettingsController.saveFeedpassword();

        $scope.$digest();
        $timeout.flush();

        expect(UserRepository.saveFeedpassword).toHaveBeenCalledWith("abc1234");
        expect(PopupExtension.showError).toHaveBeenCalled();
    });

});