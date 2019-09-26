const expect = require("chai").expect;
const Quirk = require("../../quirk");

describe("setSentenceCase - uppercase", function () {
    it('should enforce uppercase', function () {
        let testSub = new Quirk();
        testSub.setSentenceCase('uppercase');
        expect(testSub.toQuirk("hello")).to.equal('HELLO');
        expect(testSub.toQuirk("HELLO")).to.equal('HELLO');
        expect(testSub.toQuirk("H3lL0")).to.equal('H3LL0');
    });

    it('should enforce uppercase even if spelled with weird caps', function () {
        let testSub = new Quirk();
        testSub.setSentenceCase('uppeRCase');
        expect(testSub.toQuirk("hello")).to.equal('HELLO');
        expect(testSub.toQuirk("HELLO")).to.equal('HELLO');
        expect(testSub.toQuirk("H3lL0")).to.equal('H3LL0');
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
        testSub.setSentenceCase("uppercase", { exceptions: "u" });
        expect(testSub.toQuirk("I LOVE you SO MUCH!")).to.equal("I LOVE YOu SO MUCH!");
        expect(testSub.toPlain("I LOVE YOu SO MUCH TOO!")).to.equal("I love you so much too!");
    });

    it("should create valid uppercase enforcement with multiple adjacent lowercase exceptions", function () {
        let testSub = new Quirk();
        testSub.setSentenceCase("uppercase", { exceptions: "sea" });
        expect(testSub.toQuirk("she sells sea shells by the sea shore.")).to.equal("sHe seLLs sea sHeLLs BY THe sea sHORe.");
        expect(testSub.toPlain("sHe sELLs sea sHeLLs BY THe sea sHORe.")).to.equal("She sells sea shells by the sea shore.");
    });

    it("should have no effect on a uppercase enforcement with uppercase exception", function () {
        let testSub = new Quirk();
        testSub.setSentenceCase("uppercase", { exceptions: "U" });
        expect(testSub.toQuirk("I love YOU so much!")).to.equal("I LOVE YOU SO MUCH!");
        expect(testSub.toPlain("I LOVE YOU SO MUCH TOO!")).to.equal("I love you so much too!");
    });

    it("should throw an error when given an invalid exception string", function () {
        const badFn = () => {
            let testSub = new Quirk();
            testSub.setSentenceCase("uppercase", 2);
        }
        expect(badFn).to.throw();
    });

});