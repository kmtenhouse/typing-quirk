const expect = require('chai').expect;
const Substitution = require("../substitution");

describe('substitution-test', function () {
    it('should create a valid case-sensitive substitution from a letter and symbol', function () {
        let testSub = new Substitution({quirkText: "#", plainText: "h", isCaseSensitive: true});
        expect(testSub.isCaseSensitive).to.be.true;
        expect(testSub.quirk.pattern).to.eql(/#/g);
        expect(testSub.plain.pattern).to.eql(/h/g);
        expect(testSub.plain.text).to.equal("h");
        expect(testSub.quirk.text).to.equal("#");
    });

});