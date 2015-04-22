(function () {

    function FeedRepositoryException(message) {
        this.name = 'FeedRepositoryException';
        this.message = message;
        console.error(this.name + ": "+ message)
    }

    FeedRepositoryException.prototype = new Error();
    FeedRepositoryException.prototype.constructor = FeedRepositoryException;

    var feedRepository = function ($q, FeedService) {


    };

    var module = angular.module(moduleNames.whattobuyRepositories);
    module.factory(repositoryNames.FeedRepository, feedRepository);

}());