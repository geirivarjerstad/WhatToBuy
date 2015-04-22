(function () {

    function UserStoreException(message) {
        this.name = 'UserStoreException';
        this.message= message;
        console.error(this.name + ": "+ message)
    }
    UserStoreException.prototype = new Error();
    UserStoreException.prototype.constructor = UserStoreException;

    var UserStore = function () {

        var _saveFeedId = function (feedId) {
            if(!isObjectValid(feedId)){
                throw new UserStoreException("feedId was null or empty");
            }

            var userDetails = __getUserDetailsOrDefault();
            userDetails.feedId = feedId;

            localStorage.setItem('userDetails', JSON.stringify(userDetails));
        };

        var _saveFeedpassword = function (feedpassword) {
            if(!isObjectValid(feedpassword)){
                throw new UserStoreException("feedpassword was null or empty");
            }

            var userDetails = __getUserDetailsOrDefault();
            userDetails.feedpassword = feedpassword;

            localStorage.setItem('userDetails', JSON.stringify(userDetails));
        };

        var __getUserDetailsOrDefault = function () {
            var retrievedObject = localStorage.getItem('userDetails');
            var details =  JSON.parse(retrievedObject);
            if(!isObjectValid(details)){
                var userDetails = {
                    feedId: null,
                    feedpassword: null
                };
                return userDetails;
            }

            return details;
        };

        var _getFeedId = function () {
            var retrievedObject = localStorage.getItem('userDetails');
            var userDetails =  JSON.parse(retrievedObject);
            if (!isObjectValid(userDetails)) {
               return null;
            }
            return userDetails.feedId;
        };

        var _hasFeedId = function () {
            return _getFeedId() !== null;
        };

        var _getFeedpassword = function () {
            var retrievedObject = localStorage.getItem('userDetails');
            var userDetails =  JSON.parse(retrievedObject);
            if (!isObjectValid(userDetails)) {
               return null;
            }
            return userDetails.feedpassword;
        };

        var _clearUserDetails = function () {
            delete localStorage["userDetails"];
        };

        return {
            saveFeedId: _saveFeedId,
            saveFeedpassword: _saveFeedpassword,
            hasFeedId: _hasFeedId,
            getFeedId: _getFeedId,
            getFeedpassword: _getFeedpassword,
            clearUserDetails: _clearUserDetails
        };

    };

    var module = angular.module("whattobuy.dataproviders");
    module.factory("UserStore", UserStore);

}());