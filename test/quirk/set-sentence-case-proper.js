const expect = require("chai").expect;
const Quirk = require("../../quirk");

describe("setSentenceCase -- propercase", function () {
  
    it("should propercase sentence fragments", function () {
        let testSub = new Quirk();
        testSub.setSentenceCase("propercase");
        expect(testSub.toQuirk("this is really quite silly")).to.equal("This is really quite silly");
        expect(testSub.toPlain("This is so silly")).to.equal("This is so silly");
    });

    it("should create valid simple propercase enforcement when sentence has a .", function () {
        let testSub = new Quirk();
        testSub.setSentenceCase("propercase");
        expect(testSub.toQuirk("this is so silly.")).to.equal("This is so silly.");
        expect(testSub.toPlain("This is so silly.")).to.equal("This is so silly.");
    });

    it("should create valid propercase enforcement with a lowercase exception", function () {
        let testSub = new Quirk();
        testSub.setSentenceCase("propercase", { exceptions: "t" });
        expect(testSub.toQuirk("this is so silly.")).to.equal("this is so silly.");
        expect(testSub.toPlain("this is so silly.")).to.equal("This is so silly.");
    });

    it("should create valid propercase that ignores uppercase exceptions (as those don't make sense)", function () {
        let testSub = new Quirk();
        testSub.setSentenceCase("propercase", { exceptions: "T" });
        expect(testSub.toQuirk("this is so silly.")).to.equal("This is so silly.");
        expect(testSub.toPlain("This is so silly.")).to.equal("This is so silly.");
    });

    it("should create valid simple propercase enforcement in a paragraph with mixed punctuation", function () {
        let testSub = new Quirk();
        testSub.setSentenceCase("propercase");
        expect(testSub.toQuirk("really? THIS IS SO SILLY. I can't believe I'm doing this!")).to.equal("Really? This is so silly. I can't believe I'm doing this!");
        expect(testSub.toPlain("Really? This is so silly. I can't believe I'm doing this!")).to.equal("Really? This is so silly. I can't believe I'm doing this!");
    });


    it("should create valid simple propercase enforcement in a paragraph first person pronouns of mixed case", function () {
        let testSub = new Quirk();
        testSub.setSentenceCase("propercase");
        expect(testSub.toQuirk("really? THIS IS SO SILLY. i can't believe I'm doing this!")).to.equal("Really? This is so silly. I can't believe I'm doing this!");
        expect(testSub.toPlain("Really? This is so silly. I can't believe I'm doing this!")).to.equal("Really? This is so silly. I can't believe I'm doing this!");
    });


    it("should throw an error when given an invalid exception string", function () {
        const badFn = () => {
            let testSub = new Quirk();
            testSub.setSentenceCase("propercase", 40);
        }
        expect(badFn).to.throw();
    });

});