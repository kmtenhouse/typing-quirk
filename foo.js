const ProseMap = require("./proseMap");
console.group("=========INITIAL STATE=========");
const test = new ProseMap("This is the wake up call :) This is the way to fuck god.");
test.forEach(node=> console.log(`${node.nodeName}: ${node.value}`));
console.groupEnd();

console.group("=========CLEAVING SENTENCES=========");
test.cleaveSentences();
test.forEach(node=> console.log(`${node.nodeName}: ${node.value}`));
console.groupEnd();

console.group("=========CLEAVING EMOJI=========");
test.cleaveEmoji([/\:\)/]);
test.forEach(node=> console.log(`${node.nodeName}: ${node.value}`));
console.groupEnd();
/* 
console.group("=========CLEAVING WORDS=========");
test.cleaveWords();
test.forEach(node=> console.log(`${node.nodeName}: ${node.value}`));
console.groupEnd();

console.group("=========REJOING WORDS INTO SENTENCES=========");
test.joinWords();
test.forEach(node=> console.log(`${node.nodeName}: ${node.value}`));
console.groupEnd();

console.group("=========REJOINING SENTENCES INTO PARAGRAPHS=========");
test.joinSentences();
test.forEach(node=> console.log(`${node.nodeName}: ${node.value}`));
console.groupEnd(); */