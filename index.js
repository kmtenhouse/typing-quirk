const Quirk = require("./quirk");

const dismas = new Quirk();
dismas.addSubstitution('a', '/\\');
dismas.addSubstitution('v','\\/');
dismas.addSuffix('///', /\/+$/);
dismas.enforceCase('propercase');

console.log(dismas.toQuirk("This is such a stupid plan. I can't believe I'm up in the middle of the night doing this.")); //BUG: gotta split all the sentences and then add sentence-terminal punctuation >.>
/* console.log(dismas.toQuirk("I just left the lizard outside not too long ago with a pretty livid attitude"));
console.log(dismas.toPlain("I just left the liz/\\rd outside not too long /\\go with /\\ pretty li\\/id /\\ttitude///"));
console.log(dismas.toPlain("I c/\\n still he/\\r him scr/\\tching /\\round /\\nd looking to m/\\ke /\\ scene, /\\nd I'm not interested in getting in his w/\\y /\\g/\\in /\\nytime too soon///"));
 */
/* const eridan = new Quirk();
eridan.addSubstitution('w','ww');
eridan.addSubstitution('v','vv');
eridan.addSubstitution('can\'t','cant'); //if we are stripping apostrophes/etc, got to think through how this works with the letter subs
eridan.addSubstitution('don\'t','dont');
eridan.addSubstitution('won\'t','wont');
//eridan.addSubstitution('\'',''); <-- need a way to explicitly strip out things for quirks, but not be able to reverse (bc we can't)
eridan.addSubstitution({ patternToMatch: /in\b/, replaceWith: 'ing'}, { patternToMatch: /ing\b/, replaceWith: 'in'});
eridan.enforceCase('lowercase');

console.log(eridan.toQuirk('Terrible circumstances what I been reduced to. Ingrates! You can\'t trust any fucking body around here ever. I sure won\'t.')); */

const karkat = new Quirk();
karkat.enforceCase('uppercase');
console.log(karkat.toQuirk("This is absolutely, without a doubt, the stupidest thing you have ever done. And I am counting getting yourself cut in half."));