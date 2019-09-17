const Quirk = require("./quirk");
const utils = require("./utils");

let callie = new Quirk();
callie.addSubstitution('u', 'U');
callie.addSubstitution('U', 'U');
callie.enforceQuirkCase('lowercase', 'U');
console.log(callie.toQuirk("I love you so much uwu"));

let caliborn = new Quirk();
caliborn.addSubstitution('U', 'u');
caliborn.addSubstitution('u', 'u');
caliborn.enforceQuirkCase('uppercase', 'u');
console.log(caliborn.toQuirk("what a conincidence I hate you too you suck"))