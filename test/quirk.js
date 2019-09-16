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