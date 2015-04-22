(function () {

    var ErrorController = function ($scope,  IonicLoadingExtension, $timeout, ErrorStore, PopupExtension, $cordovaClipboard, $location) {

        var vm = this;
        vm.errors = null;

        vm.loadErrors = function () {
            IonicLoadingExtension.showLoading();
            $timeout(function () {
                vm.errors = ErrorStore.getErrorsSortedDescending();
                vm.errors.sort(function(a, b){return a.date < b.date});
                IonicLoadingExtension.hideLoading();
            }, 200);
        };
        vm.deleteErrors = function () {
            IonicLoadingExtension.showLoading();
            $timeout(function () {
                ErrorStore.clearErrors();
                vm.loadErrors();
                IonicLoadingExtension.hideLoading();
            }, 200);
        };
        vm.copyToClipboard = function () {
            if (window.cordova) {
                IonicLoadingExtension.showLoading();
                $timeout(function () {
                    IonicLoadingExtension.hideLoading();
                }, 2000);
                var errorJson = ErrorStore.getErrorsAsJson();
                $cordovaClipboard.copy(errorJson).then(function () {
                    // success
                    $timeout(function () {
                        IonicLoadingExtension.hideLoading();
                    }, 200);
                    PopupExtension.showAlert("Copied to clipboard");
                }, function () {
                    // error
                    PopupExtension.showAlert("Error copying to clipboard");
                    IonicLoadingExtension.hideLoading();
                });
            }
            else{
                PopupExtension.showAlert("Unble to run ngCordova");
            }
        };
        vm.goBackTologin = function () {
            $location.path("/login");
        };


        vm.ErrorController = function () {
            console.log("ErrorController init");
            vm.loadErrors();
        };
    };

    var module = angular.module("whattobuy.controllers");
    module.controller("ErrorController", ErrorController);

}());