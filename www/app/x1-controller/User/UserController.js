(function () {

    var UserController = function ($scope, $q, PopupExtension, $location, UserRepository, IonicLoadingExtension, ControllerNavigation, ErrorStore) {

        var vm = this;
        vm.username = null;
        vm.password = null;
        vm.email = null;

        vm.createUser = function (username, password, email) {
            var deferred = $q.defer();
            var user = {
                username: username,
                password: password,
                email: email
            };
            IonicLoadingExtension.showLoading();
            UserRepository.createUserAndLogin(user).then(
                function (data) {
                    IonicLoadingExtension.hideLoading();
                    vm.isCreateUserSuccess = data.isSuccess;
                    console.log("UserController=>createuser=>onSuccess", data);
                    deferred.resolve();
                },
                function (error) {
                    IonicLoadingExtension.hideLoading();
                    console.error("Ajaxerror: UserController->createuser: " + JSON.stringify(error));
                    vm.isCreateUserSuccess = false;
                    vm.error = error;
                    PopupExtension.showError("Unable to create user: " + error);
                    ErrorStore.addError(error);
                    deferred.reject();
                });
            return deferred.promise;
        };

        vm.createUserAndLogin = function (username, password, email) {
            vm.createUser(username, password, email).then(function () {
                ControllerNavigation.toCommoditiesOrFeed().catch(  function (error) {
                    PopupExtension.showError(error);
                    ErrorStore.addError(error);
                });
            })
        };

        vm.goBackTologin = function () {
            $location.path("/login");
        };

        vm.UserController = function () {
            console.log("UserController init");
        };


    };

    var module = angular.module("whattobuy.controllers");
    module.controller("UserController", UserController);

}());