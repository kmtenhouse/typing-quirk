/* const ProseMap = require("./proseMap");

const masterStr = "D==> This is a test.";
console.group("=========INITIAL STATE=========");
const test = new ProseMap(masterStr);

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

console.log("TEXT",test.text);    */
 
 const Quirk = require("./index");
const testSub = new Quirk();
/* testSub.setPrefix('^', { word: true });
testSub.setSuffix('^', { word: true }); */
/* testSub.setPrefix('=||', { sentence: true });
testSub.setSuffix('||=', { sentence: true });
testSub.setSeparator("=", { sentence: true}); */
/* testSub.setPrefix('//=', { paragraph: true });
testSub.setSuffix('=\\\\', { paragraph: true }); */

testSub.setPrefix('^', { word: true });
testSub.setSuffix('$', { word: true });
testSub.setSeparator("*", { sentence: true});

[ "This is a test. I hope? I repeat. This is only a test!" ].forEach(str => {
    const quirked = testSub.toQuirk(str);
    const dequirked = testSub.toPlain(quirked);
    console.log(`
    Original: ${str}    
    To Quirk: ${quirked}
    Dequirk: ${dequirked}
    `)
});   
 