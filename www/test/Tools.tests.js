describe("Tools Unit Testing", function () {

    var UserStore;

    beforeEach(function () {
        module("whattobuy");
    });

    afterEach(function() {


    });
    it('validate field to false if undefined', function () {

        var feedId = {
            mooo : "asdad"
        };

        if (isObjectValid(feedId.mooo1)) {
            throw new Error("variable was null or empty");
        }
    });

    it('validate field to false if undefined', function () {

        var feedId;

        if (isObjectValid(feedId)) {
            throw new Error("variable was null or empty");
        }
    });

    it('validate field to false if null', function () {

        var feedId = null;

        if (isObjectValid(feedId)) {
            throw new Error("variable was null or empty");
        }
    });

    it('validate field to false if empty', function () {

        var feedId = "";

        if (isObjectValid(feedId)) {
            throw new Error("variable was null or empty");
        }
    });


    it('validate field to true if not empty', function () {

        var feedId = "134";

        if (!isObjectValid(feedId)) {
            throw new Error("variable was null or empty");
        }
    });

    it('validate field to true if not empty', function () {

        var feedId = {
            mooo : "asdad"
        };

        if (!isObjectValid(feedId.mooo)) {
            throw new Error("variable was null or empty");
        }
    });
});