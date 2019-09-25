const Quirk = require("./quirk");

let testSub = new Quirk();
testSub.addEmoji("+o+");
testSub.addSubstitution("t", "+", {ignoreCase: true});
const troll = testSub;

[ "This is totally ridiculous +o+ who is going to use this feature? +o+ I AM SO MAD RN +o+" ].forEach(word => {
    console.group("===========");
    const quirkified = troll.toQuirk(word);
    console.log(`Original: ${word}`);
    console.log(`To Quirk: ${quirkified}`);
    console.log(`Remove Quirk: ${troll.toPlain(quirkified)}`);
    console.groupEnd();
});

