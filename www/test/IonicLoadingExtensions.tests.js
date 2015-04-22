describe("IonicLoadingExtensions.tests", function () {

    var $scope, $timeout, $ionicLoading, ErrorStore, IonicLoadingExtension;

    beforeEach(module('whattobuy'));


    beforeEach(module(function ($provide) {
        $provide.service('ErrorStore', MockFactory.ErrorStoreMock);
    }));

    beforeEach(function () {
        inject(function (_$injector_) {
            var $injector = _$injector_;
            var $rootScope = $injector.get("$rootScope");
            var $httpBackend = $injector.get("$httpBackend");
            $timeout = $injector.get("$timeout");
            $ionicLoading = $injector.get("$ionicLoading");
            ErrorStore = $injector.get("ErrorStore");
            $scope = $rootScope.$new();

            IonicLoadingExtension = $injector.get(toolNames.IonicLoadingExtension);

            $httpBackend.whenGET(/^\w+.*/).respond("");
            $httpBackend.flush();
        });
    });

    it("should show loading for 5 sec then hide it and add an error", (function () {
        spyOn($ionicLoading, "show");
        spyOn($ionicLoading, "hide");

        IonicLoadingExtension.showLoading();

        $scope.$digest();
        $timeout.flush();

        expect($ionicLoading.show).toHaveBeenCalled();
        expect($ionicLoading.hide).toHaveBeenCalled();
        expect(IonicLoadingExtension.isHidden()).toBeTruthy();
        expect(ErrorStore.addError).toHaveBeenCalled();
    }));

    it("should show loading and hide it within 5 sec successfully", (function () {
        spyOn($ionicLoading, "show");
        spyOn($ionicLoading, "hide");

        IonicLoadingExtension.showLoading();
        IonicLoadingExtension.hideLoading();

        $scope.$digest();
        $timeout.flush();

        expect($ionicLoading.show).toHaveBeenCalled();
        expect($ionicLoading.hide).toHaveBeenCalled();
        expect(IonicLoadingExtension.isHidden()).toBeTruthy();
        expect(ErrorStore.addError).not.toHaveBeenCalled();
    }));

});