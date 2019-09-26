function escapeRegExpSpecials(str) {
    const arr = str.split("");
    //matches the 12 special characters in regexps - \ ^ $ . | ? * + ( ) { [ ]
    const specialChars = /[\\\^\$\.\|\?\*\+\(\)\[\{\]]/;

    return arr
        .map(char => (specialChars.test(char) ? ("\\" + char) : char))
        .join("");
}

//WORD CASE ADJUSTMENT
//
//
//Takes in a single sentence and adjusts the case of specific letters
//Defaults to capitalizing the first word
function capitalizeWords(sentence) {
    let nextCharToCaps = true;
    let newStr = "";
    for (let i = 0; i < sentence.length; i++) {
        if (/\s/.test(sentence[i]) === true) {
            nextCharToCaps = true;
            newStr += sentence[i];
        } else if (nextCharToCaps) {
            newStr += sentence[i].toUpperCase();
            nextCharToCaps = false;
        } else {
            newStr += sentence[i];
        }
    }
    return newStr;
}

//SENTENCE CASE ADJUSTMENT
//
//
//Takes in a paragraph with one or more sentences and changes each sentence to proper case
//Proper case is defined as first letter capitalized
//Sentences end in one or more . ! ? 
//Sentences can be wrapped in "", '', ``, and () -- these will be preserved
function capitalizeSentences(paragraph) {
    const sentenceBoundaries = /(?<=[\.!\?]+['"`\)]*)\s+/g;
    //first, grab the whitespace so we can preserve it
    const whiteSpace = paragraph.match(sentenceBoundaries);
    //next, split the paragraph into discrete sentences
    const sentences = paragraph.split(sentenceBoundaries);
    //for each sentence we have, perform the capitalization
    const modifiedSentences = sentences.map(sentence => capitalizeOneSentence(sentence));
    //then recombine the sentences with their original whitespace
    let modifiedParagraph = '';
    let whiteSpaceIndex = 0; //note: we're not using shift here to see if this might be more efficient than constantly changing the whitespace array :)
    modifiedSentences.forEach(sentence => {
        let spacing = ((whiteSpace && whiteSpaceIndex < whiteSpace.length) ? whiteSpace[whiteSpaceIndex] : '');
        whiteSpaceIndex++;
        modifiedParagraph += sentence + spacing;
    });

    return modifiedParagraph;
}

function capitalizeOneSentence(str, exceptions = null) {
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

function hasPunctuation(str, customPunctuation=[]) {
    //takes in a string and detects if it has punctuation
    //NOTE: this may need additional tuning
    
    //assume that a 'normal' sentence ends with at least one . ! ? or ) 
    //possibly one or more additional spaces after
    console.log(str);
    const defaultSentenceEnding = /[\.\!\?\)]+[\s]*$/; 
    if(defaultSentenceEnding.test(str) === true) {
        return true;
    }

    //otherwise, see if we have a sentence that ends in one (or more) emoji
    //basic emoji detection pattern: \s(  emoiji_goes_here   )\s*$
    for(let i=0; i<customPunctuation.length; i++) {
        let emojiPunctuationPattern = "\\s(" + escapeRegExpSpecials(customPunctuation[i]) + ")\\s*$";
        let emojiRegExp = new RegExp(emojiPunctuationPattern);
        if(emojiRegExp.test(str)===true) {
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

//Separating and recombining sentences
function cleave(str, pattern) {
    //accepts a string and a pattern to cleave on 
    //returns an object with an array of the resulting strings, as well as the original whitespace
    //first, grab the whitespace so we can preserve it
    const whiteSpace = str.match(pattern);
    //next, split the paragraph into discrete sentences
    const strings = str.split(pattern);
    return { strings, whiteSpace };
}

function cleaveSentences(paragraph, exceptions = []) {
    //TO-DO: accept any characters that might need to be added to boundary detection due to custom punctuation / suffixes
    //MODIFIERS WILL GO IN THE FIRST BIT:
    //EX: (?<=[\.!\?:\)]|\:U|\+o\+)\s+(?!\:|\s)
    let masks = "";
    exceptions.forEach(exception => masks += "|" + escapeRegExpSpecials(exception));
    const sentenceBoundaryPattern = "(?<=[\\.!\\?:\\)]" + masks + ")\\s+(?!\\:\\s)";
    const sentenceBoundaries = new RegExp(sentenceBoundaryPattern, "g");

    const results = cleave(paragraph, sentenceBoundaries);
    return {
        sentences: results.strings,
        whiteSpace: results.whiteSpace
    };
}

function cleaveWords(sentence) {
    const wordBoundaries = /(?<!^)\s/g;
    const results = cleave(sentence, wordBoundaries);
    return {
        words: results.strings,
        whiteSpace: results.whiteSpace
    };
}

//Function to rejoin a sentence, given two parts
function recombineWhitespace(sentenceArr, whiteSpaceArr) {
    let adjustedParagraph = '';
    let whiteSpaceIndex = 0; //note: we're not using shift here to see if this might be more efficient than constantly changing the whitespace array :)
    sentenceArr.forEach(sentence => {
        let spacing = ((whiteSpaceArr && whiteSpaceIndex < whiteSpaceArr.length) ? whiteSpaceArr[whiteSpaceIndex] : '');
        whiteSpaceIndex++;
        adjustedParagraph += sentence + spacing;
    });
    return adjustedParagraph;
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

//Change a string to propercase -- with an exception mask
function convertToProperCase(sentence, exceptions = null) {
    if (hasPunctuation(sentence)) {
        //First, forcibly perform lowercasing
        //TO-DO: handle exception WORDS (?)
        sentence = convertToLowerCase(sentence, exceptions);
        sentence = capitalizeOneSentence(sentence, exceptions);
        sentence = capitalizeFirstPerson(sentence);
    }
    return sentence;
}

function convertToAlternatingCase(str, exceptions = null) {
    //exceptions are passed as a regular expression to check - if the letter is an exception, don't modify it!
    let isCaps = false;
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
    capitalizeOneSentence,
    capitalizeSentences,
    capitalizeWords,
    convertToLowerCase,
    convertToUpperCase,
    convertToProperCase,
    convertToAlternatingCase,
    hasPunctuation,
    capitalizeFirstPerson,
    cleaveSentences,
    cleaveWords,
    recombineWhitespace,
    isUpperCaseLetter
};