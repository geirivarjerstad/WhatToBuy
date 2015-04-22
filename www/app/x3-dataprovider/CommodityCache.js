(function () {

    var commodityCache = function (DSCacheFactory) {

        var commodityCacheKey = "commodity";

        var getCommodityCache = function () {
            return DSCacheFactory.get("commodityCache");
        };
        var getCommodities = function () {
            var cache = getCommodityCache();
            return cache.get(commodityCacheKey);
        };

        var clearCommodities = function () {
            DSCacheFactory.clearAll();
        };

        var saveCommodities = function (commodities) {
            var cache = getCommodityCache();
            return cache.put(commodityCacheKey, commodities);
        };

        return {
            getCommodities: getCommodities,
            saveCommodities: saveCommodities,
            clearCommodities: clearCommodities
        }
    };

    var module = angular.module("whattobuy.dataproviders");
    module.factory("CommodityCache", commodityCache);

}());