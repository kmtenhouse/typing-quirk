/* const Quirk = require("./quirk");
const Sub = require("./substitution");

const eridan = new Quirk(new Sub(/ww/, "w"), new Sub(/w{1}/, "ww"));
console.log(eridan.encode('what is going on here'));
console.log(eridan.decode('wweh wwhat havve i been reduced to')); */

const Sub = require("./substitution"); 

//const eridan = new Sub('w', 'ww');//new Sub({patternToMatch: /w{2}/g, replaceWith: 'w'}, {patternToMatch: /w{1}/g, replaceWith: 'ww'});
let eridan = new Sub({
    patternToMatch: /w{2}/g,
    replaceWith: 'w'
}, 'ww');
console.log(eridan);


console.log('add quirk', eridan.toQuirk('what why is everyone so fuckin mean'));
console.log('remove quirk', eridan.toPlain('wweh wwhy is this happenin to me wwhy'));
