const Quirk = require("./quirk");
let example = new Quirk();
example.setPrefix(">>");
example.setSuffix("<<");
example.addSubstitution("i", "ii", {ignoreCase: true});
example.addSubstitution("s", "2");
example.setSentenceCase("lowercase");

console.log(example.toQuirk("Check this stuff out! It even works for multiple sentences."));
//Outputs: >>check thii2 2tuff out!<< >>iit even work2 for multiiple 2entence2.<<

console.log(example.toPlain(">>check thii2 2tuff out!<< >>iit even work2 for multiiple 2entence2.<<"));
//Outputs: Check this stuff out! It even works for multiple sentences. 

/* const ProseMap = require("./proseMap");
const myText = new ProseMap("This is a test. This is only a test.");
myText.cleaveSentences();
myText.forEach(function(node, index) {
    node.value = node.value.replace(/[tT]/g, "+");
});
myText.cleaveWords();
myText.forEach(function(node, index) {
    if(node.isFirstWord) {
        node.value = node.value.toUpperCase();
    }
});
console.log(myText.join()); */