const expect = require("chai").expect;
const Quirk = require("../../quirk");

describe("set capitalize fragments", function () {
    it("should capitalize sentence fragments", function () {
        let testSub = new Quirk();
        testSub.setCapitalizeFragments(true);
        expect(testSub.toPlain("hello my name is karkat")).to.equal("Hello my name is karkat");
    });

    it("should throw an error when given an invalid type", function () {
        const badFn = () => {
            let testSub = new Quirk();
            testSub.setCapitalizeFragments([]);
        }
        expect(badFn).to.throw();
    });
});
