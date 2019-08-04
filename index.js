const Quirk = require("./quirk");

const myQuirk = new Quirk({
    prefix: "<",
    suffix: ">"
});

console.log(myQuirk.encode("Hello world"));
//console.log(myQuirk.decode("<Hi>"));