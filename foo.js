/* const ProseMap = require("./proseMap");
console.group("=========INITIAL STATE=========");
const test = new ProseMap("This is the wake up call, This,, is the way to rock.", { wordBoundaries: /(?<!^)\s/g, sentenceBoundaries: /((?<=[,])\s+)||((?<=[^,]["'`\.!\?\)])s+)/g});

test.forEach(node=> console.log(`${node.nodeName}: ${node.value}`));
console.groupEnd();

console.group("=========CLEAVING SENTENCES=========");
test.cleaveSentences();
test.forEach(node=> console.log(`${node.nodeName}: ${node.value}`));
console.groupEnd();

console.group("=========CLEAVING WORDS=========");
test.cleaveWords();
test.forEach(node=> console.log(`${(node.isFirstWord ? "FIRST:" : "")}${node.nodeName}: ${node.value}`));
console.groupEnd();

console.group("=========REJOING WORDS INTO SENTENCES=========");
test.joinWords();
test.forEach(node=> console.log(`${node.nodeName}: ${node.value}`));
console.groupEnd();

console.group("=========REJOINING SENTENCES INTO PARAGRAPHS=========");
test.joinSentences();
test.forEach(node=> console.log(`${node.nodeName}: ${node.value}`));
console.groupEnd(); 

console.log("TEXT",test.text);   */

 const Quirk = require("./index");
const test = new Quirk();
test.setSuffix("<<");
console.log(test.quirk.sentence.suffix.text);

["This is a test. This is only a test.", "um,, your bad, maybe? I think,,ok", "wait why is this working,, but not this, huh"].forEach(str => {
    const quirked = test.toQuirk(str);
    const dequirked = test.toPlain(quirked);
    console.log(`
    Original: ${str}    
    To Quirk: ${quirked}
    Dequirk: ${dequirked}
    `)
});   


