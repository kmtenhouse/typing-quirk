const Quirk = require("./quirk");

let testSub = new Quirk();
testSub.addEmoji("+o+");
testSub.addSubstitution("t", "+", {ignoreCase: true});
const troll = testSub;

[ "this is totally incredible. +o+ seriously who is going to use this feature? +o+  I am so mad right now! +o+" ].forEach(word => {
    console.group("===========");
    const quirkified = troll.toQuirk(word);
    console.log(`Original: ${word}`);
    console.log(`To Quirk: ${quirkified}`);
    console.log(`Remove Quirk: ${troll.toPlain(quirkified)}`);
    console.groupEnd();
});

