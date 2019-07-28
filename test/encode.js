const expect = require('chai').expect;
const Quirk = require("../quirk");

describe('encode-test', function () {
    it('should create a sentence with a prefix', function () {
        const letterPrefix = new Quirk({ prefix: "<" });
        expect(letterPrefix.encode("hello world!")).to.equal("<hello world!");
    });

    it('should create a sentence with a suffix', function () {
        const letterPrefix = new Quirk({ suffix: "<" });
        expect(letterPrefix.encode("hello world!")).to.equal("hello world!<");
    });

    it('should create a sentence with a custom word separator', function () {
        const letterPrefix = new Quirk({ separator: "*" });
        expect(letterPrefix.encode("i am the star child")).to.equal("i*am*the*star*child");
    });

});