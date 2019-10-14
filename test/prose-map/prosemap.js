const ProseMap = require("../../proseMap");
const expect = require("chai").expect;

describe("prosemap", function () {
    it("should make a new ProseMap from a simple paragraph", function () {
        let testMap = new ProseMap("This is a very simple paragraph. It uses normal English punctuation only!  What's wrong with that?");
        testMap.cleaveSentences();
        expect(testMap.join()).to.equal("This is a very simple paragraph. It uses normal English punctuation only!  What's wrong with that?");
        expect(testMap.join()).to.equal(testMap.original);
    });

    it("should make a new ProseMap from a paragraph with multiple punctuations", function () {
        let testMap = new ProseMap("This is a very simple paragraph!? It uses normal English punctuation only!!!!  What's wrong with that???");
        testMap.cleaveSentences();
        expect(testMap.join()).to.equal("This is a very simple paragraph!? It uses normal English punctuation only!!!!  What's wrong with that???");
        expect(testMap.join()).to.equal(testMap.original);
    });
    
    it("should make a new ProseMap from a paragraph with quotes", function () {
        let testMap = new ProseMap('"Eight bits are enough for me," she said. "This is not where I should be. My life is formed from information."');
        testMap.cleaveSentences();
        expect(testMap.join()).to.equal('"Eight bits are enough for me," she said. "This is not where I should be. My life is formed from information."');
        expect(testMap.join()).to.equal(testMap.original);
    });

    it("should make a new ProseMap from a paragraph with single quotes", function () {
        let testMap = new ProseMap("'Eight bits are enough for me,' she said. 'This is not where I should be.'");
        testMap.cleaveSentences();
        expect(testMap.join()).to.equal("'Eight bits are enough for me,' she said. 'This is not where I should be.'");
        expect(testMap.join()).to.equal(testMap.original);
    });

});