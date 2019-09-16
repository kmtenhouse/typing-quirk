const expect = require('chai').expect;
const Substitution = require("../substitution");
const regexgen = require('regexgen');

describe('substitution-test', function () {
    it('should create a valid substitution from two strings', function () {
        let testSub = new Substitution('w', 'ww');
        expect(testSub.plain.patternToMatch).to.eql(/ww/g);
        expect(testSub.plain.replaceWith).to.equal("w");
        expect(testSub.quirk.patternToMatch).to.eql(/w/g);
        expect(testSub.quirk.replaceWith).to.equal("ww");
        expect(testSub.toPlain("wweh")).to.equal('weh');
        expect(testSub.toQuirk("weh")).to.equal('wweh');
    });

    it('should create a valid substitution from two substitution objects', function () {
        let testSub = new Substitution({
            patternToMatch: /w{2}/g,
            replaceWith: 'w'
        }, {
            patternToMatch: /w{1}/g,
            replaceWith: 'ww'
        });
        expect(testSub.plain.patternToMatch).to.eql(/w{2}/g);
        expect(testSub.plain.replaceWith).to.equal("w");
        expect(testSub.quirk.patternToMatch).to.eql(/w{1}/g);
        expect(testSub.quirk.replaceWith).to.equal("ww");
        expect(testSub.toPlain("wweh")).to.equal('weh');
        expect(testSub.toQuirk("weh")).to.equal('wweh');
    });

    it('should create a valid substitution from one substitution object and a string', function () {
        let testSub = new Substitution({
            patternToMatch: /w{2}/g,
            replaceWith: 'w'
        }, 'ww');
        expect(testSub.plain.patternToMatch).to.eql(/w{2}/g);
        expect(testSub.plain.replaceWith).to.equal("w");
        expect(testSub.quirk.patternToMatch).to.eql(/w/g);
        expect(testSub.quirk.replaceWith).to.equal("ww");
        expect(testSub.toPlain("wweh")).to.equal('weh');
        expect(testSub.toQuirk("weh")).to.equal('wweh');
    });

    it('should create a valid substitution from one string and one substitution object', function () {
        let testSub = new Substitution('w', {
            patternToMatch: /w{1}/g,
            replaceWith: 'ww'
        });
        expect(testSub.plain.patternToMatch).to.eql(/ww/g);
        expect(testSub.plain.replaceWith).to.equal("w");
        expect(testSub.quirk.patternToMatch).to.eql(/w{1}/g);
        expect(testSub.quirk.replaceWith).to.equal("ww");
        expect(testSub.toPlain("wweh")).to.equal('weh');
        expect(testSub.toQuirk("weh")).to.equal('wweh');
    });

    it('should throw an error when the first argument is not a valid type', function () {
        const badFn = () => { const badQuirk = new Substitution([], 'w'); }
        expect(badFn).to.throw();
    });

    it('should throw an error when the second argument is not a valid type', function () {
        const badFn = () => { const badQuirk = new Substitution('w', 2); }
        expect(badFn).to.throw();
    });

    it('should throw an error when passed an empty string', function () {
        const badFn = () => { const badQuirk = new Substitution('', 'ww'); }
        expect(badFn).to.throw();
    });

    it('should throw an error when provided a subsitution object missing the pattern', function () {
        const badFn = () => { const badQuirk = new Substitution('w', {replaceWith: 'ww'}); }
        expect(badFn).to.throw();
    });

    it('should throw an error when provided a subsitution object missing the replaceWith', function () {
        const badFn = () => { const badQuirk = new Substitution('w', {patternToMatch: /w/g}); }
        expect(badFn).to.throw();
    });


    it('should throw an error when provided a subsitution object with an invalid pattern', function () {
        const badFn = () => { const badQuirk = new Substitution('w', {replaceWith: 'ww', patternToMatch: 2}); }
        expect(badFn).to.throw();
    });

    it('should throw an error when provided a subsitution object with an invalid replaceWith', function () {
        const badFn = () => { const badQuirk = new Substitution('w', {replaceWith: 2, patternToMatch: /w/g}); }
        expect(badFn).to.throw();
    });


});