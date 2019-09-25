const expect = require('chai').expect;
const Quirk = require('../../quirk');

describe('add quirk strip pattern', function () {

    it("should strip characters when fed an input string", function () {
        let testSub = new Quirk();
        testSub.addQuirkStripPattern("'");
        expect(testSub.toQuirk("That's what she said, isn't it?")).to.equal("Thats what she said, isnt it?");
    });

    it('should throw an error when given an invalid input', function () {
        const badFn = () => {
            let testSub = new Quirk();
            testSub.addQuirkStripPattern(2);
        }
        expect(badFn).to.throw();
    });

});
