const Quirk = require("./quirk");
const utils = require("./utils");

let callie = new Quirk();
callie.addSubstitution('u', 'U');
callie.addSubstitution('U', 'U');
callie.enforceQuirkCase('lowercase', 'U');
console.log(callie.toQuirk("I love you so much uwu"));
console.log(callie.toPlain("i love you so much UwU"));

let caliborn = new Quirk();
caliborn.addSubstitution('U', 'u');
caliborn.addSubstitution('u', 'u');
caliborn.enforceQuirkCase('uppercase', 'u');
console.log(caliborn.toQuirk("what a conincidence I hate you too you suck"))
console.log(caliborn.toPlain("I REALLY DON't HAVE WORDS FOR HOW MuCH I DESPISE YOu! YOu SuCk!"));

let testSub = new Quirk();
testSub.addSubstitution('w', 'ww');
testSub.addSubstitution('v', 'vv');
console.log(testSub.toQuirk('Weh everyone is mean'));

console.log(testSub.toPlain('wweh evveryone is mean'));