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
 

const albion = new Quirk();
albion.addSeparator("*"); 
console.log(albion.toQuirk("this is a    test"));
console.log(albion.toPlain("this*is*a*test"));