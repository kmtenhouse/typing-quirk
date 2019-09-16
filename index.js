const Quirk = require("./quirk");

const dismas = new Quirk();
dismas.addSubstitution('a', '/\\');
dismas.addSubstitution('v','\\/');
dismas.addSuffix('///', /\/+$/);
dismas.enforceCase('propercase');

console.log(dismas.toQuirk("a stupid plan."));
console.log(dismas.toPlain("I just left the liz/\\rd outside not too long /\\go with /\\ pretty li\\/id /\\ttitude///"));
console.log(dismas.toPlain("I c/\\n still he/\\r him scr/\\tching /\\round /\\nd looking to m/\\ke /\\ scene, /\\nd I'm not interested in getting in his w/\\y /\\g/\\in /\\nytime too soon///"));