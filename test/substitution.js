const expect = require('chai').expect;
const Substitution = require("../substitution");

describe('substitution-test', function () {
    it('should create a valid case-sensitive substitution from a letter and symbol', function () {
        let testSub = new Substitution(/ww/g, "w");
        expect(testSub.pattern).to.eql(/ww/g);
        expect(testSub.plain.text).to.equal("w");
    });

});