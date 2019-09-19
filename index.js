
const Quirk = require("./quirk");
let sollux = new Quirk();
sollux.addSubstitution("i", "ii", {ignoreCase: true});
sollux.addSubstitution("s", "2", {ignoreCase: true});
sollux.addSubstitution("together", "twogether");
sollux.addSubstitution("to", {patternToMatch: /\bto{1,2}\b/gi, replaceWith: 'two'});
console.log(sollux.toQuirk("and the answer is, I don't always remember it bc it's nonsense, so I use the reference at www.regexr.com a lot"));

