const expect = require('chai').expect;
const Quirk = require('../../quirk');

describe('add quirk exception', function () {
    it("should ignore words that are listed as exceptions when performing substitutions", function () {
        let testSub = new Quirk();
        testSub.addQuirkException("hello");
        testSub.addSubstitution("e", "3", {ignoreCase: true});
        expect(testSub.toQuirk("hello can you hear me")).to.equal("hello can you h3ar m3");
    });

    it("should allow input as regexp", function () {
        let testSub = new Quirk();
        testSub.addQuirkException(/hel[a-z]*/i);
        testSub.addSubstitution("e", "3", {ignoreCase: true});
        expect(testSub.toQuirk("hello can you hear me")).to.equal("hello can you h3ar m3");
        expect(testSub.toQuirk("HELP I NEED HELP!")).to.equal("HELP I N33D HELP!");
    });

    it("should ignore words that are listed as exceptions in a case-sensitive fashion when passed the correct option", function () {
        let testSub = new Quirk();
        testSub.addQuirkException("hello", {ignoreCase: true});
        testSub.addSubstitution("e", "3", {ignoreCase: true});
        expect(testSub.toQuirk("hello can you hear me")).to.equal("hello can you h3ar m3");
        expect(testSub.toQuirk("HELLO CAN YOU HEAR ME")).to.equal("HELLO CAN YOU H3AR M3");
        expect(testSub.toQuirk("Hello Can You Hear Me")).to.equal("Hello Can You H3ar M3");
    });

    it('should throw an error when given an invalid input', function () {
        const badFn = () => {
            let testSub = new Quirk();
            testSub.addQuirkException(2);
        }
        expect(badFn).to.throw();
    });

});
