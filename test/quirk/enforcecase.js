const expect = require("chai").expect;
const Quirk = require("../../quirk");

describe("setSentenceCase", function () {

    it("should not propercase sentence fragments", function () {
        let testSub = new Quirk();
        testSub.setSentenceCase("propercase");
        expect(testSub.toQuirk("this is so silly")).to.equal("this is so silly");
        expect(testSub.toPlain("this is so silly")).to.equal("this is so silly");
    });

    it("should create valid simple propercase enforcement when sentence has a .", function () {
        let testSub = new Quirk();
        testSub.setSentenceCase("propercase");
        expect(testSub.toQuirk("this is so silly.")).to.equal("This is so silly.");
        expect(testSub.toPlain("This is so silly.")).to.equal("This is so silly.");
    });

    it("should create valid propercase enforcement with a lowercase exception", function () {
        let testSub = new Quirk();
        testSub.setSentenceCase("propercase", {exceptions: "t"});
        expect(testSub.toQuirk("this is so silly.")).to.equal("this is so silly.");
        expect(testSub.toPlain("this is so silly.")).to.equal("This is so silly.");
    });

    it("should create valid propercase that ignores uppercase exceptions (as those don't make sense)", function () {
        let testSub = new Quirk();
        testSub.setSentenceCase("propercase", {exceptions: "T"});
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

    it("should create valid simple lowercase enforcement", function () {
        let testSub = new Quirk();
        testSub.setSentenceCase("lowercase");
        expect(testSub.toQuirk("This is so silly")).to.equal("this is so silly");
        expect(testSub.toPlain("this is so silly")).to.equal("this is so silly");
    });

    it("should create valid lowercase enforcement with uppercase exception", function () {
        let testSub = new Quirk();
        testSub.setSentenceCase("lowercase", {exceptions: "U"});
        expect(testSub.toQuirk("I LOVE YOU SO MUCH!")).to.equal("i love yoU so mUch!");
        expect(testSub.toPlain("i love yoU so mUch too!")).to.equal("I love you so much too!");
    });

    it("should create valid lowercase enforcement with multiple adjacent uppercase exceptions", function () {
        let testSub = new Quirk();
        testSub.setSentenceCase("lowercase", {exceptions: "SEA"});
        expect(testSub.toQuirk("SHE SELLS SEA SHELLS BY THE SEA SHORE.")).to.equal("ShE SEllS SEA ShEllS by thE SEA ShorE.");
        expect(testSub.toPlain("ShE SEllS SEA ShEllS by the SEA ShorE.")).to.equal("She sells sea shells by the sea shore.");
    });
    

    it("should have no effect on a lowercase enforcement with lowercase exception", function () {
        let testSub = new Quirk();
        testSub.setSentenceCase("lowercase", {exceptions: "u"});
        expect(testSub.toQuirk("I love you so much!")).to.equal("i love you so much!");
        expect(testSub.toPlain("i love you so much too!")).to.equal("I love you so much too!");
    });

    it("should create valid simple lowercase enforcement when sentence has a .", function () {
        let testSub = new Quirk();
        testSub.setSentenceCase("lowercase");
        expect(testSub.toQuirk("This is so silly.")).to.equal("this is so silly.");
        expect(testSub.toPlain("this is so silly.")).to.equal("This is so silly.");
    });

    it("should create valid simple lowercase enforcement in a paragraph with mixed punctuation", function () {
        let testSub = new Quirk();
        testSub.setSentenceCase("lowercase");
        expect(testSub.toQuirk("Really? This is so silly. I can't believe I'm doing this!")).to.equal("really? this is so silly. i can't believe i'm doing this!");
        expect(testSub.toPlain("really? this is so silly. i can't believe i'm doing this!")).to.equal("Really? This is so silly. I can't believe I'm doing this!");
    });

    it("should create valid simple uppercase enforcement", function () {
        let testSub = new Quirk();
        testSub.setSentenceCase("uppercase");
        expect(testSub.toQuirk("This is so silly")).to.equal("THIS IS SO SILLY");
        expect(testSub.toPlain("THIS IS SO SILLY")).to.equal("this is so silly");
    });

    it("should create valid simple uppercase enforcement when sentence has a .", function () {
        let testSub = new Quirk();
        testSub.setSentenceCase("uppercase");
        expect(testSub.toQuirk("This is so silly.")).to.equal("THIS IS SO SILLY.");
        expect(testSub.toPlain("THIS IS SO SILLY.")).to.equal("This is so silly.");
    });

    it("should create valid simple uppercase enforcement in a paragraph with mixed punctuation", function () {
        let testSub = new Quirk();
        testSub.setSentenceCase("uppercase");
        expect(testSub.toQuirk("Really? This is so silly. I can't believe I'm doing this!")).to.equal("REALLY? THIS IS SO SILLY. I CAN'T BELIEVE I'M DOING THIS!");
        expect(testSub.toPlain("REALLY? THIS IS SO SILLY. I CAN'T BELIEVE I'M DOING THIS!")).to.equal("Really? This is so silly. I can't believe I'm doing this!");
    });

    it("should create valid uppercase enforcement with lowercase exception", function () {
        let testSub = new Quirk();
        testSub.setSentenceCase("uppercase", {exceptions: "u"});
        expect(testSub.toQuirk("I LOVE you SO MUCH!")).to.equal("I LOVE YOu SO MUCH!");
        expect(testSub.toPlain("I LOVE YOu SO MUCH TOO!")).to.equal("I love you so much too!");
    });

    it("should create valid uppercase enforcement with multiple adjacent lowercase exceptions", function () {
        let testSub = new Quirk();
        testSub.setSentenceCase("uppercase", {exceptions: "sea"});
        expect(testSub.toQuirk("she sells sea shells by the sea shore.")).to.equal("sHe seLLs sea sHeLLs BY THe sea sHORe.");
        expect(testSub.toPlain("sHe sELLs sea sHeLLs BY THe sea sHORe.")).to.equal("She sells sea shells by the sea shore.");
    });
    
    it("should have no effect on a uppercase enforcement with uppercase exception", function () {
        let testSub = new Quirk();
        testSub.setSentenceCase("uppercase", {exceptions: "U"});
        expect(testSub.toQuirk("I love YOU so much!")).to.equal("I LOVE YOU SO MUCH!");
        expect(testSub.toPlain("I LOVE YOU SO MUCH TOO!")).to.equal("I love you so much too!");
    });

    it("should throw an error when given an invalid exception string", function () {
        const badFn = () => {
            let testSub = new Quirk();
            testSub.setSentenceCase("lowercase", ["a"]);
        }
        expect(badFn).to.throw();
    });

});