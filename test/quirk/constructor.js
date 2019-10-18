const expect = require('chai').expect;
const Quirk = require("../../index");

describe('constructor', function () {

    it('should not throw an error when initialized with no data', function () {
        const goodFn = () => {
            let testSub = new Quirk();
        }
        expect(goodFn).not.to.throw();
    });

});







