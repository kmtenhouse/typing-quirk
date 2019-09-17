const expect = require('chai').expect;
const Quirk = require('../../quirk');

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