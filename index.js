const Quirk = require("./quirk");
let testSub = new Quirk();

testSub.addSubstitution("o", "0", {ignoreCase: true});

/* testSub.addSubstitution("t", "+", {ignoreCase: true});
testSub.addEmoji("+o+");
testSub.setPrefix("~");
testSub.setSuffix("~"); */
//expect(testSub.toQuirk("hello can you hear me")).to.equal("hello can you h3ar m3");
//expect(testSub.toQuirk("HELLO CAN YOU HEAR ME")).to.equal("HELLO CAN YOU H3AR M3");
//expect(testSub.toQuirk("Hello Can You Hear Me")).to.equal("Hello Can You H3ar M3");const troll = testSub;

const troll = testSub;

["This is SUCH BULLSHIT!", "I am REALLY angry.", "I hate YOU. I WANT TO GO TOO!" ].forEach(word => {
    console.group("===========");
    const quirkified = troll.toQuirk(word);
    console.log(`Original: ${word}`);
    console.log(`To Quirk: ${quirkified}`);
    console.log(`Remove Quirk: ${troll.toPlain(quirkified)}`);
    console.groupEnd();
});

 