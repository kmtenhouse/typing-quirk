/* 
const Sub = require("./substitution");

const eridan = new Quirk(new Sub(/ww/, "w"), new Sub(/w{1}/, "ww"));
console.log(eridan.encode('what is going on here'));
console.log(eridan.decode('wweh wwhat havve i been reduced to')); */

const Quirk = require("./quirk");

const dismas = new Quirk();
dismas.addSuffix('///');
dismas.addPrefix('^');

console.log(dismas.toQuirk("fuck you"));

