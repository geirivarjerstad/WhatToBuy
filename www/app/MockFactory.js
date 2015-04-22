(function () {

    var mockFactory = function ($q) {

        var _returnSuccessPromise = function () {
            var deferred = $q.defer();
            deferred.resolve({isSuccess: true});
            return deferred.promise;
        };

        var _returnEmptyArraySuccessPromise = function () {
            var deferred = $q.defer();
            deferred.resolve([
                {}
            ]);
            return deferred.promise;
        };

        var FeedServiceMock = {
            addSharedFeed: function () {
                return _returnSuccessPromise();
            },
            getFeedlist: function () {
                return _returnEmptyArraySuccessPromise();
            },
            getPrivateFeedlist: function () {
                return _returnEmptyArraySuccessPromise();
            },
            getSharedFeedlist: function () {
                return _returnEmptyArraySuccessPromise();
            },
            saveFeed: function () {
                return _returnSuccessPromise();
            },
            deleteFeed: function () {
                return _returnSuccessPromise();
            }
        };

        var UserStoreMock = {
            saveFeedId: function () {
                return _returnSuccessPromise();
            },
            saveFeedpassword: function () {
                return _returnSuccessPromise();
            },
            hasFeedId: function () {
            },
            getFeedId: function () {
            },
            getFeedpassword: function () {
            },
            clearUserDetails: function () {
                return _returnSuccessPromise();
            }
        };

        var ErrorStoreMock = {
            addError: function () {
            },
            clearErrors: function () {
            },
            getErrors: function () {
            },
            getErrorsSortedDescending: function () {
            },
            getErrorsAsJson: function () {
            }
        };

        var ErrorServiceMock = {
            saveError: function () {
            }
        };

        var CommodityCacheMock = {
            getCommodities: function () {
                return _returnEmptyArraySuccessPromise;
            },
            saveCommodities: function () {
                return _returnSuccessPromise();
            },
            clearCommodities: function () {
                return _returnSuccessPromise();
            }
        };

        var IonicLoadingExtensionMock = {
            showLoading: function () {
            },
            showLoadingForever: function () {
            },
            hideLoading: function () {
            },
            isHidden: function () {
            }
        };

        var PopupExtensionMock = {
            showAlert: function () {
            },
            showError: function () {
            }
        };

        var ControllerNavigationMock = {
            toCommoditiesOrFeed: function () {
            },
            toCreateNewUser: function () {
            },
            toLogin: function () {
            },
            toErrors: function () {
            },
            toCommodities: function () {
            },
            toCommoditiesByFeedId: function () {
            },
            toFeed: function () {
            }
        };

        return {
            FeedServiceMock: FeedServiceMock,
            UserStoreMock: UserStoreMock,
            CommodityCacheMock: CommodityCacheMock,
            ErrorServiceMock: ErrorServiceMock,
            IonicLoadingExtensionMock: IonicLoadingExtensionMock,
            PopupExtensionMock: PopupExtensionMock,
            ErrorStoreMock: ErrorStoreMock,
            ControllerNavigationMock: ControllerNavigationMock
        }
    };

    var module = angular.module("whattobuy");
    module.factory(toolNames.MockFactory, mockFactory);

}());

// To Mock with $provider
var MockFactory = {
    ErrorStoreMock: function () {
        this.addError = jasmine.createSpy('addError').and.callFake(function () {
        });
    }
};
//var MockFactory = {
//    ErrorStoreMock: function () {
//        this.addError = jasmine.createSpy('addError').and.callFake(function () {
//        });
//    }
//};
