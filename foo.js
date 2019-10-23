const ProseMap = require("./proseMap");

const masterStr = "+bats +are +rad. +why +are +you +screaming";
console.group("=========INITIAL STATE=========");
const test = new ProseMap(masterStr, { wordBoundaries: /\s+(?=\+)/g});

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

console.log("TEXT",test.text);   
 
 const Quirk = require("./index");
const test2 = new Quirk();
test2.setPrefix('^', { word: true});
console.log(test2.quirk.word);

[ masterStr ].forEach(str => {
    const quirked = test2.toQuirk(str);
    const dequirked = test2.toPlain(quirked);
    console.log(`
    Original: ${str}    
    To Quirk: ${quirked}
    Dequirk: ${dequirked}
    `)
});   
 