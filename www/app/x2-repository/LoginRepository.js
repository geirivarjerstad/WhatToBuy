(function () {

    function LoginRepositoryException(message) {
        this.name = 'LoginRepositoryException';
        this.message = message;
        console.error(this.name + ": " + message)
    }

    LoginRepositoryException.prototype = new Error();
    LoginRepositoryException.prototype.constructor = LoginRepositoryException;

    var loginRepository = function (LoginService, LoginStore, $q) {

        var _authenticate = function (username, password) {
            var deferred = $q.defer();

            console.log("LoginRepository->authenticate ");
            try {
                if (!isObjectValid(username)) {
                    throw new LoginRepositoryException("username was null");
                }
                if (!isObjectValid(password)) {
                    throw new LoginRepositoryException("password was null");
                }
            }
            catch (err) {
                deferred.reject(err);
                return deferred.promise;
            }

            LoginService.authenticate(username, password).then(
                function (model) {
                    console.log("LoginRepository=>authenticate=>onSuccess", model);
                    try {
                        if (model.isSuccess) {
                            LoginStore.saveLoginDetails(username, password);
                            deferred.resolve(model);
                        }
                        else{
                            deferred.reject(new LoginRepositoryException("Error when login"));
                        }
                    }
                    catch (err) {
                        deferred.reject(err);
                    }
                },
                function (reason) {
                    console.log("Ajaxerror: LoginRepository->authenticate: " + reason);
                    deferred.reject(reason);
                });

            return deferred.promise;
        };

        return {
            authenticate: _authenticate
        };
    };




    var module = angular.module(moduleNames.whattobuyRepositories);
    module.factory(repositoryNames.LoginRepository, loginRepository);

}());