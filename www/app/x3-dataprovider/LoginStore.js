(function () {

    function LoginStoreException(message) {
        this.name = 'LoginStoreException';
        this.message= message;
        console.error(this.name + ": "+ message)
    }
    LoginStoreException.prototype = new Error();
    LoginStoreException.prototype.constructor = LoginStoreException;

    var LoginStore = function () {

        var _validateDetails = function (username, password){
            if(!username || username == ""){
                throw new LoginStoreException("Username was null or empty");
            }
            if(!password || password == ""){
                throw new LoginStoreException("Password was null or empty");
            }
        };

        var _saveLoginDetails = function (username, password) {
            _validateDetails(username, password);

            var loginDetails = {
                username: username,
                password: password
            };

            localStorage.setItem('loginDetails', JSON.stringify(loginDetails));
        };

        var _getLoginDetails = function () {
            var retrievedObject = localStorage.getItem('loginDetails');
            var details =  JSON.parse(retrievedObject);
            if (!details) {
                throw new LoginStoreException("LoginStoreException: Error getting logindetails");
            }
            _validateDetails(details.username, details.password);

            return details;
        };

        var _hasLoginDetails = function () {
            var retrievedObject = localStorage.getItem('loginDetails');
            if (retrievedObject) {
                return true;
            }
            return false;
        };

        var _clearLoginDetails = function () {
            delete localStorage["loginDetails"];
        };

        return {
            saveLoginDetails: _saveLoginDetails,
            getLoginDetails: _getLoginDetails,
            clearLoginDetails: _clearLoginDetails,
            hasLoginDetails: _hasLoginDetails
        };

    };

    var module = angular.module("whattobuy.dataproviders");
    module.factory("LoginStore", LoginStore);

}());