describe("ControllerNavigate: When we navigate", function () {

    var $scope, $q, $injector, $location;

    var ControllerNavigation, FeedService, UserStore, CommodityCache;

    beforeEach(function () {
        module("whattobuy");

        inject(function ($rootScope, _$injector_, _$location_) {
            $scope = $rootScope.$new();

            $injector = _$injector_;

            $q = $injector.get('$q');
            FeedService = $injector.get(serviceNames.FeedService);
            UserStore = $injector.get(dataproviderNames.UserStore);
            CommodityCache = $injector.get(dataproviderNames.CommodityCache);
            ControllerNavigation = $injector.get(controllerNames.ControllerNavigation);

            $location = _$location_;

            spyOn($location, "path");
        });
    });

    it("should navigate to commodities when user have one or more feeds", function () {
        spyOn(FeedService, "getFeedlist").and.callFake(function () {
            var deferred = $q.defer();
            deferred.resolve([{name: "Ikea"}]);
            return deferred.promise;
        });

        ControllerNavigation.toCommoditiesOrFeed();

        $scope.$digest();

        expect($location.path).toHaveBeenCalledWith("/app/commodities")
    });

    it("should navigate to create feed when current user does not have any feeds", function () {
        spyOn(FeedService, "getFeedlist").and.callFake(function () {
            var deferred = $q.defer();
            deferred.resolve([]);
            return deferred.promise;
        });

        ControllerNavigation.toCommoditiesOrFeed();

        $scope.$digest();

        expect($location.path).toHaveBeenCalledWith("/app/feed")
    });

    it("should return error if call to getFeedlist fails", function () {
        spyOn(FeedService, "getFeedlist").and.callFake(function () {
            var deferred = $q.defer();
            deferred.reject("Fail!");
            return deferred.promise;
        });

        ControllerNavigation.toCommoditiesOrFeed().catch(function (error) {
            expect(error).not.toBeNull(error);
        });

        $scope.$digest();

        expect($location.path).not.toHaveBeenCalled();
    });

    it("should save selected FeedId and then navigate to Commodity", function () {
        var thisFeedId = "";
        spyOn(UserStore, "saveFeedId").and.callFake(function (feedId) {
            thisFeedId = feedId;
        });
        spyOn(CommodityCache, "clearCommodities").and.callFake(function () {
        });

        ControllerNavigation.toCommoditiesByFeedId("asd1337");
        expect(thisFeedId).toBe(thisFeedId);
        expect($location.path).toHaveBeenCalledWith("/app/commodities");
        expect(UserStore.saveFeedId).toHaveBeenCalledWith("asd1337");
        expect(CommodityCache.clearCommodities).toHaveBeenCalled();
    });

    it("should navigate to Create new User", function () {
        ControllerNavigation.toCreateNewUser();
        expect($location.path).toHaveBeenCalledWith("/createuser")
    });

    it("should navigate to Login", function () {
        ControllerNavigation.toLogin();
        expect($location.path).toHaveBeenCalledWith("/login")
    });

    it("should navigate to Feed", function () {
        ControllerNavigation.toFeed();
        expect($location.path).toHaveBeenCalledWith("/app/feed")
    });

    it("should navigate to Commodity", function () {
        ControllerNavigation.toCommodities();
        expect($location.path).toHaveBeenCalledWith("/app/commodities")
    });

});
