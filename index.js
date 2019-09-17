/* const Quirk = require("./quirk");
let example = new Quirk();
example.addSubstitution("U", "u");
example.enforceQuirkCase("uppercase", {exceptions: "u"});
let quirkifiedText = example.toQuirk("You have to check this out!ss :)");
let plainText = example.toPlain("yOu HAVE TO CHECK THIS OuT! :)ss");
console.log(quirkifiedText);
console.log(plainText); */
/* 
let callie = new Quirk();
callie.addSubstitution("u", "U", {ignoreCase: true});
callie.enforceQuirkCase("lowercase", {exceptions: "U"});
console.log(callie.toQuirk("I love you so much uwu!"));
console.log(callie.toPlain("i love you so much UwU!"));

let example = new Quirk();
example.addSubstitution("u", "u", {ignoreCase: true});
example.enforceQuirkCase("uppercase", {exceptions: "u"});
console.log(example.toQuirk("what a conincidence I hate you too you suck"))
console.log(example.toPlain("I REALLY DON"t HAVE WORDS FOR HOW MuCH I DESPISE YOu! YOu SuCk!"));

let testSub = new Quirk();
testSub.addSubstitution("w", "ww");
testSub.addSubstitution("v", "vv");
console.log(testSub.toQuirk("Weh everyone is mean")); */

const Quirk = require("./quirk");
let example = new Quirk();
example.addPrefix("::");
example.addSuffix("::");
example.addSubstitution("i", "ii", {ignoreCase: true});
example.addSubstitution("s", "2");
example.enforceQuirkCase("lowercase");

console.log(example.toQuirk("Check this stuff out! It even works for multiple sentences."));
//Outputs: ::check thii2 2tuff out!:: ::iit even work2 for multiiple 2entence2.::

console.log(example.toPlain("::check thii2 2tuff out!:: ::iit even work2 for multiiple 2entence2.::"));
//Outputs: Check this stuff out! It even works for multiple sentences.
