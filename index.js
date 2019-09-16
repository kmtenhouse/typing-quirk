const Quirk = require("./quirk");

let eridan = new Quirk();
eridan.addSubstitution('w', 'ww', { ignoreCase: true});
eridan.addSubstitution('v', 'vv', {ignoreCase: true});
eridan.enforceCase('lowercase');
console.log(eridan.toQuirk("Why is everyone so mean to me? I swear everyone hates me!"));

let sollux = new Quirk();
sollux.addSubstitution('s', '2', {ignoreCase: true});
sollux.addSubstitution('i', 'ii', {ignoreCase: true});
console.log(sollux.toQuirk("I hate everything so much FUCK!"));
console.log(sollux.toPlain("ii hate everythiing 2o much FUCK!"));