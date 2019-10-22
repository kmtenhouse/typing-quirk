/* Copyright 2019 @twinarmageddons authors & contributors
/* This software may be modified and distributed under the terms
/* of the ISC License (ISC). See the LICENSE file for details. */

//Text Changers
//A selection of utilities to handle common text manipulation needs (such as changing sentence case)


//Escapes characters within a regexp that are special characters
function escapeRegExpSpecials(str) {
    const arr = str.split("");
    //matches the 12 special characters in regexps - \ ^ $ . | ? * + ( ) { [ ]
    const specialChars = /[\\\^\$\.\|\?\*\+\(\)\[\{\]]/;

    return arr
        .map(char => (specialChars.test(char) ? ("\\" + char) : char))
        .join("");
}

//Lower case a string -- with an regexp that filters out any exceptions
function convertToLowerCase(str, exceptions = null) {
    if (!exceptions) {
        return str.toLowerCase();
    }

    let result = ""
    //loop through the string and figure out if we should change the case (or not)
    for (let i = 0; i < str.length; i++) {
        let char = str[i];
        if (exceptions.test(char)) {
            result += char;
        } else {
            result += char.toLowerCase();
        }
    }
    return result;
}

//Upper case a string -- with an regexp that filters out any exceptions
function convertToUpperCase(str, exceptions = null) {
    if (!exceptions) {
        return str.toUpperCase();
    }

    let result = ""
    //loop through the string and figure out if we should change the case (or not)
    for (let i = 0; i < str.length; i++) {
        let char = str[i];
        if (exceptions.test(char)) {
            result += char;
        } else {
            result += char.toUpperCase();
        }
    }

    return result;
}



//capitalizeFirstCharacter
//Takes in a word with one or more sentences and changes each sentence to proper case
//Proper case is defined as first letter capitalized
//Sentences end in one or more . ! ? 
//Sentences can be wrapped in "", '', ``, and () -- these will be preserved

function capitalizeFirstCharacter(str, exceptions = null) {
    //takes in a single sentence and capitalizes the first letter
    //sentences can begin with ' " ` and ( -- these are ignored
    //exceptions are passed as a regular expression to check - if the start of the string is an exception, don't capitalize it!
    const initialPunctuation = str.match(/^["'`\("¿¡]*/)[0];
    str = str.replace(initialPunctuation, '');

    let firstChar = str.charAt(0);
    //check if we have exceptions -- and if so, leave the first character alone if it matches!
    firstChar = ((exceptions && exceptions.test(firstChar)) ? firstChar : firstChar.toUpperCase());

    return initialPunctuation + firstChar + str.slice(1);
}
module.exports = {
    escapeRegExpSpecials,
    convertToLowerCase,
    convertToUpperCase,
    capitalizeFirstCharacter
}