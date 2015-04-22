(function () {

    function UserRepositoryException(message) {
        this.name = 'UserRepositoryException';
        this.message = message;
        console.error(this.name + ": " + message)
    }

    UserRepositoryException.prototype = new Error();
    UserRepositoryException.prototype.constructor = UserRepositoryException;

    var userRepository = function ($q, UserService, LoginRepository, LoginStore, UserStore) {

        var _createUserAndLogin = function (user) {
            console.log("UserRepository->createUserAndLogin ");

            var deferred = $q.defer();
            UserService.createUser(user).then(function (model) {
                console.log("UserRepository=>authenticate=>onSuccess", model);
                try {

                    if (model.isSuccess) {
                        LoginStore.saveLoginDetails(user.username, user.password);
                        UserStore.saveFeedpassword(model.feedpassword);
                        deferred.resolve(model);
                    }
                    else {
                        deferred.reject("Error creating user.");
                    }
                }
                catch (err) {
                    deferred.reject(err);
                }

            }, function (reason) {
                console.log("Ajaxerror: UserRepository->authenticate: " + reason);
                deferred.reject(reason);
            }).then(function () {
                console.log("over to something completely different!");
            });

            return deferred.promise;
        };

        var saveFeedpassword = function (feedpassword) {
            console.log("UserRepository->saveFeedpassword ");
            if (!isObjectValid(feedpassword)) {
                deferred.reject(new UserRepositoryException("feedpassword was null"));
                return deferred.promise;
            }

            var deferred = $q.defer();
            UserService.saveFeedpassword(feedpassword).then(function (model) {
                console.log("UserRepository=>saveFeedpassword=>onSuccess", model);
                try {
                    if (model.isSuccess) {
                        deferred.resolve(model);
                        UserStore.saveFeedpassword(feedpassword);
                    }
                    else {
                        deferred.reject("Error saving feedpassword.");
                    }
                }
                catch (err) {
                    deferred.reject(err);
                }

            }, function (reason) {
                console.log("Ajaxerror: UserRepository->saveFeedpassword: " + reason);
                deferred.reject(reason);
            });

            return deferred.promise;
        };

        return {
            createUserAndLogin: _createUserAndLogin,
            saveFeedpassword: saveFeedpassword
        };
    };

    var module = angular.module("whattobuy.repositories");
    module.factory("UserRepository", userRepository);

}());