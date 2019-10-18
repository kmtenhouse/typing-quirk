const expect = require('chai').expect;
const Quirk = require("../../index");

describe('add substitutions', function () {
    it('should create a valid quirk from substitutions added via addSubstitution', function () {
        let testSub = new Quirk();
        testSub.addSubstitution('w', 'ww');
        testSub.addSubstitution('v', 'vv');
        expect(testSub.toPlain("wweh evveryone is mean")).to.equal('weh everyone is mean');
        expect(testSub.toQuirk("weh everyone is mean")).to.equal('wweh evveryone is mean');
    });

    it('should create a valid case-insensitive quirk from substitutions added via addSubstitution', function () {
        let testSub = new Quirk();
        testSub.addSubstitution('i', 'ii', {ignoreCase: true});
        testSub.addSubstitution('s', '2', {ignoreCase: true});
        expect(testSub.toPlain("thii2 ii2 bee e22!")).to.equal('This is bee ess!');
        expect(testSub.toQuirk("this IS BEE ESS!")).to.equal('thii2 ii2 BEE E22!');
    });


    it('should throw an error when given an invalid substitution to add', function () {
        const badFn = () => {
            let testSub = new Quirk();
            testSub.addSubstitution('w');
        }
        expect(badFn).to.throw();
    });

});
