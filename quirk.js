const Substitution = require("./substitution");
const utils = require("./utils");
const { isObject, isString, isRegExp } = require("./validators");

class Quirk {
    constructor() {
        //initialize the number of substitutions to nothing
        this.substitutions = [];
        this.strip = [];
        this.suffix = null; //default: no suffix
        this.prefix = null; //default: no prefix
        this.separator = null; //default word separator is a space
        this.quirkCase = {
            sentenceCase: "default", //default: attempt to follow the input as closely as possible,
            wordCase: "default",
            exceptions: null //regular expression to trap any letters that should be exempt from case enforcement
        };
        this.plainCase = {
            capitalizeFragments: false //defaults to false
        }
        this.exceptions = {
            plain: [],
            quirk: []
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

    setPrefix(prefix, pattern = '') {
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

    setSuffix(suffix, pattern = '') {
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

    setSeparator(separator) {
        // Registers a custom word separator (ex: the*asterisk*is*the*separator*.)
        // Only disallowed separator is ''
        if (typeof separator !== 'string' || separator === '') {
            throw new Error("Must provide a valid separator!");
        }

        this.separator = new Substitution(' ', {
            patternToMatch: /\s/g,
            replaceWith: separator
        });
    }

    setWordCase(wordCase, options = null) {
        //enforces a specific case on each word within a sentence
        //(To do): add an option to set a pattern for caps 
        //(To do): make this play nicely with exceptions for sentence case as well
        //Right now the default for 'capitalize' is the first char of every word
        if (!isString(wordCase) || ['capitalize'].includes(wordCase.toLowerCase()) === false) {
            throw new Error("Must provide a valid word case!  Options are: capitalize");
        }

        this.quirkCase.wordCase = wordCase.toLowerCase();
    }

    setSentenceCase(sentenceCase, options = null) {
        //enforces a specific case across all text when quirkified 
        //(default is that the algorithm attempts to match the existing case of the input as closely as possible)
        if (!isString(sentenceCase) || ['lowercase', 'uppercase', 'propercase', 'alternatingcaps'].includes(sentenceCase.toLowerCase()) === false) {
            throw new Error("Must provide a valid sentence case! Options are lowercase, uppercase, propercase, and alternatingcaps.");
        }

        //if a value other than a string is provided as the (optional) second parameter, throw an error
        if (options !== null) {
            if (!options.hasOwnProperty('exceptions') || !isString(options.exceptions) || options.exceptions === '')
                throw new Error("Exceptions to enforceCase must be provided as an object { exceptions: <String of characters to exclude> }!");
        }

        //set the overall quirk case
        this.quirkCase.sentenceCase = sentenceCase.toLowerCase();

        //lastly, if we have passed a string of letters that should not be affected by case enforcement, create a match pattern for them
        if (options) {
            let matchPattern = options.exceptions;
            this.quirkCase.exceptions = new RegExp("[" + utils.escapeRegExpSpecials(matchPattern) + "]");
        }
    }

    setCapitalizeFragments(val) {
        //sets whether or not the algorithm should attempt to capitalize sentence fragments when decoding
        //(Default is false)
        if (!typeof val === "boolean") {
            throw new Error("setCapitalizeFragments must be true or false!");
        }
        this.plainCase.capitalizeFragments = val;

    }

    addSubstitution(plain, quirk, options = null) {
        //options: case-sensitive substitutions; apply to full sentences or individual words (default)
        let newSub = new Substitution(plain, quirk, options);

        //Add the substitution to our current array
        this.substitutions.push(newSub);
        //Next: attempt to sort the substitutions into a predictable order
        //TO-DO: refactor and think more about this
        this.substitutions.sort((a, b) => {
            if (b.quirk.replaceWith.length > a.quirk.replaceWith.length) {
                return true;
            }
            return false;
        });
    }

    addQuirkStripPattern(plain, options = null) {
        //To-Do: accept a regexp too
        let newStrip = new RegExp(utils.escapeRegExpSpecials(plain), "g");
        this.strip.push(newStrip);
    }

    addPlainStripPattern(plain, options = null) {
        //To-Do: accept a regexp too
        let newStrip = new RegExp(utils.escapeRegExpSpecials(plain), "g");
        this.strip.push(newStrip);
    }

    addQuirkException(word, options = null) {
        //Accepts entire words that should be excluded from quirk substitutions
        if (!isString(word) || word === "") {
            throw new Error("Exceptions must be words!");
        }
        //check if we should ignore case when matching
        const flags = ((options && options.ignoreCase === true) ? "gi" : "g");

        //create a pattern for the word
        this.exceptions.quirk.push(new RegExp(utils.escapeRegExpSpecials(word), flags));
    }

    addPlainException(word, options = null) {
        //Accepts entire words that should be excluded from plain substitutions (ex: emoji that we don't want to decode)
        if (!isString(word) || word === "") {
            throw new Error("Exceptions must be words!");
        }
        //check if we should ignore case when matching
        const flags = ((options && options.ignoreCase === true) ? "gi" : "g");

        //create a pattern for the word
        this.exceptions.plain.push(new RegExp(utils.escapeRegExpSpecials(word), flags));
    }

    //the fun part - encoding their speech!!
    toQuirk(str) {
        //we will do this sentence by sentence within a paragraph
        //first, split up the sentences
        const { sentences, whiteSpace } = utils.cleaveSentences(str);
        const adjustedSentences = sentences.map(sentence => {

            //if we have exceptions, temporarily cleave them (so we can recombine later)
            if (this.exceptions.quirk.length > 0) {
                //cleave the words apart
                let { words, whiteSpace } = utils.cleaveWords(sentence);

                //function to test if something is an exception
                const isQuirkException = (word) => {
                    for (let i = 0; i < this.exceptions.quirk.length; i++) {
                        if (this.exceptions.quirk[i].test(word) === true) {
                            return true;
                        }
                    }
                    return false;
                };
                //perform subs on one word at a time
                for (let k = 0; k < words.length; k++) {
                    if (!isQuirkException(words[k])) {
                        this.substitutions.forEach(sub => words[k] = sub.toQuirk(words[k]));
                        this.strip.forEach(strip => words[k] = words[k].replace(strip, ""));
                    }
                }

                //recombine 
                sentence = utils.recombineWhitespace(words, whiteSpace);
            } else {
                //perform substitutions (currently: across the entire sentence at once)
                this.substitutions.forEach(sub => sentence = sub.toQuirk(sentence));
                //perform any stripping
                this.strip.forEach(strip => sentence = sentence.replace(strip, ""));
            }

            //join the sentence with prefix and suffix
            sentence = (this.prefix ? this.prefix.text : '') + sentence + (this.suffix ? this.suffix.text : '');
            //next enforce sentence case
            if (this.quirkCase.sentenceCase === 'lowercase') {
                sentence = utils.convertToLowerCase(sentence, this.quirkCase.exceptions);
            } else if (this.quirkCase.sentenceCase === 'uppercase') {
                sentence = utils.convertToUpperCase(sentence, this.quirkCase.exceptions);
            } else if (this.quirkCase.sentenceCase === 'alternatingcaps') {
                sentence = utils.convertToAlternatingCase(sentence, this.quirkCase.exceptions);
            }
            else if (this.quirkCase.sentenceCase === 'propercase') {
                //note: we will only perform capitalization if this sentence is punctuated!
                if (utils.hasPunctuation(sentence)) {
                    //First, forcibly perform lowercasing
                    //TO-DO: handle exception WORDS (?)
                    sentence = utils.convertToLowerCase(sentence, this.quirkCase.exceptions);
                    sentence = utils.capitalizeOneSentence(sentence, this.quirkCase.exceptions);
                    sentence = utils.capitalizeFirstPerson(sentence);
                }
            }
            //next, enforce any word casing
            if (this.quirkCase.wordCase === 'capitalize') {
                sentence = utils.capitalizeWords(sentence);
            }

            //lastly, if there is a custom separator, add that
            if (this.separator) {
                sentence = this.separator.toQuirk(str);
            }
            //return the sentence to our map
            return sentence;
        });

        //lastly, recombine the sentences with their original whitespace
        const adjustedParagraph = utils.recombineWhitespace(adjustedSentences, whiteSpace);
        return adjustedParagraph;
    }

    //(TO-DO) Adjust to support paragraphs properly
    toPlain(str) {
        //first, split up the sentences
        const { sentences, whiteSpace } = utils.cleaveSentences(str);
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

            //check if we have any plain exceptions
            if (this.exceptions.plain.length > 0) {
                //function to test if something is an exception
                const isPlainException = (word) => {
                    for (let i = 0; i < this.exceptions.plain.length; i++) {
                        if (this.exceptions.plain[i].test(word) === true) {
                            return true;
                        }
                    }
                    return false;
                };

                //cleave the words apart
                let { words, whiteSpace } = utils.cleaveWords(sentence);

                //perform the plain fix if and only if it's not an exception
                for (let j = 0; j < words.length; j++) {
                    if (!isPlainException(words[j])) {
                        this.substitutions.forEach(sub => words[j] = sub.toPlain(words[j]));
                        //lastly, attempt to fix the case (if we can)
                    }
                }

                //recombine 
                sentence = utils.recombineWhitespace(words, whiteSpace);

            } else {
                this.substitutions.forEach(sub => sentence = sub.toPlain(sentence));
            }
            //Now we should handle case (as best we can):
            //If we did an enforced case, reset to lowercase first
            //To-do: handle any exceptions
            if (['uppercase', 'lowercase', 'alternatingcaps'].includes(this.quirkCase.sentenceCase) || this.quirkCase.wordCase === 'capitalize') {
                sentence = sentence.toLowerCase();
            }

            //Note: many quirks mess up the personal pronoun 'I' - need to ensure this is capitalized!
            sentence = utils.capitalizeFirstPerson(sentence);

            //Finally, check if this chunk is a sentence that we need to capitalize
            //(Default assumption is that a proper sentence will have punctuation at the end; otherwise it's a fragment)
            if (this.plainCase.capitalizeFragments || utils.hasPunctuation(sentence)) {
                sentence = utils.capitalizeOneSentence(sentence);
            }

            return sentence;
        });
        //lastly, recombine the sentences with their original whitespace
        const adjustedParagraph = utils.recombineWhitespace(adjustedSentences, whiteSpace);
        return adjustedParagraph;
    }
}

module.exports = Quirk;