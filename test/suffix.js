/* const expect = require('chai').expect;
const Quirk = require("../quirk");

describe('suffix-test', function () {
    it('should create a valid suffix from a string of letters', function () {
        const letterSuffix = new Quirk({ suffix: "abc" });
        expect(letterSuffix.suffix.pattern).to.eql(/abc$/);
    });

    it('should create a valid suffix when using set', function () {
        const letterSuffix = new Quirk();
        letterSuffix.setSuffix("abc");
        expect(letterSuffix.suffix.pattern).to.eql(/abc$/);
    });

    it('should create a valid suffix from a $', function () {
        const letterSuffix = new Quirk({ suffix: "$" });
        expect(letterSuffix.suffix.pattern).to.eql(/\$$/);
    });

    it('should throw an error when no suffix value is provided', function () {
        const badFn = () => { const badQuirk = new Quirk({ suffix: "" }); }
        expect(badFn).to.throw();
    });

    it('should throw an error when the suffix is not a string', function () {
        const badFn = () => { const badQuirk = new Quirk({ suffix: [] }); }
        expect(badFn).to.throw();
    });
}); */