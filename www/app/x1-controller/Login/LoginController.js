(function () {

    var LoginController = function ($log, $timeout, LoginRepository,
                                    LoginStore, PopupExtension, ControllerNavigation,
                                    FeedService, UserStore, CommodityCache,
                                    ErrorStore, IonicLoadingExtension, ErrorService) {

        var vm = this;
        vm.username = "";
        vm.password = "";
        vm.isLoginSuccess;

        vm.login = function (username, password) {
            vm.username = username;
            vm.password = password;
            IonicLoadingExtension.showLoading();
            LoginRepository.authenticate(username, password).then(
                function (data) {
                    IonicLoadingExtension.hideLoading();
                    vm.isLoginSuccess = data.isSuccess;
                    console.log("LoginController=>login=>onSuccess", data);
                    vm.tryNavigateToCommodities();
                },
                function (error) {
                    IonicLoadingExtension.hideLoading();
                    console.error("Ajaxerror: LoginController->authenticate: " + JSON.stringify(error));
                    vm.isLoginSuccess = false;
                    vm.error = error;
                    PopupExtension.showError("Unable to login: " + error);
                    ErrorStore.addError(error);
                    ErrorService.saveError(error);
                });
        };

        vm.tryNavigateToCommodities = function () {
            ControllerNavigation.toCommoditiesOrFeed().catch(
                function (error) {
                    PopupExtension.showError("Unable to navigate: ", error);
                    ErrorStore.addError(error);
                });
        };

        vm.createNewUser = function () {
            ControllerNavigation.toCreateNewUser();
            console.log("createuser");
        };

        vm.showErrors = function () {
            ControllerNavigation.toErrors();
            console.log("Errors");
        };

        vm.showLoading = function () {
            IonicLoadingExtension.showLoadingForever();
        };

        vm.logout = function () {
            console.log("Logging out!");
            LoginStore.clearLoginDetails();
            UserStore.clearUserDetails();
            CommodityCache.clearCommodities();
            ControllerNavigation.toLogin();
        };

        vm.LoginController = function () {
            console.log("LoginController init");
            if (LoginStore.hasLoginDetails()) {
                var login = LoginStore.getLoginDetails();
                vm.username = login.username;
                vm.password = login.password;
            }
        };

    };

    var module = angular.module("whattobuy.controllers");
    module.controller("LoginController", LoginController);

}());