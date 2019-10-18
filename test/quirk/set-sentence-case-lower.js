const expect = require("chai").expect;
const Quirk = require("../../index");

describe("setSentenceCase - lowercase", function () {
    it("should enforce lowercase", function () {
        let testSub = new Quirk();
        testSub.setSentenceCase("lowercase");
        expect(testSub.toQuirk("HELLO")).to.equal("hello");
        expect(testSub.toQuirk("hello")).to.equal("hello");
        expect(testSub.toQuirk("HEllO")).to.equal("hello");
        expect(testSub.toQuirk("H3lLO")).to.equal("h3llo");
    });

    it("should enforce lowercase even if spelled with weird caps", function () {
        let testSub = new Quirk();
        testSub.setSentenceCase("lowercASe");
        expect(testSub.toQuirk("HELLO")).to.equal("hello");
        expect(testSub.toQuirk("hello")).to.equal("hello");
        expect(testSub.toQuirk("HEllO")).to.equal("hello");
        expect(testSub.toQuirk("H3lLO")).to.equal("h3llo");
    });

    it("should create valid simple lowercase enforcement", function () {
        let testSub = new Quirk();
        testSub.setSentenceCase("lowercase");
        expect(testSub.toQuirk("This is so silly")).to.equal("this is so silly");
        expect(testSub.toPlain("this is so silly")).to.equal("this is so silly");
    });

    it("should create valid lowercase enforcement with uppercase exception", function () {
        let testSub = new Quirk();
        testSub.setSentenceCase("lowercase", { exceptions: "U" });
        expect(testSub.toQuirk("I LOVE YOU SO MUCH!")).to.equal("i love yoU so mUch!");
        expect(testSub.toPlain("i love yoU so mUch too!")).to.equal("I love you so much too!");
    });

    it("should create valid lowercase enforcement with multiple adjacent uppercase exceptions", function () {
        let testSub = new Quirk();
        testSub.setSentenceCase("lowercase", { exceptions: "SEA" });
        expect(testSub.toQuirk("SHE SELLS SEA SHELLS BY THE SEA SHORE.")).to.equal("ShE SEllS SEA ShEllS by thE SEA ShorE.");
        expect(testSub.toPlain("ShE SEllS SEA ShEllS by the SEA ShorE.")).to.equal("She sells sea shells by the sea shore.");
    });

    it("should have no effect on a lowercase enforcement with lowercase exception", function () {
        let testSub = new Quirk();
        testSub.setSentenceCase("lowercase", { exceptions: "u" });
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

    it("should throw an error when given an invalid case", function () {
        const badFn = () => {
            let testSub = new Quirk();
            testSub.setSentenceCase("foo");
        }
        expect(badFn).to.throw();
    });

    it("should throw an error when given an invalid exception string", function () {
        const badFn = () => {
            let testSub = new Quirk();
            testSub.setSentenceCase("lowercase", ["a"]);
        }
        expect(badFn).to.throw();
    });

});