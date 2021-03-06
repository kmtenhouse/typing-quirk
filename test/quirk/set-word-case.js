const expect = require("chai").expect;
const Quirk = require("../../index");

describe("word case", function () {
    it("should enforce first letter capitalization", function () {
        let testSub = new Quirk();
        testSub.setWordCase("capitalize");
        expect(testSub.toQuirk("HELLO MY NAME IS KANAYA")).to.equal("HELLO MY NAME IS KANAYA");
        expect(testSub.toQuirk("hello my name is kanaya")).to.equal("Hello My Name Is Kanaya");
        expect(testSub.toQuirk("HEllO my name is Kanaya")).to.equal("HEllO My Name Is Kanaya");
        expect(testSub.toQuirk("33lLO")).to.equal("33lLO");
    });

    it("should enforce first letter capitalization even when used with lowercase sentence casing", function () {
        let testSub = new Quirk();
        testSub.setWordCase("capitalize");
        testSub.setSentenceCase("lowercase");
        expect(testSub.toQuirk("HELLO MY NAME IS KANAYA.")).to.equal("Hello My Name Is Kanaya.");
        expect(testSub.toQuirk("hello my name is kanaya.")).to.equal("Hello My Name Is Kanaya.");
        expect(testSub.toQuirk("HEllO my name is Kanaya.")).to.equal("Hello My Name Is Kanaya.");
        expect(testSub.toQuirk("33lLO")).to.equal("33llo");
    });

    it("should enforce first letter capitalization even when used with uppercase sentence casing", function () {
        let testSub = new Quirk();
        testSub.setWordCase("capitalize");
        testSub.setSentenceCase("uppercase");
        expect(testSub.toQuirk("HELLO MY NAME IS KANAYA.")).to.equal("HELLO MY NAME IS KANAYA.");
        expect(testSub.toQuirk("hello my name is kanaya.")).to.equal("HELLO MY NAME IS KANAYA.");
        expect(testSub.toQuirk("HEllO my name is Kanaya.")).to.equal("HELLO MY NAME IS KANAYA.");
        expect(testSub.toQuirk("33lLO")).to.equal("33LLO");
    });

    it("should enforce lowercase even if spelled with weird caps", function () {
        let testSub = new Quirk();
        testSub.setWordCase("caPitAlize");
        expect(testSub.toQuirk("hello my name is kanaya")).to.equal("Hello My Name Is Kanaya");
    });

    it("should throw an error when given an invalid type", function () {
        const badFn = () => {
            let testSub = new Quirk();
            testSub.setWordCase(2);
        }
        expect(badFn).to.throw();
    });

    it("should throw an error when given an invalid case name", function () {
        const badFn = () => {
            let testSub = new Quirk();
            testSub.setWordCase("uppercase");
        }
        expect(badFn).to.throw();
    });

});
