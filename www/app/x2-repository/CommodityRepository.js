(function () {

    function CommodityRepositoryException(message) {
        this.name = 'CommodityRepositoryException';
        this.message = message;
        console.error(this.name + ": "+ message)
    }

    CommodityRepositoryException.prototype = new Error();
    CommodityRepositoryException.prototype.constructor = CommodityRepositoryException;

    var commodityRepository = function ($q, CommodityService, CommodityCache) {

        var _getCommoditiesOrCached = function (feedId, forceRefresh) {
            if (typeof forceRefresh === 'undefined') {
                forceRefresh = false;
            }

            var deferred = $q.defer();

            if (!forceRefresh) {
                var cachedCommodities = CommodityCache.getCommodities();

                if (cachedCommodities) {
                    deferred.resolve(cachedCommodities);
                    return deferred.promise;
                }
            }

            CommodityService.getCommodities(feedId)
                .then(function (commodities) {
                    CommodityCache.saveCommodities(commodities);
                    deferred.resolve(commodities);
                })
                .catch(function (reason) {
                    deferred.reject(reason);
                });

            return deferred.promise;
        };

        return {
            getCommoditiesOrCached: _getCommoditiesOrCached
        };
    };

    var module = angular.module(moduleNames.whattobuyRepositories);
    module.factory(repositoryNames.CommodityRepository, commodityRepository);

}());