(function () {

    function IonicLoadingExtensionException(message) {
        this.name = 'IonicLoadingExtensionException';
        this.message= message;
        console.error(this.name + ": "+ message)
    }
    IonicLoadingExtensionException.prototype = new Error();
    IonicLoadingExtensionException.prototype.constructor = IonicLoadingExtensionException;

    var ionicLoadingExtension = function ($ionicLoading, $timeout, ErrorStore) {

        var vm = this;
        vm.isHidden = true;

        var _showLoadingForever = function () {
            $ionicLoading.show({ template: '<i class="icon ion-loading-a"></i>'});
            vm.isHidden = false;
        };

        var _showLoading = function () {
            $ionicLoading.show({ template: '<i class="icon ion-loading-a"></i>'});
            vm.isHidden = false;
            $timeout(function () {
                if(!vm.isHidden){
                    ErrorStore.addError(new IonicLoadingExtensionException("20sec timeout occured."));
                    vm.isHidden = true;
                    $ionicLoading.hide();
                }
            }, 20000);
        };

        var _hideLoading = function () {
            $timeout(function () {
                $ionicLoading.hide();
                vm.isHidden = true;
            }, 200);
        };

        var _isHidden = function () {
            return vm.isHidden;
        };

        return {
            showLoading: _showLoading,
            hideLoading: _hideLoading,
            showLoadingForever: _showLoadingForever,
            isHidden: _isHidden
        }
    };

    var module = angular.module("whattobuy");
    module.factory(toolNames.IonicLoadingExtension, ionicLoadingExtension);

}());
