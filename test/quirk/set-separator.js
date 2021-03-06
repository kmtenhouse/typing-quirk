const expect = require('chai').expect;
const Quirk = require("../../index");

describe('separator', function () {

    it('should create a valid quirk from a combination word and sentence separator', function () {
        let testSub = new Quirk();
        testSub.setSeparator('*');
        expect(testSub.toQuirk("this is nonsense. I hope you have a good explanation! Seriously? Why.")).to.equal('this*is*nonsense.*I*hope*you*have*a*good*explanation!*Seriously?*Why.');
        expect(testSub.toPlain("this*is*nonsense.*I*hope*you*have*a*good*explanation!*Seriously?*Why.")).to.equal('This is nonsense. I hope you have a good explanation! Seriously? Why.');
    });

    it('should create a valid quirk that has a different sentence and word separator', function () {
        let testSub = new Quirk();
        testSub.setSeparator('*', { word: true, sentence: false });
        testSub.setSeparator('++', { word: false, sentence: true });
        expect(testSub.toQuirk("this is nonsense. I hope you have a good explanation! Seriously? Why.")).to.equal('this*is*nonsense.++I*hope*you*have*a*good*explanation!++Seriously?++Why.');
        expect(testSub.toPlain("this*is*nonsense.++I*hope*you*have*a*good*explanation!++Seriously?++Why.")).to.equal('This is nonsense. I hope you have a good explanation! Seriously? Why.');
    });

    it('should create a valid quirk that has a word separator only', function () {
        let testSub = new Quirk();
        testSub.setSeparator('*', { word: true, sentence: false });
        expect(testSub.toQuirk("this is nonsense. I hope you have a good explanation! Seriously? Why.")).to.equal('this*is*nonsense. I*hope*you*have*a*good*explanation! Seriously? Why.');
        expect(testSub.toPlain("this*is*nonsense. I*hope*you*have*a*good*explanation! Seriously? Why.")).to.equal('This is nonsense. I hope you have a good explanation! Seriously? Why.');
    });

    it('should create a valid quirk that has a sentence separator only', function () {
        let testSub = new Quirk();
        testSub.setSeparator('+', { word: false, sentence: true });
        expect(testSub.toQuirk("this is nonsense. I hope you have a good explanation! Seriously? Why.")).to.equal('this is nonsense.+I hope you have a good explanation!+Seriously?+Why.');
        expect(testSub.toPlain("this is nonsense.+I hope you have a good explanation!+Seriously?+Why.")).to.equal('This is nonsense. I hope you have a good explanation! Seriously? Why.');
    });


    it('should throw an error when given an invalid separator', function () {
        const badFn = () => {
            let testSub = new Quirk();
            testSub.setSeparator(2);
        }
        expect(badFn).to.throw();
    });
});