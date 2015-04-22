(function () {

    function CommodityServiceException(message) {
        this.name = 'CommodityServiceException';
        this.message = message;
        console.error(this.name + ": " + message)
    }

    CommodityServiceException.prototype = new Error();
    CommodityServiceException.prototype.constructor = CommodityServiceException;

    var commodityService = function ($http, $q, ServerUrlStore, LoginStore) {

        var _getCommodities = function (feedId) {

            var deferred = $q.defer();

            if (!isObjectValid(feedId)) {
                deferred.reject(new CommodityServiceException("CommodityServiceException=>_getCommodities: 'feedId' was null or empty"));
                return deferred.promise;
            }
            if (typeof feedId !== "string") {
                deferred.reject(new CommodityServiceException("CommodityServiceException=>_getCommodities: 'feedId was an object. Should be string"));
                return deferred.promise;
            }

            var serverUrl = ServerUrlStore.getServerUrlOrDefault();

            var loginDetails = LoginStore.getLoginDetails();

            var config = {
                params: {
                    format: "json",
                    username: loginDetails.username,
                    password: loginDetails.password,
                    feedId: feedId
                }
            };

            var requestURL = serverUrl + "commodity";

            //$http.get(serverUrl + "commodity?format=json&username=" + loginDetails.username + "&password=" + loginDetails.password)
            $http.get(requestURL, config)
                .success(function (data) {
                    console.log("CommodityService->getCommodities()");
                    try {
                        var commodities = mapArrayToDomain(data);
                        deferred.resolve(commodities);
                    }
                    catch (err) {
                        deferred.reject(err);
                    }
                })
                .error(function (reason) {
                    console.error("ServerError: CommodityService->getCommodities(). See print in console.error log: ");

                    if (reason.ResponseStatus !== undefined) {
                        console.error(JSON.stringify(reason.ResponseStatus));
                        deferred.reject(new CommodityServiceException("Servererror: " + reason.ResponseStatus.Message));
                    }
                    else {
                        deferred.reject(new CommodityServiceException("Servererror: " + reason));
                    }
                });

            return deferred.promise;
        };

        var _validateCommodity = function (feedId, commodity) {

            if (!isObjectValid(feedId)) {
                throw new CommodityServiceException("feedId was null");
            }
            if (typeof feedId !== "string") {
                throw new CommodityServiceException("feedId was an object. Should be string.");
            }
            if (!isObjectValid(commodity.name)) {
                throw new CommodityServiceException("name was null");
            }
            if (!isObjectValid(commodity.isPurchased)) {
                throw new CommodityServiceException("isPurchased was null");
            }
        };

        var _saveCommodity = function (feedId, commodity) {
            var deferred = $q.defer();
            try {
                _validateCommodity(feedId, commodity);
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
                feedId: feedId,
                name: commodity.name,
                isPurchased: commodity.isPurchased,
                commodityGuid: commodity.commodityGuid
            };

            var postURL = serverUrl + "commodity/save";

            $http.post(postURL, model)
                .success(function (data) {
                    console.log("CommodityService->updateCommodity()");
                    if (data.isSuccess) {
                        deferred.resolve(data);
                    }
                    else {
                        deferred.reject("Unable to update the server. ");
                    }

                })
                .error(function (reason) {
                    console.error("ServerError: CommodityService->_saveCommodity(). See print in console.error log: ");

                    if (reason.ResponseStatus !== undefined) {
                        console.error(JSON.stringify(reason.ResponseStatus));
                        deferred.reject(new CommodityServiceException("Servererror: " + reason.ResponseStatus.Message));
                    }
                    else {
                        console.error("ServerError: CommodityService->_saveCommodity(): " + reason);
                        deferred.reject(new CommodityServiceException("Servererror: " + reason));
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

            if (typeof data.commodityGuid === "undefined" || data.commodityGuid === "") {
                throw new CommodityServiceException("CommodityServiceException=>mapToDomain: 'data.commodityGuid' was null or empty");
            }

            if (typeof data.isPurchased === "undefined" || data.isPurchased === "") {
                throw new CommodityServiceException("CommodityServiceException=>mapToDomain: 'data.isPurchased' was null or empty");
            }
            if (typeof data.lastUpdated === "undefined" || data.lastUpdated === "") {
                throw new CommodityServiceException("CommodityServiceException=>mapToDomain: 'data.lastUpdated' was null or empty");
            }
            if (typeof data.name === "undefined" || data.name === "") {
                throw new CommodityServiceException("CommodityServiceException=>mapToDomain: 'data.name' was null or empty");
            }

            return {
                commodityGuid: data.commodityGuid,
                isPurchased: data.isPurchased,
                lastUpdated: data.lastUpdated,
                name: data.name
            };
        };

        return {
            getCommodities: _getCommodities,
            saveCommodity: _saveCommodity
        }
    };

    var module = angular.module(moduleNames.whattobuyDataproviders);
    module.factory(serviceNames.CommodityService, commodityService);

}());


