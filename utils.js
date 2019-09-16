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
//Sentences can be wrapped in "", '', ``, and () -- these will be preserved
function capitalizeSentences(str) {
    //first, grab the whitespace so we can preserve it
    //next, split the paragraph into discrete sentences
    //for each sentence we have, perform the capitalization
    //then recombine the sentences with their original whitespace
}

function capitalizeOneSentence(str) {
    //takes in a single sentence and capitalizes the first letter
    //sentences can begin with ' " ` and ( -- these are ignored
    const initialPunctuation = str.match(/^["'`\("]*/)[0];
    str = str.replace(initialPunctuation, '');
    return initialPunctuation + str.charAt(0).toUpperCase() + str.slice(1);
}

function splitIntoSentences(paragraph) {
    //takes in a chunk of text and splits it into discrete sentences
    //Sentences end in one or more . ! ? 
    //Sentences can be encapsulated in parenthesises, quotes, backticks, or single quotes
    const sentenceBoundaries = /(?<=[\.!\?]+['"`\)]*)\s+/g;
    return paragraph.split(sentenceBoundaries);
}

function extractParagraphWhitespace(paragraph) {
    //takes in a chunk of text and returns the chunks of whitespace between the sentences
    //Sentences end in one or more . ! ? 
    //Sentences can be encapsulated in parenthesises, quotes, backticks, or single quotes
    const sentenceBoundaries = /(?<=[\.!\?]+['"`\)]*)\s+/g;
    return(paragraph.match(sentenceBoundaries));
}

module.exports = {
    escapeRegExpSpecials: escapeRegExpSpecials,
    capitalizeOneSentence: capitalizeOneSentence,
    capitalizeSentences: capitalizeSentences,
    splitIntoSentences: splitIntoSentences, 
    extractParagraphWhitespace: extractParagraphWhitespace
};