const expect = require('chai').expect;
const Quirk = require("../quirk");

describe('decode-test', function () {
    it('should decode a sentence with a prefix', function () {
        const letterPrefix = new Quirk({ prefix: "#" });
        expect(letterPrefix.decode("#hello world!")).to.equal("hello world!");
    });

    it('should decode a sentence with a suffix', function () {
        const letterPrefix = new Quirk({ suffix: "#" });
        expect(letterPrefix.decode("hello world!#")).to.equal("hello world!");
    });

});