const expect = require('chai').expect;
const Quirk = require('../../quirk');

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