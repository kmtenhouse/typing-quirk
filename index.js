const Quirk = require("./quirk");

const myQuirk = new Quirk({
    prefix: "<",
    suffix: ">", 
    substitutions: [{ plain: "h", quirk: "j", isCaseSensitive: true} ]
});

console.log(myQuirk.encode("Hello world"));
console.log(myQuirk.substitutions);
//console.log(myQuirk.decode("<Hi>"));