(function () {

    var popupExtension = function ($ionicPopup, $timeout) {

        var _showAlert = function (text) {
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: text
            });
            $timeout(function () {
                alertPopup.close();
            }, 5000);
        };

        var _showError = function (title, error) {
            if (title instanceof Error) {
                error = title;
            }

            if (error instanceof Error) {
                _showAlert(title + error.message);
            } else {
                _showAlert(title + error);
            }
        };

        return {
            showAlert: _showAlert,
            showError: _showError
        }
    };

    var module = angular.module("whattobuy");
    module.factory(toolNames.PopupExtension, popupExtension);

}());
