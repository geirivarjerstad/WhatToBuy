xdescribe('LoginService', function () {

    var LoginService, tester, ServerUrlStore;
    // DO NOT CALL Angular-mocks module or inject methods!!
    // Use ngMidwayTester instead
    beforeEach(function () {
        tester = ngMidwayTester('whattobuy');
        ServerUrlStore = tester.inject('ServerUrlStore');
        var globalData = tester.inject('globalData');
        spyOn(ServerUrlStore, "getServerUrlOrDefault").and.returnValue(globalData.xTestServerURL);
        LoginService = tester.inject('LoginService');
    });

    afterEach(function () {
        tester.destroy();
        tester = null;
    });

    // Asynchronous test with real XHR request/response
    it('should make a real XHR GET for http-hello.html', function () {

        console.log("real GET http-hello.html test");

        runAsync(function (done) {
            LoginService_authenticate().finally(done);
        }, "LoginService_authenticate", 15000);
    });


    /*** Helpers ***/
    function LoginService_authenticate() {
        var onSuccessAuthenticated = function (data) {
            console.log("LoginRepository=>authenticate=>onSuccess", data);
            expect(data).toEqual({isSuccess: false, feedIdExists: false});
        };

        var onErrorAuthenticated = function (reason) {
            console.log("Ajaxerror: LoginRepository->authenticate: " + reason);

        };

        return LoginService.authenticate("asdasd", "asdasd").then(onSuccessAuthenticated, onErrorAuthenticated);

    }

    // Stuff you need to do run an async test in mocha style
    // prior to Jasmine v.2.0
    function runAsync(block, optionalTimeoutMessage, optionalTimeout) {
        var self = this;
        var isDone = false;
        var done = function () {
            isDone = true;
        };

        runs(function () {
            try {
                block.call(self, done);
            } catch (err) {
                done();
                var msg = "block failed in runAsync with " + (err.message || err);
                console.log(msg);
                expect(msg).toBe(false);
            }
        });

        waitsFor(function () {
            return isDone;
        }, optionalTimeoutMessage, optionalTimeout);
    };

});