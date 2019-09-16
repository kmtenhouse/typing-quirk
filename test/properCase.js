const expect = require('chai').expect;
const capitalizeOneSentence = require('../utils').capitalizeOneSentence;

describe('single sentence capitalization', function () {
    it('should capitalize a sentence with no encapsulation', function () {
        expect(capitalizeOneSentence("this is a test.")).to.equal("This is a test.");
    });

    it('should capitalize a sentence with quotes', function () {
        expect(capitalizeOneSentence("\"this is a test.\"")).to.equal("\"This is a test.\"");
    });

    it('should capitalize a sentence with single quotes', function () {
        expect(capitalizeOneSentence("'this is a test.'")).to.equal("'This is a test.'");
    });

    it('should capitalize a sentence with back ticks', function () {
        expect(capitalizeOneSentence("`this is a test.`")).to.equal("`This is a test.`");
    });

    it('should capitalize a sentence with parenthesis', function () {
        expect(capitalizeOneSentence("(this is a test.)")).to.equal("(This is a test.)");
    });

    it('should not change an already capitalized sentence', function () {
        expect(capitalizeOneSentence("This is a test.")).to.equal("This is a test.");
    });
});