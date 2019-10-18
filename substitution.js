/* Copyright 2019 @twinarmageddons authors & contributors
/* This software may be modified and distributed under the terms
/* of the ISC License (ISC). See the LICENSE file for details. */

const escapeRegExpSpecials = require('./utils').escapeRegExpSpecials;

class Substitution {
    constructor(plain, quirk, options=null) {

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
                patternToMatch: new RegExp(escapeRegExpSpecials(quirkText), 'g'), 
                replaceWith: plain
            };
        }

        if (!this.quirk) {
            //...and vice versa for quirks
            const plainText = (this.plain ? this.plain.replaceWith : plain);
            this.quirk = {
                patternToMatch: new RegExp(escapeRegExpSpecials(plainText), 'g'), 
                replaceWith: quirk
            };
        }

        //finally, perform a check if we need to ignore case when going into the quirk
        if(options!==null) {
            if(options.hasOwnProperty('ignoreCase')) {
                if (typeof options.ignoreCase!=='boolean') {
                    throw new Error("Must provide true or false for option: ignoreCase");
                }
                if (options.ignoreCase === true) {
                    //check if we have a case insensitive regexp - if not, we'll fix that!
                    if (!this.quirk.patternToMatch.flags.includes('i')) {
                        let newPattern = this.quirk.patternToMatch.source;
                        this.quirk.patternToMatch = new RegExp(newPattern, 'gi');
                    }
                }
            }
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
        !Array.isArray(input) &&
        input!==null &&
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