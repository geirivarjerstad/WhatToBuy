describe("UUID", function () {

    var $scope, UUID;

    beforeEach(function () {
        module("whattobuy");


        inject(function ($injector, $rootScope) {

            $scope = $rootScope.$new();
            UUID = $injector.get(toolNames.UUID);

        });
    });

    it("should generate a valid UUID", function () {
        var uuid = UUID.generateUUID();

        $scope.$digest();

        expect(uuid).not.toBeNull();
        expect(uuid).not.toBe("");
    });

    it("should generate a 1000 unique UUIDs", function () {

        var uuidAssociativeArray = {};
        for (var i = 0; i < 1000; i++) {
            var uuid = UUID.generateUUID();
            uuidAssociativeArray[uuid] = uuid;
        }

        var keyCount = 0;
        for (var key in uuidAssociativeArray) {
            keyCount++;
        }

        expect(keyCount).toBe(1000);

    });

});