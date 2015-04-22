(function () {

    function ErrorStoreException(message) {
        this.name = 'ErrorStoreException';
        this.message = message;
        this.date = new Date();
        console.error(this.name + ": " + message)
    }

    ErrorStoreException.prototype = new Error();
    ErrorStoreException.prototype.constructor = ErrorStoreException;

    var errorStore = function (globalData, $filter) {


        var maxNumberOfErrorsLogged = globalData.maxNumberOfErrorsLogged;

        var storageKey = "errorStore";

        var _addError = function (myError, dateCreated) {
            if(!isObjectValid(dateCreated)){
                // JavaScript counts months from 0 to 11. January is 0. December is 11.
                dateCreated = new Date();
            }

            if (!(myError instanceof Error)) {
                throw new ErrorStoreException("Only Errors can be logged");
            }

            var errorStore = _getErrorOrDefault();
            var errorDetails = {
                date: dateCreated,
                myError: myError
            };
            if (errorStore.length >= maxNumberOfErrorsLogged) {
                errorStore.splice(0, 1);
            }
            errorStore.push(errorDetails);
            var errorAsjson = JSON.stringify(errorStore);
            localStorage.setItem(storageKey, errorAsjson );
        };

        var _getErrorsAsJson = function () {
            var errorStore = localStorage.getItem(storageKey);
            return errorStore;
        };

        var _getErrorOrDefault = function () {
            var array = _getErrorsAsJson();
            if (!isObjectValid(array)) {
                var errorArray = [];
                localStorage.setItem(storageKey, JSON.stringify(errorArray));
                array = _getErrorsAsJson();
            }

            if (array == null) {
                throw new ErrorStoreException("Unable to create ErrorStore");
            }

            var obj = JSON.parse(array);
            return obj;
        };

        var _getErrorsSortedDescending = function () {
            var errorStore = _getErrorOrDefault();
            errorStore.sort(function (a, b) {
                return a.date < b.date
            });
            return errorStore;
        };

        var _clearErrors = function () {
            delete localStorage[storageKey];
        };

        return {
            addError: _addError,
            clearErrors: _clearErrors,
            getErrors: _getErrorOrDefault,
            getErrorsSortedDescending: _getErrorsSortedDescending,
            getErrorsAsJson: _getErrorsAsJson
        };

    };

    var module = angular.module("whattobuy.dataproviders");
    module.factory("ErrorStore", errorStore);

}());