const Quirk = require("./quirk");

/* let aradia = new Quirk();
aradia.addSubstitution("o", "0", {ignoreCase: true});

["I WANT TO GO OFF", "I WANT TO GO"].forEach(word => {
    console.group("===========");
    const quirkified = aradia.toQuirk(word);
    console.log(`Original: ${word}`);
    console.log(`To Quirk: ${quirkified}`);
    console.log(`Remove Quirk: ${aradia.toPlain(quirkified)}`);
    console.groupEnd();
}); */

let taytoh = new Quirk();
taytoh.setSentenceCase("lowercase");
taytoh.setPrefix("<|");
taytoh.setSuffix("|>");
taytoh.addQuirkStripPattern(".");


let kanter = new Quirk();
kanter.addSubstitution("i", "|", {ignoreCase: true});
kanter.addSubstitution("l", "|_", {ignoreCase: true});
kanter.addSubstitution("n", "|\\|", {ignoreCase: true});
kanter.addSubstitution(",", "|\\\/|", {ignoreCase: true});
kanter.addSubstitution("k", "|<", {ignoreCase: true});
kanter.setSentenceCase("lowercase");
kanter.setCapitalizeFragments(true);


let gamzee = new Quirk(); 
gamzee.setSentenceCase("alternatingcaps");

let petrus = new Quirk();
petrus.addSubstitution("l", "L", {ignoreCase: true});
petrus.addSubstitution("e", "E", {ignoreCase: true});
petrus.addSubstitution("a", "A", {ignoreCase: true});
petrus.addSubstitution("f", "F", {ignoreCase: true});
petrus.addQuirkStripPattern(".");
petrus.addQuirkStripPattern("'");
petrus.setCapitalizeFragments(true);
petrus.setSentenceCase("lowercase", {exceptions: "LEAF"});

let neo = new Quirk();
neo.addSubstitution("o", "()", {ignoreCase: true});

let taz = new Quirk();
taz.addSubstitution("t", "+", {ignoreCase: true});
taz.setPrefix("~");
taz.setSuffix("~");
//note: need the ability to add emoji -- they function as punctuation
taz.addPlainException("+o+");

const troll=taz;

[ "She sells sea shells by the sea shore", "clown time :o)  yay", "this is some stuff I'm saying?", "I AM YELLING HERE! +o+", "The quick brown fox jumps over the lazy dog." ].forEach(word => {
    console.group("===========");
    const quirkified = troll.toQuirk(word);
    console.log(`Original: ${word}`);
    console.log(`To Quirk: ${quirkified}`);
    console.log(`Remove Quirk: ${troll.toPlain(quirkified)}`);
    console.groupEnd();
});

