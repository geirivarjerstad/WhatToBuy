(function () {

    function ErrorServiceException(message) {
        this.name = 'ErrorServiceException';
        this.message = message;
        console.error(this.name + ": " + message)
    }

    ErrorServiceException.prototype = new Error();
    ErrorServiceException.prototype.constructor = ErrorServiceException;

    var errorService = function ($http, $q, ServerUrlStore, LoginStore) {

        var _saveError = function (error) {
            console.log("ErrorService->saveError ");
            var deferred = $q.defer();

            if (!isObjectValid(error)) {
                deferred.reject(new ErrorServiceException("error was null"));
                return deferred.promise;
            }

            var serverUrl = ServerUrlStore.getServerUrlOrDefault();

            var login = {
                username: null,
                password: null
            };

            if(LoginStore.hasLoginDetails()){
                login = LoginStore.getLoginDetails();
            }

            var model = {
                format: "json",
                username: login.username,
                password: login.password,
                error: error
            };

            var postURL = serverUrl + "error/save";
            $http.post(postURL, model)
                .success(function (data) {
                    try {
                        console.log("ErrorService->_saveError()");
                        if (data.isSuccess) {
                            deferred.resolve(data);
                        }
                        else {
                            deferred.reject("Unable to update the server. ");
                        }
                    }
                    catch (err) {
                        deferred.reject(err);
                    }
                })
                .error(function (reason) {
                    console.error("ServerError: ErrorService->_saveError(). See print in console.error log: ");
                    if (reason.ResponseStatus !== undefined) {
                        console.error(JSON.stringify(reason.ResponseStatus));
                        deferred.reject(new ErrorServiceException("Servererror: " + reason.ResponseStatus.Message));
                    }
                    else {
                        console.error("Ajaxerror: ErrorService->_saveError(): " + reason);
                        deferred.reject(new ErrorServiceException("Servererror: " + reason));
                    }
                });

            return deferred.promise;
        };

        return {
            saveError: _saveError
        };

    };

    var module = angular.module(moduleNames.whattobuyDataproviders);
    module.factory(serviceNames.ErrorService, errorService);
}());