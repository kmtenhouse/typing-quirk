const expect = require('chai').expect;
const Quirk = require('../../quirk');

describe('constructor', function () {

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
});







