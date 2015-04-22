describe("ErrorStore: When we log an error", function () {

    function ErrorStoreException(message) {
        this.name = 'ErrorStoreException';
        this.date = new Date();
        this.message = message;
//        console.error(this.name + ": " + message)
    }

    ErrorStoreException.prototype = new Error();
    ErrorStoreException.prototype.constructor = ErrorStoreException;

    var ErrorStore;

    beforeEach(function () {
        module("whattobuy");
        inject(function (_ErrorStore_) {
            ErrorStore = _ErrorStore_;
            ErrorStore.clearErrors();
        });
    });

    afterEach(function() {

        inject(function (_ErrorStore_) {
            ErrorStore = _ErrorStore_;
            ErrorStore.clearErrors();
        });
    });

    it("should store max 200 errormessages successfully", (function () {
        for(var i = 0; i < 250; i++) {
            var error = new ErrorStoreException("My little error: " + i);
            ErrorStore.addError(error);
        }

        var errors = ErrorStore.getErrors();
        expect(JSON.stringify(errors[0].myError.message)).toEqual('"My little error: 50"');
        expect(errors.length).toBe(200);
    }));

    it("should store the error into errorlog successfully", (function () {

        var error = new ErrorStoreException("My testerror");
        //var errorDetails = { error: error, date: '2014-09-11T1656' };
        ErrorStore.addError(error);
        var errors = ErrorStore.getErrors();
        expect(JSON.stringify(errors[0].myError)).toEqual(JSON.stringify(error));
        expect(errors.length).toBe(1);
    }));

    it("should store 2 errors into errorlog successfully", (function () {
        var error = new ErrorStoreException("My testerror");
        ErrorStore.addError(error);
        ErrorStore.addError(error);
        var errors = ErrorStore.getErrors();
        expect(JSON.stringify(errors[0].myError)).toEqual(JSON.stringify(error));
        expect(JSON.stringify(errors[1].myError)).toEqual(JSON.stringify(error));
        expect(errors.length).toBe(2);
    }));

    it("should throw an exception if the passed error is not of type Error", (function () {
        var error = new ErrorStoreException("My testerror");
        var catchedError = null;
        try {
            ErrorStore.addError("my custom error");
        }
        catch (err) {
            catchedError = err;
        }
        expect(catchedError).not.toBeNull();
    }));

    it("should store 3 errors into errorlog and sort on date descending successfully", (function () {

        // JavaScript counts months from 0 to 11. January is 0. December is 11.

        var errors = ErrorStore.getErrorsSortedDescending();
        var error1 = new ErrorStoreException("My testerror1");
        ErrorStore.addError(error1, new Date(2014, 10, 21));
        var error2 = new ErrorStoreException("My testerror2");
        ErrorStore.addError(error2, new Date(2014, 10, 19));
        var error3 = new ErrorStoreException("My testerror3");
        ErrorStore.addError(error3, new Date(2014, 10, 20));
        errors = ErrorStore.getErrorsSortedDescending();
        expect(JSON.stringify(errors[0].myError)).toEqual(JSON.stringify(error1));
        expect(JSON.stringify(errors[1].myError)).toEqual(JSON.stringify(error3));
        expect(JSON.stringify(errors[2].myError)).toEqual(JSON.stringify(error2));
        expect(errors.length).toBe(3);
    }));




});