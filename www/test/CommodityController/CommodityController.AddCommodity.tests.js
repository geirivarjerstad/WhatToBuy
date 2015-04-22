describe("Unittest.CommodityController: When adding a commodity", function () {

    var $scope, $q, $timeout;

    var CommodityController, CommodityService, CommodityRepository, saveCommodityServiceSpy, PopupExtension, LoginStore, IonicLoadingExtension, $httpBackend;

    beforeEach(function () {
        module("whattobuy");

        inject(function (_$q_, $rootScope, $injector, $controller, _$timeout_, _PopupExtension_, _IonicLoadingExtension_, _$httpBackend_) {


            $timeout = _$timeout_;
            $scope = $rootScope.$new();
            $q = _$q_;
            $httpBackend = _$httpBackend_;
            IonicLoadingExtension = _IonicLoadingExtension_;
            PopupExtension = _PopupExtension_;
            LoginStore = $injector.get(dataproviderNames.LoginStore);
            CommodityService = $injector.get(serviceNames.CommodityService);
            CommodityRepository = $injector.get(repositoryNames.CommodityRepository);
            var userStore = $injector.get(dataproviderNames.UserStore);

            var mockFactory  = $injector.get(toolNames.MockFactory);
            var ErrorStoreMock = mockFactory.ErrorStoreMock;

            var UserStoreMock = {
                clearUserDetails: function () {
                },
                saveFeedId: function () {
                },
                getFeedpassword: function () {
                },
                saveFeedpassword: function () {
                },

                getFeedId: function () {
                    var userDetails = {
                        feedId: "myfeedId"
                    };
                    return userDetails;
                },
                hasFeedId: function () {
                    return true;
                }
            };
            expect(getMethods(UserStoreMock)).toEqual(getMethods(userStore));

            LoginStore.clearLoginDetails();

            spyOn(CommodityRepository, "getCommoditiesOrCached").and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve([
                    {}
                ]);
                return deferred.promise;
            });

            saveCommodityServiceSpy = spyOn(CommodityService, "saveCommodity");
            spyOn(PopupExtension, "showAlert");
            spyOn(PopupExtension, "showError");

            CommodityController = $controller("CommodityController", {
                $scope: $scope,
                UserStore : UserStoreMock,
                ErrorStore : ErrorStoreMock
            });

            expect(CommodityController.newCommodityName).toBeNull();

            spyOn(IonicLoadingExtension, "showLoading");
            spyOn(IonicLoadingExtension, "hideLoading");

            CommodityController.feedList =  [{ feedId : 'abc0', name : 'Ikea2013'}, { feedId : 'mno1', name : 'Kiwi'}];
            CommodityController.selectedFeed =  CommodityController.feedList[0];

        });
    });

    it("should save a commodity successfully", function (   ) {

        var newName = "Pølse";
        var afterAddedCommodity = { name: newName, isPurchased : false };

        $httpBackend.whenGET(/^\w+.*/).respond("");

        saveCommodityServiceSpy.and.callFake(function (feedId, commodity) {
            var deferred = $q.defer();
            expect(commodity).toEqual(afterAddedCommodity);
            expect(feedId).toEqual(CommodityController.selectedFeed.feedId);
            deferred.resolve({isSuccess: true});
            return deferred.promise;
        });


        CommodityController.addCommodity(newName);

        $scope.$digest();
        $timeout.flush();

        expect(PopupExtension.showAlert).not.toHaveBeenCalled();
        expect(CommodityController.newCommodityName).toBeNull();
        // once in the constructor init and second after call to "addCommodity"
        expect(CommodityRepository.getCommoditiesOrCached.calls.count()).toEqual(1);

        expect(IonicLoadingExtension.showLoading.calls.count()).toEqual(2);
        expect(IonicLoadingExtension.hideLoading.calls.count()).toEqual(2);
    });

    it("should show popup when failing to save a commodity", function () {

        var newName = "Pølse";
        var afterAddedCommodity = { name: newName, isPurchased : false };

        saveCommodityServiceSpy.and.callFake(function (selectedFeed, commodity) {
            var deferred = $q.defer();
            expect(commodity).toEqual(afterAddedCommodity);
            expect(selectedFeed).toEqual(CommodityController.selectedFeed.feedId);
            deferred.reject("the reason!");
            return deferred.promise;
        });

        CommodityController.addCommodity(newName);

        $scope.$digest();

        expect(PopupExtension.showError).toHaveBeenCalled();
        expect(CommodityController.newCommodityName).toBeNull();
        expect(CommodityController.newCommodityName).toBeNull();
        // in the constructor
        expect(CommodityRepository.getCommoditiesOrCached.calls.count()).toEqual(0);

        expect(IonicLoadingExtension.showLoading).toHaveBeenCalled();
        expect(IonicLoadingExtension.hideLoading).toHaveBeenCalled();
//
//        try {
//
//        }
//        catch (err) {
//            expect(err).toBeNull(err);
//            console.log(err);
//            console.log(err.stack);
//            console.log(err.message);
//        }
    });


});