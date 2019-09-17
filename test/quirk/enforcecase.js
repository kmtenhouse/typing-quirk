const expect = require('chai').expect;
const Quirk = require('../../quirk');

describe('enforceCase', function () {

    it('should create valid simple lowercase enforcement', function () {
        let testSub = new Quirk();
        testSub.enforceQuirkCase('lowercase');
        expect(testSub.toQuirk("This is so silly")).to.equal('this is so silly');
        expect(testSub.toPlain("this is so silly")).to.equal('this is so silly');
    });

    it('should create valid simple lowercase enforcement when sentence has a .', function () {
        let testSub = new Quirk();
        testSub.enforceQuirkCase('lowercase');
        expect(testSub.toQuirk("This is so silly.")).to.equal('this is so silly.');
        expect(testSub.toPlain("this is so silly.")).to.equal('This is so silly.');
    });

    it('should create valid simple lowercase enforcement in a paragraph with mixed punctuation', function () {
        let testSub = new Quirk();
        testSub.enforceQuirkCase('lowercase');
        expect(testSub.toQuirk("Really? This is so silly. I can't believe I'm doing this!")).to.equal("really? this is so silly. i can't believe i'm doing this!");
        expect(testSub.toPlain("really? this is so silly. i can't believe i'm doing this!")).to.equal("Really? This is so silly. I can't believe I'm doing this!");
    });

    it('should create valid simple uppercase enforcement', function () {
        let testSub = new Quirk();
        testSub.enforceQuirkCase('uppercase');
        expect(testSub.toQuirk("This is so silly")).to.equal('THIS IS SO SILLY');
        expect(testSub.toPlain("THIS IS SO SILLY")).to.equal('this is so silly');
    });

    it('should create valid simple uppercase enforcement when sentence has a .', function () {
        let testSub = new Quirk();
        testSub.enforceQuirkCase('uppercase');
        expect(testSub.toQuirk("This is so silly.")).to.equal('THIS IS SO SILLY.');
        expect(testSub.toPlain("THIS IS SO SILLY.")).to.equal('This is so silly.');
    });

    it('should create valid simple uppercase enforcement in a paragraph with mixed punctuation', function () {
        let testSub = new Quirk();
        testSub.enforceQuirkCase('uppercase');
        expect(testSub.toQuirk("Really? This is so silly. I can't believe I'm doing this!")).to.equal("REALLY? THIS IS SO SILLY. I CAN'T BELIEVE I'M DOING THIS!");
        expect(testSub.toPlain("REALLY? THIS IS SO SILLY. I CAN'T BELIEVE I'M DOING THIS!")).to.equal("Really? This is so silly. I can't believe I'm doing this!");
    });

    it('should throw an error when given an invalid exception string', function () {
        const badFn = () => {
            let testSub = new Quirk();
            testSub.enforceQuirkCase('lowercase', ['a']);
        }
        expect(badFn).to.throw();
    });

});