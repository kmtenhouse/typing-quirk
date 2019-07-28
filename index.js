const Quirk = require("./quirk");

const myQuirk = new Quirk({prefix: "^", suffix: "6"});
console.log(myQuirk.prefix);
console.log(myQuirk.suffix);
