const Quirk = require("./quirk");
let testSub = new Quirk();
testSub.addWordException("hello", {ignoreCase: true});
testSub.addSubstitution("e", "3", {ignoreCase: true});
//expect(testSub.toQuirk("hello can you hear me")).to.equal("hello can you h3ar m3");
//expect(testSub.toQuirk("HELLO CAN YOU HEAR ME")).to.equal("HELLO CAN YOU H3AR M3");
//expect(testSub.toQuirk("Hello Can You Hear Me")).to.equal("Hello Can You H3ar M3");const troll = testSub;

const troll = testSub;

[ "hello can you hear me", "HELLO CAN YOU HEAR ME", "Hello Can You Hear Me" ].forEach(word => {
    console.group("===========");
    const quirkified = troll.toQuirk(word);
    console.log(`Original: ${word}`);
    console.log(`To Quirk: ${quirkified}`);
    console.log(`Remove Quirk: ${troll.toPlain(quirkified)}`);
    console.groupEnd();
});

