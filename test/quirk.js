const expect = require('chai').expect;
const Quirk = require('../quirk');

describe('constructor', function () {

    it('should not throw an error when initialized with no data', function () {
        const goodFn = () => {
            let testSub = new Quirk();
        }
        expect(goodFn).not.to.throw();
    });

    it('should throw an error when passing an array to constructor', function () {
        const badFn = () => {
            let testSub = new Quirk([]);
        }
        expect(badFn).to.throw();
    });

    it('should throw an error when passing null to constructor', function () {
        const badFn = () => {
            let testSub = new Quirk(null);
        }
        expect(badFn).to.throw();
    });

    it('should throw an error when passing an invalid type to constructor', function () {
        const badFn = () => {
            let testSub = new Quirk('test');
        }
        expect(badFn).to.throw();
    });

    it('should throw an error when constructor receives too many parameters', function () {
        const badFn = () => {
            let testSub = new Quirk({}, {});
        }
        expect(badFn).to.throw();
    });
});

describe('substitutions', function () {
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
        expect(testSub.toPlain("thii2 ii2 bee e22!")).to.equal('this is bee ess!');
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

describe('prefixes', function () {
    it('should create a valid quirk from prefixes added via addPrefix', function () {
        let testSub = new Quirk();
        testSub.addPrefix('BB')
        expect(testSub.toPlain("BBbats")).to.equal('bats');
        expect(testSub.toQuirk("bats")).to.equal('BBbats');
    });

    it('should create a valid quirk from prefixes with a custom regexp', function () {
        let testSub = new Quirk();
        testSub.addPrefix('BB', /^[B]{2}/)
        expect(testSub.toPlain("BBbats")).to.equal('bats');
        expect(testSub.toQuirk("bats")).to.equal('BBbats');
    });

    it('should create a valid quirk from prefixes added via addPrefix even when special characters are included', function () {
        let testSub = new Quirk();
        testSub.addPrefix('^')
        expect(testSub.toPlain("^bats")).to.equal('bats');
        expect(testSub.toQuirk("bats")).to.equal('^bats');
    });

    it('should throw an error when given an invalid prefix', function () {
        const badFn = () => {
            let testSub = new Quirk();
            testSub.addPrefix('');
        }
        expect(badFn).to.throw();
    });

    it('should throw an error when given an invalid prefix regexp', function () {
        const badFn = () => {
            let testSub = new Quirk();
            testSub.addPrefix('^', /g/);
        }
        expect(badFn).to.throw();
    });

});

describe('separator', function () {
    it('should create a valid quirk from a separator', function () {
        let testSub = new Quirk();
        testSub.addSeparator('*');
        expect(testSub.toPlain("this*is*nonsense")).to.equal('this is nonsense');
        expect(testSub.toQuirk("this is nonsense")).to.equal('this*is*nonsense');
    });

    it('should throw an error when given an invalid separator', function () {
        const badFn = () => {
            let testSub = new Quirk();
            testSub.addSeparator(2);
        }
        expect(badFn).to.throw();
    });
});

describe('sentence case', function () {
    it('should enforce lowercase', function () {
        let testSub = new Quirk();
        testSub.enforceCase('lowercase');
        expect(testSub.toQuirk("HELLO")).to.equal('hello');
        expect(testSub.toQuirk("hello")).to.equal('hello');
        expect(testSub.toQuirk("HEllO")).to.equal('hello');
        expect(testSub.toQuirk("H3lLO")).to.equal('h3llo');
    });

    it('should enforce lowercase even if spelled with weird caps', function () {
        let testSub = new Quirk();
        testSub.enforceCase('lowercASe');
        expect(testSub.toQuirk("HELLO")).to.equal('hello');
        expect(testSub.toQuirk("hello")).to.equal('hello');
        expect(testSub.toQuirk("HEllO")).to.equal('hello');
        expect(testSub.toQuirk("H3lLO")).to.equal('h3llo');
    });

    it('should enforce uppercase', function () {
        let testSub = new Quirk();
        testSub.enforceCase('uppercase');
        expect(testSub.toQuirk("hello")).to.equal('HELLO');
        expect(testSub.toQuirk("HELLO")).to.equal('HELLO');
        expect(testSub.toQuirk("H3lL0")).to.equal('H3LL0');
    });

    it('should enforce uppercase even if spelled with weird caps', function () {
        let testSub = new Quirk();
        testSub.enforceCase('uppeRCase');
        expect(testSub.toQuirk("hello")).to.equal('HELLO');
        expect(testSub.toQuirk("HELLO")).to.equal('HELLO');
        expect(testSub.toQuirk("H3lL0")).to.equal('H3LL0');
    });

  /*   it('should enforce propercase', function () {
        let testSub = new Quirk();
        testSub.enforceCase('propercase');
        expect(testSub.toQuirk("hello. this is a test.")).to.equal("Hello. This is a test.");
    }); */

    it('should throw an error when given an invalid case', function () {
        const badFn = () => {
            let testSub = new Quirk();
            testSub.enforceCase('foo');
        }
        expect(badFn).to.throw();
    });

});

describe('suffixes', function () {

    it('should create a valid quirk from suffixes added via addSuffix', function () {
        let testSub = new Quirk();
        testSub.addSuffix('///');
        expect(testSub.toPlain("this is nonsense///")).to.equal('this is nonsense');
        expect(testSub.toQuirk("this is nonsense")).to.equal('this is nonsense///');
    });

    it('should create a valid quirk from suffixes with a custom regexp', function () {
        let testSub = new Quirk();
        testSub.addSuffix('///', /\/{3}$/);
        expect(testSub.toPlain("this is nonsense///")).to.equal('this is nonsense');
        expect(testSub.toQuirk("this is nonsense")).to.equal('this is nonsense///');
    });

    it('should create a valid quirk from suffixes added via addSuffix even when special characters are included', function () {
        let testSub = new Quirk();
        testSub.addSuffix('$');
        expect(testSub.toPlain("this is nonsense$")).to.equal('this is nonsense');
        expect(testSub.toQuirk("this is nonsense")).to.equal('this is nonsense$');
    });

    it('should throw an error when given an invalid suffix', function () {
        const badFn = () => {
            let testSub = new Quirk();
            testSub.addSuffix('');
        }
        expect(badFn).to.throw();
    });

    it('should throw an error when given an invalid suffix regexp', function () {
        const badFn = () => {
            let testSub = new Quirk();
            testSub.addSuffix('///', /g/);
        }
        expect(badFn).to.throw();
    });

});