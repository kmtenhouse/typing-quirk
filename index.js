const Quirk = require("./quirk");


const sollux = new Quirk();
sollux.addSubstitution('i', 'ii');
sollux.addSubstitution('I', 'ii');
sollux.addSubstitution('s','2');
sollux.addSubstitution('S','2');
console.log(sollux.toQuirk("Now I can type anything Sollux says and it's really cool."));