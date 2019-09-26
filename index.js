const Quirk = require("./quirk");
/* let example = new Quirk();
example.setSuffix("::");

example.addSubstitution("i", "ii", { ignoreCase: true });
example.addSubstitution("s", "2");
example.setSentenceCase("lowercase");

let result = example.toQuirk("Check this stuff out! It even works for multiple sentences."); */
//Outputs: >>check thii2 2tuff out!<< >>iit even work2 for multiiple 2entence2.<<
//console.log(result);
//console.log(example.toPlain(result));
//Outputs: Check this stuff out! It even works for multiple sentences.

let testSub = new Quirk();
testSub.addEmoji("+o+");
testSub.addSubstitution("t", "+", { ignoreCase: true });
const paragraph = "This is totally ridiculous +o+ who is going to use this feature? +o+ a fragment here. +o+";
const quirkified = testSub.toQuirk(paragraph);
const dequirk = testSub.toPlain(paragraph);
console.log(`Original: ${paragraph}`);
console.log(`To Quirk: ${quirkified}`);
console.log(`To Plain: ${dequirk}`);
