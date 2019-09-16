/* const Quirk = require("./quirk");
const Sub = require("./substitution");

const eridan = new Quirk(new Sub(/ww/, "w"), new Sub(/w{1}/, "ww"));
console.log(eridan.encode('what is going on here'));
console.log(eridan.decode('wweh wwhat havve i been reduced to')); */

const regexgen = require('regexgen');
 
const newReg = regexgen(['///'], 'g');
console.log(newReg);

const words = ['this is a test/', 'another test//', 'a third test///'];

words.forEach(word => console.log(word, newReg.test(word)))