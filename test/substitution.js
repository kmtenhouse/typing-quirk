const expect = require('chai').expect;
const Substitution = require("../substitution");
const regexgen = require('regexgen');

describe('substitution-test', function () {
    it('should create a valid case-sensitive substitution from a letter', function () {
        let testSub = new Substitution(regexgen(['ww'], 'g'), "w");
        expect(testSub.pattern).to.eql(/ww/g);
        expect(testSub.replaceWith).to.equal("w");
        expect(testSub.encode("wweh")).to.equal('weh');
    });

    it('should create a valid case-sensitive substitution from a symbol', function () {
        let testSub = new Substitution(regexgen(['///'], 'g'), "");
        expect(testSub.pattern).to.eql(/\/\/\//g);
        expect(testSub.replaceWith).to.equal("");
        expect(testSub.encode("hello///")).to.equal('hello');
    });

    it('should throw an error when the first argument is not a regexp', function () {
        const badFn = () => { const badQuirk = new Substitution('ww', 'w'); }
        expect(badFn).to.throw();
    });

    it('should throw an error when the second argument is not a string', function () {
        const badFn = () => { const badQuirk = new Substitution(/ww/g, 2); }
        expect(badFn).to.throw();
    });


});