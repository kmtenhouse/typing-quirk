const Quirk = require("./quirk");

const murrit = new Quirk(); 
murrit.addPrefix('>([');
murrit.addSuffix(']');
murrit.addSubstitution('h', '#');
const words = ["hey guys what's up", "why are you so glum"];
words.forEach(word => {
    let quirk = murrit.toQuirk(word);
    let plain = murrit.toPlain(quirk);
    console.log(plain, quirk);
})

