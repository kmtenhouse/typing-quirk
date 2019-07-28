const expect = require('chai').expect;
const should = require('chai').should;
const Quirk = require("../quirk");

describe('suffix-test', function () {
    it('should create a valid suffix from a string of letters', function () {
        const letterSuffix = new Quirk({ suffix: "abc" });
        expect(letterSuffix.suffix).to.eql(/abc$/);
    });

    it('should create a valid suffix when using set', function () {
        const letterSuffix = new Quirk();
        letterSuffix.setSuffix("abc");
        expect(letterSuffix.suffix).to.eql(/abc$/);
    });

    it('should create a valid suffix from a $', function () {
        const letterSuffix = new Quirk({ suffix: "$" });
        expect(letterSuffix.suffix).to.eql(/\$$/);
    });

    it('should throw an error when no suffix value is provided', function () {
        const badFn = () => { const badQuirk = new Quirk({ suffix: "" }); }
        expect(badFn).to.throw();
    });
});