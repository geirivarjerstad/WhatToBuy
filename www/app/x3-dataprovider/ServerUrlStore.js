(function () {

    function ServerUrlStoreException(message) {
        this.name = 'ServerUrlStoreException';
        this.message= message;
        console.error(this.name + ": "+ message)
    }
    ServerUrlStoreException.prototype = new Error();
    ServerUrlStoreException.prototype.constructor = ServerUrlStoreException;

    var serverUrlStore = function (globalData) {

        var serverurlStorageKey = "serverurl";

        var _setServerUrl = function (serverurl) {
            localStorage.setItem(serverurlStorageKey, serverurl);
        };

        var _getServerUrl = function () {
            var serverurl = localStorage.getItem(serverurlStorageKey);
            return serverurl;
        };

        var _getServerUrlOrDefault = function () {
            var serverUrl = _getServerUrl();
            if(!serverUrl){
                serverUrl = globalData.xServerURL;
            }

            if (serverUrl == null) {
                console.log("Exception: ServerUrl was null");
                throw new ServerUrlStoreException("ServerUrl was null");
            }

            return serverUrl;
        };


        var _hasServerUrl = function () {
            var serverurl = localStorage.getItem(serverurlStorageKey);
            if (serverurl) {
                return true;
            }
            return false;
        };

        var _clearServerUrl = function () {
            delete localStorage[serverurlStorageKey];
        };

        return {
            setServerUrl: _setServerUrl,
            getServerUrl: _getServerUrl,
            getServerUrlOrDefault: _getServerUrlOrDefault,
            clearServerUrl: _clearServerUrl,
            hasServerUrl: _hasServerUrl
        };

    };

    var module = angular.module("whattobuy.dataproviders");
//    module.factory("ServerUrlStore", ["globalData", serverUrlStore]);
    module.factory("ServerUrlStore", serverUrlStore);

}());