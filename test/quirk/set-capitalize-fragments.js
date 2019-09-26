const expect = require("chai").expect;
const Quirk = require("../../quirk");

describe("set capitalize fragments", function () {
    it("should capitalize sentence fragments", function () {
        let testSub = new Quirk();
        testSub.setCapitalizeFragments(true);
        expect(testSub.toPlain("hello my name is karkat")).to.equal("Hello my name is karkat");
    });

    it("should capitalize sentence fragments when used in conjunction with uppercase", function () {
        let testSub = new Quirk();
        testSub.setCapitalizeFragments(true);
        testSub.setSentenceCase("uppercase");
        expect(testSub.toPlain("HELLO MY NAME IS KARKAT")).to.equal("Hello my name is karkat");
    });

    it("should capitalize sentence fragments when used in conjunction with alternatingcase", function () {
        let testSub = new Quirk();
        testSub.setCapitalizeFragments(true);
        testSub.setSentenceCase("alternatingcaps");
        expect(testSub.toPlain("hElLO")).to.equal("Hello");
    });


    it("should capitalize sentence fragments even when that doesn't make sense", function () {
        let testSub = new Quirk();
        testSub.setCapitalizeFragments(true);
        expect(testSub.toPlain("Hello my name is karkat")).to.equal("Hello my name is karkat");
    });

    it("should throw an error when given an invalid type", function () {
        const badFn = () => {
            let testSub = new Quirk();
            testSub.setCapitalizeFragments([]);
        }
        expect(badFn).to.throw();
    });
});
