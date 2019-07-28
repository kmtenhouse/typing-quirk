const expect = require('chai').expect;
const Quirk = require("../quirk");

describe('prefix-test', function () {
    it('should create a valid prefix from a string of letters', function () {
        const letterPrefix = new Quirk({ prefix: "abc" });
        expect(letterPrefix.prefix.pattern).to.eql(/^abc/);
    });

    it('should create a valid prefix when using set', function () {
        const letterPrefix = new Quirk();
        letterPrefix.setPrefix("abc");
        expect(letterPrefix.prefix.pattern).to.eql(/^abc/);
    });

    it('should create a valid prefix from a ^', function () {
        const letterPrefix = new Quirk({ prefix: "^" });
        expect(letterPrefix.prefix.pattern).to.eql(/^\^/);
    });

    it('should throw an error when no prefix value is provided', function () {
        const badFn = () => { const badQuirk = new Quirk({ prefix: "" }); }
        expect(badFn).to.throw();
    });

    it('should throw an error when the prefix is not a string', function () {
        const badFn = () => { const badQuirk = new Quirk({ prefix: [] }); }
        expect(badFn).to.throw();
    });
});