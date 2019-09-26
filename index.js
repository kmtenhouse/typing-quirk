const Quirk = require("./quirk");
let example = new Quirk();
example.setPrefix("::");
example.setSuffix("::");
example.addSubstitution("i", "ii", { ignoreCase: true });
example.addSubstitution("s", "2");
example.setSentenceCase("lowercase");

let result = example.toQuirk("Check this stuff out! It even works for multiple sentences."); 
//Outputs: >>check thii2 2tuff out!<< >>iit even work2 for multiiple 2entence2.<<
console.log(result);

//Outputs: Check this stuff out! It even works for multiple sentences.
console.log(example.toPlain(result));

