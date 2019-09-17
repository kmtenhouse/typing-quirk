const Substitution = require("./substitution");
const utils = require("./utils");
const { isObject, isString, isRegExp } = require("./validators");

class Quirk {
    constructor() {
        //initialize the number of substitutions to nothing
        this.substitutions = [];
        this.suffix = null; //default: no suffix
        this.prefix = null; //default: no prefix
        this.separator = null; //default word separator is a space
        this.quirkCase = {
            sentenceCase: "default", //default: attempt to follow the input as closely as possible,
            exceptions: null //regular expression to trap any letters that should be exempt from case enforcement
        };

        //check if we received a possible config object with valid items
        if (arguments.length > 0) {
            //valid config objects are: 
            //1) one object only
            //2) not null
            //3) not an array
            if (arguments.length > 1) {
                throw new Error("Too many arguments to constructor!");
            }
            const config = arguments[0];

            if (!isObject(config)) {
                throw new Error("Invalid argument passed to constructor!");
            }

            //use the config object to set up the quirk :)
        }

    }

    addPrefix(prefix, pattern = '') {
        if (!isString(prefix) || prefix === '') {
            throw new Error("Prefix must be a non-empty string!");
        }

        //if a pattern paramater was provided, check that 1) a regular expression
        if (pattern !== '' && !isRegExp(pattern)) {
            throw new Error("Invalid regexp provided for prefix!");
        }
        //...and that it's a valid regexp for the start of a string
        if (isRegExp(pattern) && !/^\^/.test(pattern.source)) {
            throw new Error("Invalid regexp provided for a prefix (hint: check for missing ^)");
        }

        //create the proper regexp for the prefix (if necessary)
        let prefixRegExp = (pattern ? pattern : new RegExp("^" + utils.escapeRegExpSpecials(prefix)));

        this.prefix = {
            text: prefix,
            patternToStrip: prefixRegExp
        };
    }

    addSuffix(suffix, pattern = '') {
        if (!isString(suffix) || suffix === '') {
            throw new Error("Suffix must be a non-empty string!");
        }

        //if a pattern paramater was provided, check that 1) a regular expression
        if (pattern !== '' && !isRegExp(pattern)) {
            throw new Error("Invalid regexp provided for suffix!");
        }
        //...and that it's a valid regexp for the end of a string
        if (isRegExp(pattern) && !/\$$/.test(pattern.source)) {
            throw new Error("Invalid regexp provided for a suffix (hint: check for missing $)");
        }

        //create the proper regexp for the suffix (if necessary)
        let suffixRegExp = (pattern ? pattern : new RegExp(utils.escapeRegExpSpecials(suffix) + "$"));

        this.suffix = {
            text: suffix,
            patternToStrip: suffixRegExp
        };
    }

    addSeparator(separator) {
        // Registers a custom word separator (ex: the*asterisk*is*the*separator*.)
        // Only disallowed separator is ''
        if (typeof separator !== 'string' || separator === '') {
            throw new Error("Must provide a valid separator!");
        }

        // Note: assumes that all whitespace will be concatenated into a single separator (TO-DO: add a flag to make that an option)
        this.separator = new Substitution(' ', {
            patternToMatch: /\s+/g,
            replaceWith: separator
        });
    }

    enforceQuirkCase(sentenceCase, options = null) {
        //enforces a specific case across all text when quirkified 
        //(default is that the algorithm attempts to match the existing case of the input as closely as possible)
        if (!isString(sentenceCase) || ['lowercase', 'uppercase', 'propercase'].includes(sentenceCase.toLowerCase()) === false) {
            throw new Error("Must provide a valid sentence case! Options are lowercase, uppercase, propercase.");
        }

        //if a value other than a string is provided as the (optional) second parameter, throw an error
        if (options!== null) {
            if(!options.hasOwnProperty('exceptions') || !isString(options.exceptions) || options.exceptions==='' )
            throw new Error("Exceptions to enforceCase must be provided as an object { exceptions: <String of characters to exclude> }!");
        }

        //set the overall quirk case
        this.quirkCase.sentenceCase = sentenceCase.toLowerCase();

        //lastly, if we have passed a string of letters that should not be affected by case enforcement, create a match pattern for them
        if (options) {
            let matchPattern = options.exceptions;
            this.quirkCase.exceptions = new RegExp("[" + matchPattern + "]", 'g');
        }
    }

