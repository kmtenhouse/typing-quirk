const expect = require('chai').expect;
const Quirk = require('../../quirk');

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