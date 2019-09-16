/* const utils = require("../utils");
const expect = require('chai').expect;

//matches the 12 special characters in regexps - \ ^ $ . | ? * + ( ) { [ ]
describe('regexp-special-chars', function () {
    it('should escape the \\ character', () => {
        expect(utils.escapeRegExpSpecials("\\")).to.equal("\\\\");
    });

    it('should escape the ^ character', () => {
        expect(utils.escapeRegExpSpecials("^")).to.equal("\\^");
    });

    it('should escape the $ character', () => {
        expect(utils.escapeRegExpSpecials("$")).to.equal("\\$");
    });

    it('should escape the . character', () => {
        expect(utils.escapeRegExpSpecials(".")).to.equal("\\.");
    });

    it('should escape the | character', () => {
        expect(utils.escapeRegExpSpecials("|")).to.equal("\\|");
    });

    it('should escape the ? character', () => {
        expect(utils.escapeRegExpSpecials("?")).to.equal("\\?");
    });

    it('should escape the * character', () => {
        expect(utils.escapeRegExpSpecials("*")).to.equal("\\*");
    });

    it('should escape the + character', () => {
        expect(utils.escapeRegExpSpecials("+")).to.equal("\\+");
    });

    it('should escape the ( character', () => {
        expect(utils.escapeRegExpSpecials("(")).to.equal("\\(");
    });
    
    it('should escape the ) character', () => {
        expect(utils.escapeRegExpSpecials(")")).to.equal("\\)");
    });

    it('should escape the ) character', () => {
        expect(utils.escapeRegExpSpecials("{")).to.equal("\\{");
    });

    it('should escape the [ character', () => {
        expect(utils.escapeRegExpSpecials("[")).to.equal("\\[");
    });

    it('should escape the ] character', () => {
        expect(utils.escapeRegExpSpecials("]")).to.equal("\\]");
    });

    it('should not escape other characters', () => {
        expect(utils.escapeRegExpSpecials("abcdefghijklmnopqrstuvwxyz")).to.equal("abcdefghijklmnopqrstuvwxyz");
    });

    it('should escape midsentence characters', () => {
        expect(utils.escapeRegExpSpecials("ab\\cd$efghijklmnopqrstuvwxyz")).to.equal("ab\\\\cd\\$efghijklmnopqrstuvwxyz");
    });

}); */