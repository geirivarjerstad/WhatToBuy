describe("UserStore Unit Testing", function () {

    var UserStore;

    beforeEach(function () {
        module("whattobuy");
    });

    afterEach(function() {

        inject(function (_UserStore_) {
            UserStore = _UserStore_;
            UserStore.clearUserDetails();
        });
    });

    it("saveFeedId", inject(function (UserStore) {
        UserStore.saveFeedId("abc1234");
        expect(UserStore.getFeedId()).toEqual("abc1234");
    }));

    it("saveFeedId successfully", inject(function (UserStore) {
        UserStore.saveFeedpassword("mø123");
        expect(UserStore.getFeedpassword()).toEqual("mø123");
    }));

    it("clean everything successfully including Feedpassword", inject(function (UserStore) {
        UserStore.saveFeedpassword("mø123");
        UserStore.clearUserDetails();
        expect(UserStore.getFeedpassword()).toBeNull();
    }));

    it("should fail if Feedpassword is empty", inject(function (UserStore) {
        var _err;
        try {
            UserStore.saveFeedpassword("");
        }
        catch (err) {
            _err = err;
        }
        expect(_err).not.toBeNull();
    }));

    it("clearUserDetails", inject(function (UserStore) {
        UserStore.saveFeedId("minhandleliste");
        UserStore.clearUserDetails();
        var feedId = UserStore.getFeedId();
        expect(feedId).toBeNull();
    }));

    it("hasFeedId is true", inject(function (UserStore) {
        UserStore.saveFeedId("minhandleliste");
        expect(UserStore.hasFeedId()).toEqual(true);
    }));

    it("hasFeedId is false", inject(function (UserStore) {
        UserStore.saveFeedId("minhandleliste");
        UserStore.clearUserDetails();
        expect(UserStore.hasFeedId()).toEqual(false);
    }));

});