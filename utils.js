/* Copyright 2019 @twinarmageddons authors & contributors
/* This software may be modified and distributed under the terms
/* of the ISC License (ISC). See the LICENSE file for details. */

function escapeRegExpSpecials(str) {
    //takes in a string
    //returns a version of that string with escapes for the 12 regexp special characters so that it can be used to create a valid regexp
    const arr = str.split("");
    //matches the 12 special characters in regexps - \ ^ $ . | ? * + ( ) { [ ]
    const specialChars = /[\\\^\$\.\|\?\*\+\(\)\[\{\]]/;

    return arr
        .map(char => (specialChars.test(char) ? ("\\" + char) : char))
        .join("");
}

function capitalizeFirstCharacter(str, exceptions = null) {
    //takes in a string and capitalizes the first letter that is not punctuation or whitespace
    //sentences can begin with " ' ` ( " ¿ ¡ -- these are ignored
    //exceptions are passed as a regular expression to check - if the start of the string is an exception, don't capitalize it!
    const initialPunctuation = str.match(/^["'`\("¿¡]*/)[0];
    str = str.replace(initialPunctuation, '');

    let firstChar = str.charAt(0);
    //check if we have exceptions -- and if so, leave the first character alone if it matches!
    firstChar = ((exceptions && exceptions.test(firstChar)) ? firstChar : firstChar.toUpperCase());

    return initialPunctuation + firstChar + str.slice(1);
}

function lowercaseFirstCharacter(str, exceptions = null) {
    //takes in a string and lowercases the first letter that is not punctuation or whitespace
    //sentences can begin with " ' ` ( " ¿ ¡ -- these are ignored
    //exceptions are passed as a regular expression to check - if the start of the string is an exception, don't capitalize it!
    const initialPunctuation = str.match(/^["'`\("¿¡]*/)[0];
    str = str.replace(initialPunctuation, '');

    let firstChar = str.charAt(0);
    //check if we have exceptions -- and if so, leave the first character alone if it matches!
    firstChar = ((exceptions && exceptions.test(firstChar)) ? firstChar : firstChar.toLowerCase());

    return initialPunctuation + firstChar + str.slice(1);
}

function hasPunctuation(str, customPunctuation = []) {
    //takes in a string and detects if it has punctuation
    //NOTE: this may need additional tuning

    //assume that a 'normal' sentence ends with at least one . ! ? or ) 
    //possibly one or more additional spaces after
    const defaultSentenceEnding = /[\.\!\?\)]+[\s]*$/;
    if (defaultSentenceEnding.test(str) === true) {
        return true;
    }

    //otherwise, see if we have a sentence that ends in one (or more) emoji
    //basic emoji detection pattern: \s(  emoiji_goes_here   )\s*$
    for (let i = 0; i < customPunctuation.length; i++) {
        let emojiPunctuationPattern = "\\s(" + escapeRegExpSpecials(customPunctuation[i]) + ")\\s*$";
        let emojiRegExp = new RegExp(emojiPunctuationPattern);
        if (emojiRegExp.test(str) === true) {
            return true; //as soon as we find a match, return true
        }
    }
    return false;
}

function capitalizeFirstPerson(str) {
    //takes in a string and ensures that any first person pronouns are capitalized properly
    //personal pronouns are I, I'm
    const firstPerson = /i\b/g;
    const firstPersonPossessive = /i\'m\b|\bim\b|\bIM\b/g
    str = str.replace(firstPerson, "I");
    str = str.replace(firstPersonPossessive, "I'm");
    return str;
}

//Lower case a string -- with an exception mask
function convertToLowerCase(str, options = null) {
    if (!options) {
        return str.toLowerCase();
    }

    let result = ""
    //loop through the string and figure out if we should change the case (or not)
    for (let i = 0; i < str.length; i++) {
        let char = str[i];
        if (options.test(char)) {
            result += char;
        } else {
            result += char.toLowerCase();
        }
    }

    return result;
}

//Capitalize a string -- with an exception mask
function convertToUpperCase(str, options = null) {
    if (!options) {
        return str.toUpperCase();
    }

    let result = ""
    //loop through the string and figure out if we should change the case (or not)
    for (let i = 0; i < str.length; i++) {
        let char = str[i];
        if (options.test(char)) {
            result += char;
        } else {
            result += char.toUpperCase();
        }
    }

    return result;
}

//DEPRECATED
//Change a string to propercase -- with an exception mask
function convertToProperCase(sentence, exceptions = null) {
    if (hasPunctuation(sentence)) {
        //First, forcibly perform lowercasing
        //TO-DO: handle exception WORDS (?)
        sentence = convertToLowerCase(sentence, exceptions);
        sentence = capitalizeFirstCharacter(sentence, exceptions);
        sentence = capitalizeFirstPerson(sentence);
    }
    return sentence;
}

function convertToAlternatingCase(str, startWithCaps=false, exceptions = null) {
    //exceptions are passed as a regular expression to check - if the letter is an exception, don't modify it!
    //additionally, you have the option to either start with caps (LiKe ThIs) or start with lowercase (lIkE tHiS)
    let isCaps = startWithCaps;
    let allChars = str.split('');
    let result = allChars
        .map(char => {
            if (exceptions && exceptions.test(char)) {
                return char;
            }

            let result = char;
            if (/[a-zA-Z]/g.test(char)) {
                result = (isCaps ? char.toUpperCase() : char.toLowerCase());
                isCaps = !isCaps; //flip-flop the caps for next time
            }

            return result;
        })
        .join('');

    return result;
}

//adjustForShouts
//takes in a word and attempts to determine if it should have its case changed due to SHOUTING
function adjustForShouts(word) {
    let lowerCaseCount = 0;
    let upperCaseCount = 0;
    let specialCharsCount = 0;
    //loop through the word and do the math
    for (let m = 0; m < word.length; m++) {
        if (/[^a-zA-Z]/.test(word[m])) { //if it's not an a-zA-Z character, ignore it!
            specialCharsCount++;
        }
        else if (isUpperCaseLetter(word[m])) {
            upperCaseCount++;
        } else {
            lowerCaseCount++;
        }
    }
    //now, figure out on the whole what we have (excluding specials)
    //so To! (3 char) is really To (2 char)
    let totalLetterCount = word.length - specialCharsCount;
    if (totalLetterCount === 0) { //if the word was entirely special characters, return it as-is
        return word;
    }

    //similarly, if the word is already entirely upper/lower case, return it as-is
    if (totalLetterCount === upperCaseCount || totalLetterCount === lowerCaseCount) {
        return word;
    } 

    //otherwise we have a mix -- we might need to SHOUT! 
    //(first, make sure it's not just Propercased tho lol)
    if (upperCaseCount === 1 && isUpperCaseLetter(word.charAt(0))) {
        return word;
    } else { //AT LONG LAST WE ARE SHOUTING!
        return word.toUpperCase();
    }
}

//isUpperCaseLetter
//takes in a character and determines if it is an uppercase alphabet letter [A-Z]
//returns false for lowercase alphabet letters, numbers, special characters 
function isUpperCaseLetter(letter) {
    if (letter === letter.toUpperCase()
        && letter !== letter.toLowerCase()) {
        return true;
    } else {
        return false;
    }
}


module.exports = {
    escapeRegExpSpecials,
    capitalizeFirstCharacter,
    lowercaseFirstCharacter,
    adjustForShouts,
    convertToLowerCase,
    convertToUpperCase,
    convertToProperCase,
    convertToAlternatingCase,
    hasPunctuation,
    capitalizeFirstPerson
};