const Quirk = require("./quirk");
/* let example = new Quirk();
example.setPrefix(">>");
example.setSuffix("<<");
example.addSubstitution("i", "ii", {ignoreCase: true});
example.addSubstitution("s", "2");
example.setSentenceCase("lowercase");

console.log(example.toQuirk("Check this stuff out! It even works for multiple sentences."));
//Outputs: >>check thii2 2tuff out!<< >>iit even work2 for multiiple 2entence2.<<

console.log(example.toPlain(">>check thii2 2tuff out!<< >>iit even work2 for multiiple 2entence2.<<"));
//Outputs: Check this stuff out! It even works for multiple sentences.  

let gamzee = new Quirk();
gamzee.addWordException(":o)");
gamzee.addWordException("(o:");
gamzee.setSentenceCase("alternatingCaps");
console.log(gamzee.toQuirk("Check this out my wicked bitch tits brother. It's dope af :o) honk (o:"));

let kanaya = new Quirk();
kanaya.setWordCase("capitalize");
console.log(kanaya.toQuirk("This is the only way to get through to you, it seems. What a waste.")) */

let testSub = new Quirk();
testSub.addSubstitution("t", "+", {ignoreCase: true});
testSub.addEmoji("+o+");
const phrases = ["This is nonsense +o+ I can TOTALLY FUCKING BELIEVE IT.", "Why this +o+", "Seriously? I have no idea why.", "a"];

phrases.forEach(phrase => {
    const quirky = testSub.toQuirk(phrase);
    const reverse = testSub.toPlain(quirky);
    console.log(`Quirk: ${quirky}\nPlain: ${reverse}`)
});