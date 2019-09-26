const expect = require('chai').expect;
const Quirk = require('../../quirk');

describe('add plain strip pattern', function () {

    it("should strip characters when fed an input string", function () {
        let testSub = new Quirk();
        testSub.addStripPattern("yyy", { plain: true });
        expect(testSub.toPlain("yyyyou gonna dig that?")).to.equal("You gonna dig that?");
    });

    it("should strip characters when fed an input regexp", function () {
        let testSub = new Quirk();
        testSub.addStripPattern(/y{3}/g, { plain: true });
        expect(testSub.toPlain("yyyyou gonna dig that?")).to.equal("You gonna dig that?");
    });

    it("should not strip characters from plain if plain: true is not specified", function () {
        let testSub = new Quirk();
        testSub.addStripPattern(/y{3}/g);
        expect(testSub.toPlain("yyyyou gonna dig that?")).to.equal("Yyyyou gonna dig that?");
    });


    it('should throw an error when given an invalid input', function () {
        const badFn = () => {
            let testSub = new Quirk();
            testSub.addStripPattern(2);
        }
        expect(badFn).to.throw();
    });

});

describe('add quirk strip pattern', function () {

    it("should strip characters when fed an input string", function () {
        let testSub = new Quirk();
        testSub.addStripPattern("'");
        expect(testSub.toQuirk("That's what she said, isn't it?")).to.equal("Thats what she said, isnt it?");
    });

    it("should strip characters when fed an input regexp", function () {
        let testSub = new Quirk();
        testSub.addStripPattern(/'/g);
        expect(testSub.toQuirk("That's what she said, isn't it?")).to.equal("Thats what she said, isnt it?");
    });

    it('should throw an error when given an invalid input', function () {
        const badFn = () => {
            let testSub = new Quirk();
            testSub.addStripPattern(2);
        }
        expect(badFn).to.throw();
    });

});