    addSubstitution(plain, quirk, options = null) {
        //options: case-sensitive substitutions; apply to full sentences or individual words (default)
        let newSub = new Substitution(plain, quirk, options);
        this.substitutions.push(newSub);
    }

    //the fun part - encoding their speech!!
    toQuirk(str) {
        //we will do this sentence by sentence within a paragraph
        //first, split up the sentences
        const { sentences, whiteSpace } = utils.separateSentencesAndWhiteSpace(str);
        const adjustedSentences = sentences.map(sentence => {

            //perform substitutions (currently: across the entire sentence at once)
            this.substitutions.forEach(sub => sentence = sub.toQuirk(sentence));
            //join the sentence with prefix and suffix
            sentence = (this.prefix ? this.prefix.text : '') + sentence + (this.suffix ? this.suffix.text : '');
            //lastly, enforce case
            if (this.quirkCase.sentenceCase === 'lowercase') {
                sentence = utils.convertToLowerCase(sentence, this.quirkCase.exceptions);
            } else if (this.quirkCase.sentenceCase === 'uppercase') {
                sentence = utils.convertToUpperCase(sentence, this.quirkCase.exceptions);
            } else if (this.quirkCase.sentenceCase === 'propercase') {
                //note: we will only perform capitalization if this sentence is punctuated!
                if (utils.hasPunctuation(sentence)) {
                    //First, forcibly perform lowercasing
                    //TO-DO: handle exception WORDS (?)
                    sentence = utils.convertToLowerCase(sentence, this.quirkCase.exceptions);
                    sentence = utils.capitalizeOneSentence(sentence, this.quirkCase.exceptions);
                    sentence = utils.capitalizeFirstPerson(sentence);
                }
            }
            //lastly, if there is a custom separator, add that
            if (this.separator) {
                sentence = this.separator.toQuirk(str);
            }
            //return the sentence to our map
            return sentence;
        });

        //lastly, recombine the sentences with their original whitespace
        const adjustedParagraph = utils.recombineSentencesAndWhiteSpace(adjustedSentences, whiteSpace);
        return adjustedParagraph;
    }

    //(TO-DO) Adjust to support paragraphs properly
    toPlain(str) {
        //first, split up the sentences
        const { sentences, whiteSpace } = utils.separateSentencesAndWhiteSpace(str);
        const adjustedSentences = sentences.map(sentence => {

            //start by removing prefix and suffix from the whole string
            if (this.prefix) {
                sentence = sentence.replace(this.prefix.patternToStrip, '');
            }

            if (this.suffix) {
                sentence = sentence.replace(this.suffix.patternToStrip, '');
            }

            if (this.separator) {
                sentence = this.separator.toPlain(sentence);
            }
            this.substitutions.forEach(sub => sentence = sub.toPlain(sentence));

            //Now we should handle case (as best we can):
            //If we did an enforced case, reset to lowercase first
            //To-do: handle any exceptions
            if (this.quirkCase.sentenceCase === 'uppercase' || this.quirkCase.sentenceCase ==='lowercase') {
                sentence = sentence.toLowerCase();
            }
            //Note: many quirks mess up the personal pronoun 'I' - need to ensure this is capitalized!
            sentence = utils.capitalizeFirstPerson(sentence);

            //Finally, check if this chunk is a sentence that we need to capitalize
            //(Default assumption is that a proper sentence will have punctuation at the end; otherwise it's a fragment)
            if (utils.hasPunctuation(sentence)) {
                sentence = utils.capitalizeOneSentence(sentence);
            }

            return sentence;
        });
        //lastly, recombine the sentences with their original whitespace
        const adjustedParagraph = utils.recombineSentencesAndWhiteSpace(adjustedSentences, whiteSpace);
        return adjustedParagraph;
    }
}

module.exports = Quirk;