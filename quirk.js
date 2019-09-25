const Substitution = require("./substitution");
const utils = require("./utils");
const { isObject, isString, isRegExp } = require("./validators");

class Quirk {
    constructor() {
        //DATA THAT APPLIES TO BOTH QUIRKS AND PLAIN TEXT
        this.substitutions = [];
        this.separator = null; //default word separator is a space

        //DATA THAT APPLIES ONLY TO QUIRK
        this.quirk = {
            caseEnforcement: {
                sentence: null, //default: none
                word: null, //default: none
                exceptions: null //default: no exceptions to case
            },
            exceptions: [],
            strip: [],
            suffix: null, //default: no suffix
            prefix: null, //default: no prefix
        }

        //DATA THAT APPLIES TO PLAIN TEXT
        this.plain = {
            caseEnforcement: {
                capitalizeFragments: false //defaults to false
            },
            exceptions: [],
            strip: []
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

        this.quirk.prefix = {
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

        this.quirk.suffix = {
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

        this.quirk.caseEnforcement.word = wordCase.toLowerCase();
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
        this.quirk.caseEnforcement.sentence = sentenceCase.toLowerCase();

        //lastly, if we have passed a string of letters that should not be affected by case enforcement, create a match pattern for them
        if (options) {
            let matchPattern = options.exceptions;
            //(TO-DO): add these to any that are coming from word
            this.quirk.caseEnforcement.exceptions = new RegExp("[" + utils.escapeRegExpSpecials(matchPattern) + "]");
        }
    }

    setCapitalizeFragments(val) {
        //sets whether or not the algorithm should attempt to capitalize sentence fragments when decoding
        //(Default is false)
        if (typeof val !== "boolean") {
            throw new Error("setCapitalizeFragments must be true or false!");
        }
        this.plain.caseEnforcement.capitalizeFragments = val;

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

    //STRIPPING PATTERNS
    //PURELY DESTRUCTIVE SUBSTITUTIONS THAT REMOVE MATCHES COMPLETELY FROM THE TEXT
    addQuirkStripPattern(patternInput) {
        //Accepts a string or a regexp
        if ((!isRegExp(patternInput) && !isString(patternInput)) || patternInput === "") {
            throw new Error("Must provide an input string or regexp for the strip pattern!")
        }

        //now we just push the regexp
        const newPattern = (isRegExp(patternInput) ? patternInput : new RegExp(utils.escapeRegExpSpecials(patternInput), "g"));
        this.quirk.strip.push(newPattern);
    }

    addPlainStripPattern(patternInput) {
        //Accepts a string or a regexp
        if ((!isRegExp(patternInput) && !isString(patternInput)) || patternInput === "") {
            throw new Error("Must provide an input string for the strip pattern!")
        }

        //now we just push the regexp
        const newPattern = (isRegExp(patternInput) ? patternInput : new RegExp(utils.escapeRegExpSpecials(patternInput), "g"));
        this.plain.strip.push(newPattern);
    }


    //SUBSTITUTION EXCEPTIONS
    //ACCEPTS ENTIRE WORDS THAT SHOULD BE IGNORED WHEN PERFORMING SUBSTITUTIONS AND STRIPS
    addQuirkException(word, options = null) {
        //Accepts entire words that should be excluded from quirk substitutions
        //Accepts a string or a regexp
        if ((!isRegExp(word) && !isString(word)) || word === "") {
            throw new Error("Must provide an input string or regexp for the word!")
        }

        if (isRegExp(word)) {
            //TO-DO: check if they shot themselves in the foot?
            this.quirk.exceptions.push(word);
        } else {
            //check if we should ignore case when matching
            const flags = ((options && options.ignoreCase === true) ? "gi" : "g");

            //create a pattern for the word
            this.quirk.exceptions.push(new RegExp("^" + utils.escapeRegExpSpecials(word) + "$", flags));
        }
    }

    addPlainException(word, options = null) {
        //Accepts entire words that should be excluded from plain substitutions and strips
        //Accepts a string or a regexp
        if ((!isRegExp(word) && !isString(word)) || word === "") {
            throw new Error("Must provide an input string or regexp for the word!")
        }
        if (isRegExp(word)) {
            //TO-DO: check if they shot themselves in the foot?
            this.plain.exceptions.push(word);
        } else {
            //check if we should ignore case when matching
            const flags = ((options && options.ignoreCase === true) ? "gi" : "g");

            //create a pattern for the word
            this.plain.exceptions.push(new RegExp("^" + utils.escapeRegExpSpecials(word) + "$", flags));
        }
    }

    //HELPFUL ADDITIONS
    //Register an emoji so the code knows that it counts as 'punctuation'
    //Emoji are excepted from both plain and quirk
    addEmoji(emoji) {
        //Accepts a string or a regexp
        if ((!isRegExp(emoji) && !isString(emoji)) || emoji === "") {
            throw new Error("Must provide an input string or regexp for the emoji!")
        }

        //add the emoji to both plain and quirk exception lists
        this.addQuirkException(emoji);
        this.addPlainException(emoji);
    }

    //the fun part - encoding their speech!!
    toQuirk(str) {
        //we will do this sentence by sentence within a paragraph
        //first, split up the sentences
        const { sentences, whiteSpace } = utils.cleaveSentences(str);
        const adjustedSentences = sentences.map(sentence => {
            //Now we dive into the sentence itself!
            //Start by cleaving the words apart
            let { words, whiteSpace } = utils.cleaveWords(sentence);

            //(helper function to test if something is an exception)
            const isQuirkException = (word) => {
                for (let i = 0; i < this.quirk.exceptions.length; i++) {
                    if (this.quirk.exceptions[i].test(word) === true) {
                        return true;
                    }
                }
                return false;
            };

            //next perform subs/strips/case adjustment on one word at a time
            for (let k = 0; k < words.length; k++) {
                if (!isQuirkException(words[k])) {
                    //perform any substitutions and strips
                    this.substitutions.forEach(sub => words[k] = sub.toQuirk(words[k]));
                    this.quirk.strip.forEach(strip => words[k] = words[k].replace(strip, ""));
                    //deal with sentence case
                    switch (this.quirk.caseEnforcement.sentence) {
                        case "lowercase":
                            words[k] = utils.convertToLowerCase(words[k], this.quirk.caseEnforcement.exceptions);
                            break;
                        case "uppercase":
                            words[k] = utils.convertToUpperCase(words[k], this.quirk.caseEnforcement.exceptions);
                            break;
                        case "propercase": //Note: propercase starts by making the words lower case; final adjustment happens later
                            words[k] = utils.convertToLowerCase(words[k], this.quirk.caseEnforcement.exceptions);
                            break;
                        default: break;
                    }
                    //lastly, check if we need to enforce caps on this word in particular
                    if (this.quirk.caseEnforcement.word === 'capitalize') {
                        words[k] = utils.capitalizeOneSentence(words[k], this.quirk.caseEnforcement.exceptions);
                    }
                }
            }

            //time to recombine so we can perform our final operations on the sentence as a whole
            sentence = utils.recombineWhitespace(words, whiteSpace);

            //do one more final check for case, as certain cases affect the entire sentence
            //To-Do: figure out how this affects emoji
            if (this.quirk.caseEnforcement.sentence === "alternatingcaps") {
                sentence = utils.convertToAlternatingCase(sentence, this.quirk.caseEnforcement.exceptions);
            }

            if (this.quirk.caseEnforcement.sentence === "propercase") {
                if (utils.hasPunctuation(sentence)) {
                    sentence = utils.capitalizeOneSentence(sentence, this.quirk.caseEnforcement.exceptions);
                }
                sentence = utils.capitalizeFirstPerson(sentence);
            }

            //join the sentence with prefix and suffix
            sentence = (this.quirk.prefix ? this.quirk.prefix.text : '') + sentence + (this.quirk.suffix ? this.quirk.suffix.text : '');

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
            if (this.quirk.prefix) {
                sentence = sentence.replace(this.quirk.prefix.patternToStrip, '');
            }

            if (this.quirk.suffix) {
                sentence = sentence.replace(this.quirk.suffix.patternToStrip, '');
            }

            if (this.separator) {
                sentence = this.separator.toPlain(sentence);
            }

            //check if we have any plain exceptions
            if (this.plain.exceptions.length > 0) {
                //start by cleaving the words apart from the whitespace
                let { words, whiteSpace } = utils.cleaveWords(sentence);

                //function to test if something is an exception
                const isPlainException = (word) => {
                    for (let i = 0; i < this.plain.exceptions.length; i++) {
                        if (this.plain.exceptions[i].test(word) === true) {
                            return true;
                        }
                    }
                    return false;
                };

                //perform the plain fix if and only if it's not an exception
                for (let j = 0; j < words.length; j++) {
                    if (!isPlainException(words[j])) {
                        this.substitutions.forEach(sub => words[j] = sub.toPlain(words[j]));
                        this.plain.strip.forEach(strip => words[j] = words[j].replace(strip, ""));
                        //TO-DO lastly, attempt to fix the case (if we can)
                    }
                }

                //recombine 
                sentence = utils.recombineWhitespace(words, whiteSpace);

            } else {
                this.substitutions.forEach(sub => sentence = sub.toPlain(sentence));
                this.plain.strip.forEach(strip => sentence = sentence.replace(strip, ""));
            }
            //Now we should handle case (as best we can):
            //If we did an enforced case, reset to lowercase first
            //To-do: handle any exceptions
            if (['uppercase', 'lowercase', 'alternatingcaps'].includes(this.quirk.caseEnforcement.sentence) || this.quirk.caseEnforcement.word === 'capitalize') {
                sentence = sentence.toLowerCase();
            }

            //Note: many quirks mess up the personal pronoun 'I' - need to ensure this is capitalized!
            sentence = utils.capitalizeFirstPerson(sentence);

            //Finally, check if this chunk is a sentence that we need to capitalize
            //(Default assumption is that a proper sentence will have punctuation at the end; otherwise it's a fragment)
            if (this.plain.caseEnforcement.capitalizeFragments || utils.hasPunctuation(sentence)) {
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