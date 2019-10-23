const expect = require('chai').expect;
const Quirk = require("../../index");

describe('suffixes', function () {

    it('should create a valid sentence quirk as a default', function () {
        let testSub = new Quirk();
        testSub.setSuffix('///');
        expect(testSub.toPlain("this is nonsense///")).to.equal('this is nonsense');
        expect(testSub.toQuirk("this is nonsense")).to.equal('this is nonsense///');
    });

    it('should create a valid quirk from a paragraph suffix alone', function () {
        let testSub = new Quirk();
        testSub.setSuffix('$', { paragraph: true});
        expect(testSub.toPlain("This is nonsense. Seriously.$")).to.equal('This is nonsense. Seriously.');
        expect(testSub.toQuirk("This is nonsense. Seriously.")).to.equal('This is nonsense. Seriously.$');
    });

    it('should create a valid quirk from a sentence suffix alone', function () {
        let testSub = new Quirk();
        testSub.setSuffix('$', {sentence: true});
        expect(testSub.toPlain("this is nonsense$")).to.equal('this is nonsense');
        expect(testSub.toQuirk("this is nonsense")).to.equal('this is nonsense$');
    });

    it('should create a valid quirk from a word suffix alone', function () {
        let testSub = new Quirk();
        testSub.setSuffix('$', { word: true});
        expect(testSub.toPlain("this$ is$ nonsense$")).to.equal('this is nonsense');
        expect(testSub.toQuirk("this is nonsense")).to.equal('this$ is$ nonsense$');
    });


    it('should create a valid quirk from both a sentence prefix and sentence suffix as defaults', function () {
        let testSub = new Quirk();
        testSub.setPrefix('^^^');
        testSub.setSuffix('///');
        expect(testSub.toPlain("^^^this is nonsense.///")).to.equal('This is nonsense.');
        expect(testSub.toQuirk("this is nonsense")).to.equal('^^^this is nonsense///');
    });

    it('should create a valid quirk from both a paragraph prefix and paragraph suffix', function () {
        let testSub = new Quirk();
        testSub.setPrefix('^^^', { paragraph: true } );
        testSub.setSuffix('///',  { paragraph: true });
        expect(testSub.toPlain("^^^Spoons is the best possible cat. We adore him!///")).to.equal('Spoons is the best possible cat. We adore him!');
        expect(testSub.toQuirk("Spoons is the best possible cat. We adore him!")).to.equal('^^^Spoons is the best possible cat. We adore him!///');
    });

    it('should create a valid quirk from both a sentence prefix and sentence suffix', function () {
        let testSub = new Quirk();
        testSub.setPrefix('^^^', { sentence: true });
        testSub.setSuffix('///', { sentence: true });
        expect(testSub.toPlain("^^^this is nonsense.///")).to.equal('This is nonsense.');
        expect(testSub.toQuirk("this is nonsense")).to.equal('^^^this is nonsense///');
    });

    it('should create a valid quirk from both a sentence prefix and sentence suffix with a sentence separator', function () {
        let testSub = new Quirk();
        testSub.setPrefix('^^^', { sentence: true });
        testSub.setSuffix('///', { sentence: true });
        testSub.setSeparator("*", {sentence: true});
        expect(testSub.toPlain("^^^this is nonsense.///*^^^What are we doing?///")).to.equal('This is nonsense. What are we doing?');
        expect(testSub.toQuirk("this is nonsense. What are we doing?")).to.equal('^^^this is nonsense.///*^^^What are we doing?///');
    });

    it('should create a valid quirk from both a word prefix and word suffix', function () {
        let testSub = new Quirk();
        testSub.setPrefix('^', { word: true });
        testSub.setSuffix('$', { word: true });
        expect(testSub.toPlain("^eight$ ^bits$ ^are$ ^enough$ ^for$ ^me.$ ^That$ ^is$ ^fine!$")).to.equal('Eight bits are enough for me. That is fine!');
        expect(testSub.toQuirk("eight bits are enough for me. That is fine!")).to.equal('^eight$ ^bits$ ^are$ ^enough$ ^for$ ^me.$ ^That$ ^is$ ^fine!$');
    });

    it('should create a valid quirk from both a word prefix and word suffix and a word/sentence separator', function () {
        let testSub = new Quirk();
        testSub.setPrefix('^', { word: true });
        testSub.setSuffix('$', { word: true });
        testSub.setSeparator("*");
        expect(testSub.toPlain("^eight$*^bits$*^are$*^enough$*^for$*^me.$*^That$*^is$*^fine!$")).to.equal('Eight bits are enough for me. That is fine!');
        expect(testSub.toQuirk("eight bits are enough for me. That is fine!")).to.equal('^eight$*^bits$*^are$*^enough$*^for$*^me.$*^That$*^is$*^fine!$');
    });

    it('should create a valid quirk from both a word prefix and word suffix and a word separator only', function () {
        let testSub = new Quirk();
        testSub.setPrefix('^', { word: true });
        testSub.setSuffix('$', { word: true });
        testSub.setSeparator("*", { word: true});
        expect(testSub.toPlain("^eight$*^bits$*^are$*^enough$*^for$*^me.$ ^That$*^is$*^fine!$")).to.equal('Eight bits are enough for me. That is fine!');
        expect(testSub.toQuirk("eight bits are enough for me. That is fine!")).to.equal('^eight$*^bits$*^are$*^enough$*^for$*^me.$ ^That$*^is$*^fine!$');
    });

    it('should create a valid quirk from both a word prefix and word suffix and a sentence separator only', function () {
        let testSub = new Quirk();
        testSub.setPrefix('^', { word: true });
        testSub.setSuffix('$', { word: true });
        testSub.setSeparator("*", { sentence: true});
        expect(testSub.toPlain("^eight$ ^bits$ ^are$ ^enough$ ^for$ ^me.$*^That$ ^is$ ^fine!$")).to.equal('Eight bits are enough for me. That is fine!');
        expect(testSub.toQuirk("eight bits are enough for me. That is fine!")).to.equal('^eight$ ^bits$ ^are$ ^enough$ ^for$ ^me.$*^That$ ^is$ ^fine!$');
    });

    it('should throw an error when given an invalid suffix', function () {
        const badFn = () => {
            let testSub = new Quirk();
            testSub.setSuffix('');
        }
        expect(badFn).to.throw();
    });


});