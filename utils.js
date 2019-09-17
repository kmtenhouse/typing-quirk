function escapeRegExpSpecials(str) {
    const arr = str.split("");
    //matches the 12 special characters in regexps - \ ^ $ . | ? * + ( ) { [ ]
    const specialChars = /[\\\^\$\.\|\?\*\+\(\)\[\{\]]/;

    return arr
        .map(char => (specialChars.test(char) ? ("\\" + char) : char))
        .join("");
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

function capitalizeOneSentence(str) {
    //takes in a single sentence and capitalizes the first letter
    //sentences can begin with ' " ` and ( -- these are ignored
    const initialPunctuation = str.match(/^["'`\("]*/)[0];
    str = str.replace(initialPunctuation, '');
    return initialPunctuation + str.charAt(0).toUpperCase() + str.slice(1);
}

function hasPunctuation(str) {
    //takes in a string and detects if it has punctuation
    //TO-DO: account for custom punctuation (for quirks)
    const punctuation = /[\.\!\?\)]+$/;
    return punctuation.test(str); 
}

//Separating and recombining sentences
function separateSentencesAndWhiteSpace(paragraph) {
    const sentenceBoundaries = /(?<=[\.!\?]+['"`\)]*)\s+/g;
    //first, grab the whitespace so we can preserve it
    const whiteSpace = paragraph.match(sentenceBoundaries);
    //next, split the paragraph into discrete sentences
    const sentences = paragraph.split(sentenceBoundaries);
    return { sentences, whiteSpace };
}

//Function to rejoin a sentence, given two parts
function recombineSentencesAndWhiteSpace(sentenceArr, whiteSpaceArr) {
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

    return str.split('').map(char => {
        return (options.test(char) ? char : char.toLowerCase());
    }).join('');
}

//Capitalize a string -- with an exception mask
function convertToUpperCase(str, options = null) {
    if (!options) {
        return str.toUpperCase();
    }

    return str.split('').map(char => {
        return (options.test(char) ? char : char.toUpperCase());
    }).join('');
}

module.exports = {
    escapeRegExpSpecials,
    capitalizeOneSentence,
    capitalizeSentences,
    separateSentencesAndWhiteSpace,
    convertToLowerCase,
    convertToUpperCase,
    recombineSentencesAndWhiteSpace,
    hasPunctuation
};