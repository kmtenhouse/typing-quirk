/* const Quirk = require("./quirk");
let example = new Quirk();
example.setPrefix(">>");
example.setSuffix("<<");
example.addSubstitution("i", "ii", {ignoreCase: true});
example.addSubstitution("s", "2");
example.setSentenceCase("lowercase");

console.log(example.toQuirk("Check this stuff out! It even works for multiple sentences."));
//Outputs: >>check thii2 2tuff out!<< >>iit even work2 for multiiple 2entence2.<<

console.log(example.toPlain(">>check thii2 2tuff out!<< >>iit even work2 for multiiple 2entence2.<<"));
//Outputs: Check this stuff out! It even works for multiple sentences.  */

const ProseMap = require("./proseMap");
const myText = new ProseMap("Check this stuff out! It even works for multiple sentences.", "paragraph");

/* myText.cleaveSentences();
myText.forEach(function(node, index) {
    console.log(`${node.nodeName}: ${node.value}`)
    node.value = node.value.replace(/[tT]/g, "+");
});
 */
myText.cleaveWords();

myText.forEach(function(node, index) { 
   if(node.isFirstWord) {
       node.value = node.value.toUpperCase();
   }
});

myText.joinWords();
myText.forEach(function(node, index) {
    console.log(`T${index}: ${node.nodeName}: ${node.value}`);
});
console.log(myText.join()); 