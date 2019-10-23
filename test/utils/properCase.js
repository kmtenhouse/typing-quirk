const expect = require('chai').expect;
const capitalizeFirstCharacter = require('../../utils').capitalizeFirstCharacter;
const capitalizeSentences = require("../../utils").capitalizeSentences;

describe('single sentence capitalization', function () {
    it('should capitalize a sentence with no encapsulation', function () {
        expect(capitalizeFirstCharacter("this is a test.")).to.equal("This is a test.");
    });

    it('should capitalize a sentence with quotes', function () {
        expect(capitalizeFirstCharacter("\"this is a test.\"")).to.equal("\"This is a test.\"");
    });

    it('should capitalize a sentence with single quotes', function () {
        expect(capitalizeFirstCharacter("'this is a test.'")).to.equal("'This is a test.'");
    });

    it('should capitalize a sentence with both double and single quotes', function () {
        expect(capitalizeFirstCharacter("\"'this is a test.'\"")).to.equal("\"'This is a test.'\"");
    });


    it('should capitalize a sentence with back ticks', function () {
        expect(capitalizeFirstCharacter("`this is a test.`")).to.equal("`This is a test.`");
    });

    it('should capitalize a sentence with parenthesis', function () {
        expect(capitalizeFirstCharacter("(this is a test.)")).to.equal("(This is a test.)");
    });

    it('should not change an already capitalized sentence', function () {
        expect(capitalizeFirstCharacter("This is a test.")).to.equal("This is a test.");
    });
});
/* 
describe('multi sentence capitalization', function () {
    it('should capitalize a paragraph with no encapsulation', function () {
        expect(capitalizeSentences("this is a test. hooray!")).to.equal("This is a test. Hooray!");
    });

    it('should capitalize a paragraph enclosed in quotes', function () {
        expect(capitalizeSentences("\"this is a test. hooray!\"")).to.equal("\"This is a test. Hooray!\"");
    });

    it('should capitalize a paragraph enclosed in single quotes', function () {
        expect(capitalizeSentences("'this is a test. hooray!'")).to.equal("'This is a test. Hooray!'");
    });

    it('should capitalize a paragraph enclosed in both double and single quotes', function () {
        expect(capitalizeSentences("\"'this is a test. hooray!'\"")).to.equal("\"'This is a test. Hooray!'\"");
    });

    it('should capitalize a paragraph enclosed in parens', function () {
        expect(capitalizeSentences("(this is a test. hooray!)")).to.equal("(This is a test. Hooray!)");
    });

    it('should capitalize a paragraph enclosed in multiple parens', function () {
        expect(capitalizeSentences("((this is a test. hooray!))")).to.equal("((This is a test. Hooray!))");
    });

    it('should capitalize a paragraph with tabbed white space', function () {
        expect(capitalizeSentences("this is a test.    hooray!")).to.equal("This is a test.    Hooray!");
    });

    it('should capitalize a paragraph with mixed forms of white space', function () {
        expect(capitalizeSentences("this is a test.    hooray! hi")).to.equal("This is a test.    Hooray! Hi");
    });

    it('should capitalize a paragraph with mixed interstial white space', function () {
        expect(capitalizeSentences("this is a test.      hooray!")).to.equal("This is a test.      Hooray!");
    });

}); */