const regexgen = require('regexgen');

class Substitution {
    constructor(plain, quirk) {
        //first, check if we received one or more valid substitution objects for the plain text speech (happy path)
        if (isValidSubstitutionObj(plain)) {
            this.plain = {
                patternToMatch: plain.patternToMatch,
                replaceWith: plain.replaceWith
            };
        } else if (!isValidSubstitutionString(plain)) {  //if not: validate that we at least received a non-null string
            throw new Error("Invalid input for plain speech substitution (Expected: Non-Empty String or Substitution Object)");
        }

        //next, perform the same check on the quirk
        if (isValidSubstitutionObj(quirk)) {
            this.quirk = {
                patternToMatch: quirk.patternToMatch,
                replaceWith: quirk.replaceWith
            };
        } else if (!isValidSubstitutionString(quirk)) {
            throw new Error("Invalid input for quirk speech substitution (Expected: Non-Empty String or Substitution Object)");
        }

        //lastly, if we only received strings: we need to manually generate the objects
        if (!this.plain) {
            //for the plain text, we assume we are going to make a regex that matches the quirk text, and replace with the plain text
            const quirkText = (this.quirk ? this.quirk.replaceWith : quirk);
            this.plain = {
                patternToMatch: regexgen([quirkText], 'g'),
                replaceWith: plain
            };
        }

        if (!this.quirk) {
            //...and vice versa for quirks
            const plainText = (this.plain ? this.plain.replaceWith : plain);
            this.quirk = {
                patternToMatch: regexgen([plainText], 'g'),
                replaceWith: quirk
            };
        }


    }

    toQuirk(str) {
        return str.replace(this.quirk.patternToMatch, this.quirk.replaceWith);
    }

    toPlain(str) {
        return str.replace(this.plain.patternToMatch, this.plain.replaceWith);
    }

}

//HELPER FUNCTIONS
//
//
//Checks if an input is a valid 'substitution object'
//Valid objects are of the form { patternToMatch: RegExp, replaceWith: String}
//'replaceWith' cannot be empty
function isValidSubstitutionObj(input) {
    return (typeof input === 'object' &&
        input.hasOwnProperty('patternToMatch') &&
        input.hasOwnProperty('replaceWith') &&
        input.patternToMatch instanceof RegExp &&
        typeof input.replaceWith === 'string' &&
        input.replaceWith !== '');
}

function isValidSubstitutionString(input) {
    return (typeof input === 'string' && input !== '');
}

module.exports = Substitution;