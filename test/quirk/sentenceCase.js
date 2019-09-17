const expect = require('chai').expect;
const Quirk = require('../../quirk');

describe('sentence case', function () {
    it('should enforce lowercase', function () {
        let testSub = new Quirk();
        testSub.enforceQuirkCase('lowercase');
        expect(testSub.toQuirk("HELLO")).to.equal('hello');
        expect(testSub.toQuirk("hello")).to.equal('hello');
        expect(testSub.toQuirk("HEllO")).to.equal('hello');
        expect(testSub.toQuirk("H3lLO")).to.equal('h3llo');
    });

    it('should enforce lowercase even if spelled with weird caps', function () {
        let testSub = new Quirk();
        testSub.enforceQuirkCase('lowercASe');
        expect(testSub.toQuirk("HELLO")).to.equal('hello');
        expect(testSub.toQuirk("hello")).to.equal('hello');
        expect(testSub.toQuirk("HEllO")).to.equal('hello');
        expect(testSub.toQuirk("H3lLO")).to.equal('h3llo');
    });

    it('should enforce uppercase', function () {
        let testSub = new Quirk();
        testSub.enforceQuirkCase('uppercase');
        expect(testSub.toQuirk("hello")).to.equal('HELLO');
        expect(testSub.toQuirk("HELLO")).to.equal('HELLO');
        expect(testSub.toQuirk("H3lL0")).to.equal('H3LL0');
    });

    it('should enforce uppercase even if spelled with weird caps', function () {
        let testSub = new Quirk();
        testSub.enforceQuirkCase('uppeRCase');
        expect(testSub.toQuirk("hello")).to.equal('HELLO');
        expect(testSub.toQuirk("HELLO")).to.equal('HELLO');
        expect(testSub.toQuirk("H3lL0")).to.equal('H3LL0');
    });

    it('should throw an error when given an invalid case', function () {
        const badFn = () => {
            let testSub = new Quirk();
            testSub.enforceCase('foo');
        }
        expect(badFn).to.throw();
    });

});
