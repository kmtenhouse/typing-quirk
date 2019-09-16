const expect = require('chai').expect;
const Quirk = require('../quirk');

describe('quirk-test', function () {
    it('should create a valid quirk from substitutions added via addSubstitution', function () {
        let testSub = new Quirk();
        testSub.addSubstitution('w','ww');
        testSub.addSubstitution('v','vv');
        expect(testSub.toPlain("wweh evveryone is mean")).to.equal('weh everyone is mean');
        expect(testSub.toQuirk("weh everyone is mean")).to.equal('wweh evveryone is mean');
    });

    it('should not throw an error when initialized with no data', function () {
        const goodFn = () => { 
            let testSub = new Quirk();
         }
        expect(goodFn).not.to.throw();
    });

    it('should throw an error when passing an array to constructor', function () {
        const badFn = () => { 
            let testSub = new Quirk([]);
         }
        expect(badFn).to.throw();
    });

    it('should throw an error when passing null to constructor', function () {
        const badFn = () => { 
            let testSub = new Quirk(null);
         }
        expect(badFn).to.throw();
    });

    it('should throw an error when passing an invalid type to constructor', function () {
        const badFn = () => { 
            let testSub = new Quirk('test');
         }
        expect(badFn).to.throw();
    });


    it('should throw an error when constructor receives too many parameters', function () {
        const badFn = () => { 
            let testSub = new Quirk({}, {});
         }
        expect(badFn).to.throw();
    });

    it('should throw an error when given an invalid substitution to add', function () {
        const badFn = () => { 
            let testSub = new Quirk();
            testSub.addSubstitution('w');
         }
        expect(badFn).to.throw();
    });

});