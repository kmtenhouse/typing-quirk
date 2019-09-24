/* 
const Quirk = require("./quirk");
let sollux = new Quirk();
sollux.addSubstitution("i", "ii", {ignoreCase: true});
sollux.addSubstitution("s", "2", {ignoreCase: true});
sollux.addSubstitution("together", "twogether");
sollux.addSubstitution("to", {patternToMatch: /\bto{1,2}\b/gi, replaceWith: 'two'});
console.log(sollux.toQuirk("and the answer is, I don't always remember it bc it's nonsense, so I use the reference at www.regexr.com a lot"));
 */


 const Quirk = require("./quirk");

let dave = new Quirk();
dave.addSubstitution("what's", "whats", {ignoreCase: true});
dave.addSubstitution("don't", "dont", {ignoreCase: true});
dave.addSubstitution("shouldn't", "shouldnt", {ignoreCase: true});
dave.addStripPattern("'");
dave.setSentenceCase("lowercase");
const result = dave.toQuirk("I don't think anything is going to come of this lol what's up");
console.log(result);
console.log(dave.toPlain(result));

/*  let kanaya = new Quirk();
kanaya.setWordCase('capitalize');
console.log(kanaya.toQuirk("This is really very ridiculous."))
console.log(kanaya.toPlain("This Is All Very Quaint."))
 *//* const Quirk = require("./quirk");
let gamzee = new Quirk();
gamzee.setSentenceCase('alternatingcaps');
console.log(gamzee.toQuirk("what's up my motherfuckin best friend in tha whole entire world :o)")); */