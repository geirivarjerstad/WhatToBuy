describe("LoginStore Unit Testing", function () {

    var LoginStore;

    beforeEach(function () {
        module("whattobuy");
    });

    afterEach(function() {

        inject(function (_LoginStore_) {
            LoginStore = _LoginStore_;
            LoginStore.clearLoginDetails();
        });
    });

    it("saveLoginDetails", inject(function (LoginStore) {
        LoginStore.saveLoginDetails("minhandleliste", "yup");
        var loginDetails = { username: 'minhandleliste', password: 'yup' };
        expect(LoginStore.getLoginDetails()).toEqual(loginDetails);
    }));

    it("clearLoginDetails", inject(function (LoginStore) {
        LoginStore.saveLoginDetails("minhandleliste", "yup");
        LoginStore.clearLoginDetails();
        function ExceptionWrapper() {
            LoginStore.getLoginDetails()
        }

        expect(ExceptionWrapper).toThrow();
    }));

    it("hasLoginDetails is true", inject(function (LoginStore) {
        LoginStore.saveLoginDetails("minhandleliste", "yup");
        expect(LoginStore.hasLoginDetails()).toEqual(true);
    }));

    it("hasLoginDetails is false", inject(function (LoginStore) {
        LoginStore.saveLoginDetails("minhandleliste", "yup");
        expect(LoginStore.hasLoginDetails()).toEqual(true);
    }));

});