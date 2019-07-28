const Quirk = require("../quirk");
const expect = require('chai').expect;

//matches the 12 special characters in regexps - \ ^ $ . | ? * + ( ) { [ ]
describe('regexp-special-chars', function () {
    const testQuirk = new Quirk();
    it('should escape the \\ character', () => {
        expect(testQuirk.escapeRegExpSpecials("\\")).to.equal("\\\\");
    });

    it('should escape the ^ character', () => {
        expect(testQuirk.escapeRegExpSpecials("^")).to.equal("\\^");
    });

    it('should escape the $ character', () => {
        expect(testQuirk.escapeRegExpSpecials("$")).to.equal("\\$");
    });

    it('should escape the . character', () => {
        expect(testQuirk.escapeRegExpSpecials(".")).to.equal("\\.");
    });

    it('should escape the | character', () => {
        expect(testQuirk.escapeRegExpSpecials("|")).to.equal("\\|");
    });

    it('should escape the ? character', () => {
        expect(testQuirk.escapeRegExpSpecials("?")).to.equal("\\?");
    });

    it('should escape the * character', () => {
        expect(testQuirk.escapeRegExpSpecials("*")).to.equal("\\*");
    });

    it('should escape the + character', () => {
        expect(testQuirk.escapeRegExpSpecials("+")).to.equal("\\+");
    });

    it('should escape the ( character', () => {
        expect(testQuirk.escapeRegExpSpecials("(")).to.equal("\\(");
    });
    
    it('should escape the ) character', () => {
        expect(testQuirk.escapeRegExpSpecials(")")).to.equal("\\)");
    });

    it('should escape the ) character', () => {
        expect(testQuirk.escapeRegExpSpecials("{")).to.equal("\\{");
    });

    it('should escape the [ character', () => {
        expect(testQuirk.escapeRegExpSpecials("[")).to.equal("\\[");
    });

    it('should escape the ] character', () => {
        expect(testQuirk.escapeRegExpSpecials("]")).to.equal("\\]");
    });

    it('should not escape other characters', () => {
        expect(testQuirk.escapeRegExpSpecials("abcdefghijklmnopqrstuvwxyz")).to.equal("abcdefghijklmnopqrstuvwxyz");
    });

    it('should escape midsentence characters', () => {
        expect(testQuirk.escapeRegExpSpecials("ab\\cd$efghijklmnopqrstuvwxyz")).to.equal("ab\\\\cd\\$efghijklmnopqrstuvwxyz");
    });

});