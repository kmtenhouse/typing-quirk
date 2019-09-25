const expect = require('chai').expect;
const Quirk = require('../../quirk');

describe('add plain strip pattern', function () {

    it("should strip characters when fed an input string", function () {
        let testSub = new Quirk();
        testSub.addPlainStripPattern("yyy");
        expect(testSub.toPlain("yyyyou gonna dig that?")).to.equal("You gonna dig that?");
    });

    it("should strip characters when fed an input regexp", function () {
        let testSub = new Quirk();
        testSub.addPlainStripPattern(/y{3}/g);
        expect(testSub.toPlain("yyyyou gonna dig that?")).to.equal("You gonna dig that?");
    });

    it('should throw an error when given an invalid input', function () {
        const badFn = () => {
            let testSub = new Quirk();
            testSub.addPlainStripPattern(2);
        }
        expect(badFn).to.throw();
    });

});
