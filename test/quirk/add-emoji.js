const expect = require("chai").expect;
const Quirk = require("../../quirk");

describe("add emoji", function () {
    it("should add emoji to both plain and quirk substitution lists", function () {
        let testSub = new Quirk();
        testSub.addEmoji("+o+");
        testSub.addSubstitution("t", "+", {ignoreCase: true});
        expect(testSub.toQuirk("This is totally ridiculous +o+")).to.equal("+his is +o+ally ridiculous +o+");
        expect(testSub.toPlain("+his is +o+ally ridiculous +oo +o+")).to.equal("this is totally ridiculous too +o+");
    });

    it("should except emoji even when dealing with case changes", function () {
        let testSub = new Quirk();
        testSub.addEmoji(":U");
        testSub.setSentenceCase("lowercase");
        testSub.addSubstitution("U", "u");
        expect(testSub.toQuirk("I love yoU :U")).to.equal("i love you :U");
        expect(testSub.toPlain("i love you too :U")).to.equal("I love you too :U");
    });

    it("should throw an error when given an invalid type", function () {
        const badFn = () => {
            let testSub = new Quirk();
            testSub.addEmoji([]);
        }
        expect(badFn).to.throw();
    });
});
