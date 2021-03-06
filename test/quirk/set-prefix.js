const expect = require('chai').expect;
const Quirk = require("../../index");

describe('prefixes', function () {
    it('should create a valid sentence prefix', function () {
        let testSub = new Quirk();
        testSub.setPrefix('BB', {sentence: true})
        expect(testSub.toPlain("BBBats are my favorite. BBBaseball too!")).to.equal('Bats are my favorite. Baseball too!');
        expect(testSub.toQuirk("Bats are my favorite. Baseball too!")).to.equal('BBBats are my favorite. BBBaseball too!');
    });

    it('should create a valid paragraph prefix', function () {
        let testSub = new Quirk();
        testSub.setPrefix('D==> ', { paragraph: true});
        expect(testSub.toPlain("D==> I think it behooves us to remain civil. After all, we're only human.")).to.equal("I think it behooves us to remain civil. After all, we're only human.");
        expect(testSub.toQuirk("I think it behooves us to remain civil. After all, we're only human.")).to.equal("D==> I think it behooves us to remain civil. After all, we're only human.");
    });

    it('should create valid prefixes even when special characters are included', function () {
        let testSub = new Quirk();
        testSub.setPrefix('^')
        expect(testSub.toPlain("^bats")).to.equal('bats');
        expect(testSub.toQuirk("bats")).to.equal('^bats');
    });

    it('should create a valid word prefix', function () {
        let testSub = new Quirk();
        testSub.setPrefix('^', { word: true})
        expect(testSub.toPlain("^bats ^are ^rad! ^really. ^why ^are ^you ^running?")).to.equal('Bats are rad! Really. Why are you running?');
        expect(testSub.toQuirk("bats are rad! really. why are you running?")).to.equal('^bats ^are ^rad! ^really. ^why ^are ^you ^running?');
    });

    it('should create a valid sentence prefix, no word', function () {
        let testSub = new Quirk();
        testSub.setPrefix('^o^ ', { sentence: true})
        expect(testSub.toPlain("^o^ bats are rad! ^o^ really. ^o^ why are you running?")).to.equal('Bats are rad! Really. Why are you running?');
        expect(testSub.toQuirk("bats are rad! really. why are you running?")).to.equal('^o^ bats are rad! ^o^ really. ^o^ why are you running?');
    });


    it('should throw an error when given an invalid prefix', function () {
        const badFn = () => {
            let testSub = new Quirk();
            testSub.setPrefix('');
        }
        expect(badFn).to.throw();
    });

});