(function () {

    function FeedServiceException(message) {
        this.name = 'FeedServiceException';
        this.message = message;
        console.error(this.name + ": " + message)
    }

    FeedServiceException.prototype = new Error();
    FeedServiceException.prototype.constructor = FeedServiceException;

    var feedService = function ($http, $q, ServerUrlStore, LoginStore, UserStore) {

        var _getPrivateFeedlist = function () {
            return __getFeedlist("feed/private");
        };
        var _getSharedFeedlist = function () {
            return __getFeedlist("feed/shared");
        };

        var _getPrivateAndSharedFeedlist = function () {
            return __getFeedlist("feed");
        };

        var __getFeedlist = function (urlparameter) {

            var deferred = $q.defer();

            var serverUrl = ServerUrlStore.getServerUrlOrDefault();

            var loginDetails = LoginStore.getLoginDetails();

            var config = {
                params: {
                    format: "json",
                    username: loginDetails.username,
                    password: loginDetails.password
                }
            };

            var requestURL = serverUrl + urlparameter;

            $http.get(requestURL, config)
                .success(function (data) {
                    console.log("FeedService->_getFeedlist()");
                    try {
                        var feedlist = mapArrayToDomain(data);
                        deferred.resolve(feedlist);
                    }
                    catch (err) {
                        deferred.reject(err);
                    }

                })
                .error(function (reason) {
                    console.error("ServerError: FeedService->__getFeedlist(). See print in console.error log: ");

                    if (reason.ResponseStatus !== undefined) {
                        console.error(JSON.stringify(reason.ResponseStatus));
                        deferred.reject(new FeedServiceException("Servererror: " + reason.ResponseStatus.Message));
                    }
                    else {
                        console.error("Ajaxerror: FeedService->__getFeedlist(): " + reason);
                        deferred.reject(new FeedServiceException("Servererror: " + reason));
                    }
                });

            return deferred.promise;
        };

        var _validateFeed = function (feed) {

            if (!isObjectValid(feed.name)){
                throw new FeedServiceException("name was null or empty");
            }
        };

        var _validateFeedId = function (feedId) {

            if (!isObjectValid(feedId)){
                throw new FeedServiceException("FeedId was null or empty");
            }
        };

        var _saveFeed = function (feed) {

            var deferred = $q.defer();
            try {
                _validateFeed(feed);
            }
            catch (err) {
                deferred.reject(err);
                return deferred.promise;
            }

            var serverUrl = ServerUrlStore.getServerUrlOrDefault();
            var loginDetails = LoginStore.getLoginDetails();
            var feedpassword = UserStore.getFeedpassword();

            var model = {
                format: "json",
                username: loginDetails.username,
                password: loginDetails.password,
                feedname: feed.name,
                feedpassword: feedpassword
            };

            var postURL = serverUrl + "feed/save";

            $http.post(postURL, model)
                .success(function (data) {
                    console.log("FeedService->addFeed()");

                    if (data.isSuccess) {
                        deferred.resolve(data);
                    }
                    else {
                        deferred.reject("Unable to update the server. ");
                    }
                })
                .error(function (reason) {
                    console.error("ServerError: FeedService->saveFeed(). See print in console.error log: ");

                    if (reason.ResponseStatus !== undefined) {
                        console.error(JSON.stringify(reason.ResponseStatus));
                        deferred.reject(new FeedServiceException("Servererror: " + reason.ResponseStatus.Message));
                    }
                    else {
                        console.error("Ajaxerror: FeedService->saveFeed(): " + reason);
                        deferred.reject(new FeedServiceException("Servererror: " + reason));
                    }
                });

            return deferred.promise;
        };

        var _addSharedFeed = function (shareId, feedpassword) {

            var deferred = $q.defer();
            try {
                if (!isObjectValid(shareId)){
                    throw new FeedServiceException("shareId was null or empty");
                }
                if (!isObjectValid(feedpassword)){
                    throw new FeedServiceException("feedpassword was null or empty");
                }
            }
            catch (err) {
                deferred.reject(err);
                return deferred.promise;
            }

            var serverUrl = ServerUrlStore.getServerUrlOrDefault();

            var loginDetails = LoginStore.getLoginDetails();

            var model = {
                format: "json",
                username: loginDetails.username,
                password: loginDetails.password,
                feedId: shareId,
                feedpassword: feedpassword
            };

            var postURL = serverUrl + "feed/shared/save";

            $http.post(postURL, model)
                .success(function (data) {
                    console.log("FeedService->_addSharedFeed()");

                    if (data.isSuccess) {
                        deferred.resolve(data);
                    }
                    else {
                        deferred.reject("Unable to update the server. ");
                    }
                })
                .error(function (reason) {
                    console.error("ServerError: FeedService->_addSharedFeed(). See print in console.error log: ");

                    if (reason.ResponseStatus !== undefined) {
                        console.error(JSON.stringify(reason.ResponseStatus));
                        deferred.reject(new FeedServiceException("Servererror: " + reason.ResponseStatus.Message));
                    }
                    else {
                        console.error("Ajaxerror: FeedService->_addSharedFeed(): " + reason);
                        deferred.reject(new FeedServiceException("Servererror: " + reason));
                    }
                });

            return deferred.promise;
        };

        var _deleteMyFeed = function (feedId) {

            var deferred = $q.defer();
            try {
                _validateFeedId(feedId);
            }
            catch (err) {
                deferred.reject(err);
                return deferred.promise;
            }

            var serverUrl = ServerUrlStore.getServerUrlOrDefault();

            var loginDetails = LoginStore.getLoginDetails();
            var model = {
                format: "json",
                username: loginDetails.username,
                password: loginDetails.password,
                feedId: feedId
            };

            var postURL = serverUrl + "feed/delete";

            $http.post(postURL, model)
                .success(function (data) {
                    console.log("FeedService->_deleteMyFeed()");

                    if (data.isSuccess) {
                        deferred.resolve(data);
                    }
                    else {
                        deferred.reject("Unable to update the server. ");
                    }
                })
                .error(function (reason) {
                    console.error("ServerError: FeedService->deleteFeed(). See print in console.error log: ");

                    if (reason.ResponseStatus !== undefined) {
                        console.error(JSON.stringify(reason.ResponseStatus));
                        deferred.reject(new FeedServiceException("Servererror: " + reason.ResponseStatus.Message));
                    }
                    else {
                        console.error("Ajaxerror: CommodityService->getCommodities(): " + reason);
                        deferred.reject(new FeedServiceException("Servererror: " + reason));
                    }
                });

            return deferred.promise;
        };

        var mapArrayToDomain = function (data) {
            var model = [];
            data.forEach(function (item) {
                model.push(mapToDomain(item));
            });
            return model;
        };

        var mapToDomain = function (data) {

            if (!isObjectValid(data.name)) {
                throw new FeedServiceException("FeedServiceException=>mapToDomain: 'data.name' was null or empty");
            }

            if (!isObjectValid(data.feedId)) {
                throw new FeedServiceException("FeedServiceException=>mapToDomain: 'data.feedId' was null or empty");
            }

            return {
                name: data.name,
                feedId: data.feedId
            };
        };

        return {
            getPrivateFeedlist: _getPrivateFeedlist,
            getSharedFeedlist: _getSharedFeedlist,
            getFeedlist: _getPrivateAndSharedFeedlist,
            saveFeed: _saveFeed,
            addSharedFeed: _addSharedFeed,
            deleteFeed: _deleteMyFeed
        }
    };

    var module = angular.module(moduleNames.whattobuyDataproviders);
    module.factory(serviceNames.FeedService, feedService);

}());


