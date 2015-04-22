(function () {

    function UserServiceException(message) {
        this.name = 'UserServiceException';
        this.message = message;
        console.error(this.name + ": " + message)
    }

    UserServiceException.prototype = new Error();
    UserServiceException.prototype.constructor = UserServiceException;

    var userService = function ($http, $q, ServerUrlStore, LoginStore) {

        var _createUser = function (user) {

            var deferred = $q.defer();

            try {
                _validateUser(user);
            }
            catch (err) {
                deferred.reject(err);
                return deferred.promise;
            }

            var serverUrl = ServerUrlStore.getServerUrlOrDefault();

            var model = {
                format: "json",
                username: user.username,
                password: user.password,
                email: user.email
            };

            var postURL = serverUrl + "user/new";

            $http.post(postURL, model)
                .success(function (data) {
                    try {
                        var domain = mapToDomain(data);
                        console.log("UserService->updateUser()");
                        if (domain.isSuccess) {
                            deferred.resolve(domain);
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
                    console.error("ServerError: UserService->updateUser(). See print in console.error log: ");
                    if (reason.ResponseStatus !== undefined) {
                        console.error(JSON.stringify(reason.ResponseStatus));
                        deferred.reject(new UserServiceException("Servererror: " + reason.ResponseStatus.Message));
                    }
                    else {
                        console.error("Ajaxerror: UserService->updateUser(): " + reason);
                        deferred.reject(new UserServiceException("Servererror: " + reason));
                    }
                });

            return deferred.promise;
        };

        var _validateUser = function (user) {

            if (!isObjectValid(user.username)) {
                throw new UserServiceException("username was null");
            }
            if (!isObjectValid(user.password)) {
                throw new UserServiceException("password was null");
            }
//            if (!isObjectValid(user.email)) {
//                throw new UserServiceException("email was null");
//            }
        };

        var mapToDomain = function (data) {

            if (!isObjectValid(data.isSuccess)) {
                throw new UserServiceException("UserServiceException=>mapToDomain: 'data.isSuccess' was null ");
            }
            if (!isObjectValid(data.feedpassword)) {
                throw new UserServiceException("UserServiceException=>mapToDomain: 'data.feedpassword' was null ");
            }
            return {
                isSuccess: data.isSuccess,
                feedpassword: data.feedpassword
            }
        };

        var _saveFeedpassword = function (feedpassword) {
            console.log("UserService->saveFeedpassword ");
            var deferred = $q.defer();

            if (!isObjectValid(feedpassword)) {
                deferred.reject(new UserServiceException("feedpassword was null"));
                return deferred.promise;
            }

            var serverUrl = ServerUrlStore.getServerUrlOrDefault();

            var user = LoginStore.getLoginDetails();

            var model = {
                format: "json",
                username: user.username,
                password: user.password,
                feedpassword: feedpassword
            };

            var postURL = serverUrl + "feedpassword/save";
            $http.post(postURL, model)
                .success(function (data) {
                    try {
                        console.log("UserService->_saveFeedpassword()");
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
                    console.error("ServerError: UserService->_saveFeedpassword(). See print in console.error log: ");
                    if (reason.ResponseStatus !== undefined) {
                        console.error(JSON.stringify(reason.ResponseStatus));
                        deferred.reject(new UserServiceException("Servererror: " + reason.ResponseStatus.Message));
                    }
                    else {
                        console.error("Ajaxerror: UserService->_saveFeedpassword(): " + reason);
                        deferred.reject(new UserServiceException("Servererror: " + reason));
                    }
                });

            return deferred.promise;
        };
        var _getFeedpassword = function () {
            console.log("UserService->_getFeedpassword ");
            var deferred = $q.defer();

            var serverUrl = ServerUrlStore.getServerUrlOrDefault();

            var user = LoginStore.getLoginDetails();

            var config = {
                params: {
                    format: "json",
                    username: user.username,
                    password: user.password
                }
            };

            var requestURL = serverUrl + "feedpassword";
            $http.get(requestURL, config)
                .success(function (data) {
                    try {
                        console.log("UserService->_getFeedpassword()");
                        if (data.isSuccess) {
                            deferred.resolve(data.feedpassword);
                        }
                        else {
                            deferred.reject("Unable to get feedpassword ");
                        }
                    }
                    catch (err) {
                        deferred.reject(err);
                    }
                })
                .error(function (reason) {
                    console.error("ServerError: UserService->_getFeedpassword(). See print in console.error log: ");
                    if (reason.ResponseStatus !== undefined) {
                        console.error(JSON.stringify(reason.ResponseStatus));
                        deferred.reject(new UserServiceException("Servererror: " + reason.ResponseStatus.Message));
                    }
                    else {
                        console.error("Ajaxerror: UserService->_getFeedpassword(): " + reason);
                        deferred.reject(new UserServiceException("Servererror: " + reason));
                    }
                });

            return deferred.promise;
        };

        return {
            createUser: _createUser,
            saveFeedpassword: _saveFeedpassword,
            getFeedpassword: _getFeedpassword
        };

    };


    var module = angular.module(moduleNames.whattobuyDataproviders);
    module.factory(serviceNames.UserService, userService);

}());