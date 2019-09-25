const expect = require('chai').expect;
const Quirk = require('../../quirk');

describe('add plain exception', function () {
    it("should ignore words that are listed as exceptions when performing substitutions", function () {
        let testSub = new Quirk();
        testSub.addPlainException("+o+");
        testSub.addSubstitution("t", "+", {ignoreCase: true});
        expect(testSub.toPlain("+his is so dumb +o+")).to.equal("this is so dumb +o+");
    });

    it("should allow input as regexp", function () {
        let testSub = new Quirk();
        testSub.addPlainException(/\+o\+/ig);
        testSub.addSubstitution("t", "+", {ignoreCase: true});
        expect(testSub.toPlain("+his is so dumb +o+")).to.equal("this is so dumb +o+");
        expect(testSub.toPlain("+his is so dumb +O+")).to.equal("this is so dumb +O+");
    });

    it("should ignore words that are listed as exceptions in a case-sensitive fashion when passed the correct option", function () {
        let testSub = new Quirk();
        testSub.addPlainException("STRONG", {ignoreCase: true});
        testSub.addSubstitution("strong", "STRONG", {ignoreCase: true});
        expect(testSub.toPlain("I have a STRONG feeling this will work.")).to.equal("I have a STRONG feeling this will work.");
        expect(testSub.toPlain("I have a StRoNg feeling this will work.")).to.equal("I have a StRoNg feeling this will work.");
    });

    it("should ignore words that are listed as exceptions in a case-sensitive fashion even with propercase", function () {
        let testSub = new Quirk();
        testSub.addPlainException("STRONG", {ignoreCase: true});
        testSub.addSubstitution("strong", "STRONG", {ignoreCase: true});
        testSub.setSentenceCase("propercase");
        expect(testSub.toPlain("I have a STRONG feeling this will work.")).to.equal("I have a STRONG feeling this will work.");
        expect(testSub.toPlain("I have a StRoNg feeling this will work.")).to.equal("I have a StRoNg feeling this will work.");
    });

    it('should throw an error when given an invalid input', function () {
        const badFn = () => {
            let testSub = new Quirk();
            testSub.addPlainException(2);
        }
        expect(badFn).to.throw();
    });

});
