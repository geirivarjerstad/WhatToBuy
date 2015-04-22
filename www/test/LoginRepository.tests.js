
describe("LoginRepository tests", function () {

    var $scope, MockLoginService, deferred, MockLoginStore;

    var LoginRepository, MockLoginRepository;
    var MockLoginServiceEnt;

    // LoginService, LoginStore, $q
    beforeEach(module('whattobuy'));


    beforeEach(module(function ($provide) {

        MockLoginStore = {
            saveLoginDetails: function () { },
            getLoginDetails: function () { return {"feedId":"feedME!","password":"knockknock"} },
            hasLoginDetails: function () { return false }
        };

        $provide.value('LoginStore', MockLoginStore);

        spyOn(MockLoginStore, "saveLoginDetails").and.callThrough();

    }));

    beforeEach(function () {
//        module("whattobuy");

        inject(function ($rootScope, $controller, $q, $injector, LoginService) {
            $scope = $rootScope.$new();

            LoginRepository = $injector.get('LoginRepository');

            deferred = $q.defer();

            spyOn(LoginService, 'authenticate').and.returnValue(deferred.promise);

//            spyOn(MockLoginService, "authenticate").and.callFake(function() {
//                return 1001;
//            });
//            spyOn(MockLoginServiceEnt, "authenticate").and.callFake(function() {
//                return 1001;
//            });
        });
    });

    it("test authenticated success and feed exists", function () {
        var repo = LoginRepository;
        repo.authenticate("asdasd1", "asdasd2").then(function (data) {
            expect(data.isSuccess).toBe(true);
            expect(data.userExists).toBe(true);
        });

        deferred.resolve({"isSuccess":true,"userExists":true});
        $scope.$digest();

        expect(MockLoginStore.saveLoginDetails).toHaveBeenCalled();
    });

    it("test authentication failed and feed exists", function () {
        var repo = LoginRepository;
        repo.authenticate("asdasd1", "asdasd2").then(function (data) {
            expect(data.isSuccess).toBe(false);
            expect(data.userExists).toBe(true);
        });

        deferred.resolve({"isSuccess":false,"userExists":true});
        $scope.$digest();

        expect(MockLoginStore.saveLoginDetails).not.toHaveBeenCalled();
    });

    it("test authentication failed and feed does not exists", function () {
        var repo = LoginRepository;
        repo.authenticate("asdasd1", "asdasd2").then(function (data) {}, function (reason) {
            expect(reason).not.toBeNull();
        });

        deferred.resolve({"isSuccess":false,"userExists":false});
        $scope.$digest();

        expect(MockLoginStore.saveLoginDetails).not.toHaveBeenCalled();
    });

    it("test authentication when service authentication fails", function () {
        var repo = LoginRepository;
        repo.authenticate("asdasd1", "asdasd2").then(function (data) {}, function (reason) {
            console.log(reason);
            expect(reason).not.toBeNull();
        });

        deferred.reject("Something's amiss!");
        $scope.$digest();

        expect(MockLoginStore.saveLoginDetails).not.toHaveBeenCalled();
    });

});
