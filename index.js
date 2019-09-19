const Quirk = require("./quirk");
const albion = new Quirk();
albion.addSeparator("*");
const output = albion.toQuirk("This  is     a test");

console.log(output);
console.log(albion.toPlain(output));