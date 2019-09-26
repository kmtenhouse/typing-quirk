const Quirk = require("./quirk");
let testSub = new Quirk();
testSub.addSubstitution({patternToMatch: /(?<=[imads])nt$/i, replaceWith: "n't"}, {patternToMatch: /(?<=[imads])n't$/i, replaceWith: "nt"});
testSub.addSubstitution({patternToMatch: /^dont$/i, replaceWith: "don't"}, {patternToMatch: /^don't$/i, replaceWith: "dont"});
testSub.addSubstitution({patternToMatch: /^cant$/i, replaceWith: "can't"}, {patternToMatch: /^can't$/i, replaceWith: "cant"});
testSub.addSubstitution({patternToMatch: /(?<=ul)dve$/i, replaceWith: "d've"}, {patternToMatch: /(?<=ul)d've$/i, replaceWith: "dve"});
//expect(testSub.toQuirk("hello can you hear me")).to.equal("hello can you h3ar m3");
//expect(testSub.toQuirk("HELLO CAN YOU HEAR ME")).to.equal("HELLO CAN YOU H3AR M3");
//expect(testSub.toQuirk("Hello Can You Hear Me")).to.equal("Hello Can You H3ar M3");const troll = testSub;

const troll = testSub;

["I wouldn't have gone.", "He isn't coming.", "I should've gone." ].forEach(word => {
    console.group("===========");
    const quirkified = troll.toQuirk(word);
    console.log(`Original: ${word}`);
    console.log(`To Quirk: ${quirkified}`);
    console.log(`Remove Quirk: ${troll.toPlain(quirkified)}`);
    console.groupEnd();
});

