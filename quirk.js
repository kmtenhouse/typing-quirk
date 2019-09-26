const Substitution = require("./substitution");
const utils = require("./utils");
const { isObject, isString, isRegExp } = require("./validators");

class Quirk {
    constructor() {
        //DATA THAT APPLIES TO BOTH QUIRKS AND PLAIN TEXT
        this.substitutions = [];
        this.separator = null; //default word separator is a space
        this.punctuation = [];

        //DATA THAT APPLIES ONLY TO QUIRK
        this.quirk = {
            caseEnforcement: {
                sentence: null, //default: none
                word: null, //default: none
                exceptions: null, //default: no exceptions to case
                capitalizeFragments: false //defaults to false
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
        //TO-DO: decide if these will be different behaviors in the future!
        this.quirk.caseEnforcement.capitalizeFragments = val;
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
    //By default, stripping is only applied when going INTO a quirk 
    //Developers can optionally pass an options object to strip for plain, or both

    addStripPattern(patternInput, options = null) {
        //Accepts a string or a regexp
        if ((!isRegExp(patternInput) && !isString(patternInput)) || patternInput === "") {
            throw new Error("Must provide an input string or regexp for the strip pattern!")
        }

        //now we just push the regexp
        const newPattern = (isRegExp(patternInput) ? patternInput : new RegExp(utils.escapeRegExpSpecials(patternInput), "g"));

        //check for options...
        if (options) {
            if (options.hasOwnProperty("quirk") && options.quirk === true) {
                this.quirk.strip.push(newPattern);
            }

            if (options.hasOwnProperty("plain") && options.plain === true) {
                this.plain.strip.push(newPattern);
            }
        } else {
            this.quirk.strip.push(newPattern);
        }

    }

    //SUBSTITUTION EXCEPTIONS
    //ACCEPTS ENTIRE WORDS THAT SHOULD BE IGNORED WHEN PERFORMING SUBSTITUTIONS AND STRIPS
    //By default, word exceptions apply when going into a quirk
    //Developers can optionally pass an options object to strip for plain, or both
    addWordException(word, options = null) {
        //Accepts entire words that should be excluded from quirk substitutions
        //Accepts a string or a regexp
        if ((!isRegExp(word) && !isString(word)) || word === "") {
            throw new Error("Must provide an input string or regexp for the word!")
        }

        const flags = ((options && options.ignoreCase === true) ? "i" : "");
        const patternToAdd = (isRegExp(word) ? word : new RegExp("^" + utils.escapeRegExpSpecials(word) + "$", flags));

        //If we have the 'plain=true' flag set, this exception works for both!
        if (options && options.plain === true) {
            this.plain.exceptions.push(patternToAdd);
        }

        //otherwise, as long as we don't have a 'quirk=false', this applies to quirk
        if (!options || (options && options.quirk !== false)) {
            this.quirk.exceptions.push(patternToAdd);
        }
    }

    //HELPFUL ADDITIONS
    //Register an emoji so the code knows that it counts as 'punctuation'
    //Emoji are excepted from both plain and quirk
    addEmoji(emoji) {
        //Accepts a string only, because we have to do some gnarly regexp stuff
        if (!isString(emoji) || emoji === "") {
            throw new Error("Must provide a string for the emoji!")
        }

        //add the emoji to both plain and quirk exception lists
        this.addWordException(emoji, { quirk: true, plain: true });

        //Register the emoji as a form of punctuation!
        this.punctuation.push(emoji);
    }

    //the fun part - encoding their speech!!
    toQuirk(str) {
        //we will do this sentence by sentence within a paragraph
        //first, split up the sentences
        //there are two special cases here:
        //1) custom suffix exists (which takes precedence!)
        //2) custom punctuation exists
        const sentenceBoundaryModifier = (this.suffix ? [this.suffix.text] : this.punctuation);
        const { sentences, whiteSpace } = utils.cleaveSentences(str, sentenceBoundaryModifier);
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
            //To-Do: figure out how this one affects emoji
            if (this.quirk.caseEnforcement.sentence === "alternatingcaps") {
                sentence = utils.convertToAlternatingCase(sentence, this.quirk.caseEnforcement.exceptions);
            }

            if (this.quirk.caseEnforcement.sentence === "propercase") {
                if (utils.hasPunctuation(sentence, this.punctuation)) {
                    sentence = utils.capitalizeOneSentence(sentence, this.quirk.caseEnforcement.exceptions);
                }
                sentence = utils.capitalizeFirstPerson(sentence);
            }

            //If capitalize fragments is on, we also caps the sentence
            if (this.quirk.caseEnforcement.capitalizeFragments) {
                sentence = utils.capitalizeOneSentence(sentence, this.quirk.caseEnforcement.exceptions);
            }

            //nex, join the prepared sentence with prefix and suffix
            sentence = (this.quirk.prefix ? this.quirk.prefix.text : '') + sentence + (this.quirk.suffix ? this.quirk.suffix.text : '');

            //lastly, if there is a custom separator, add that
            if (this.separator) {
                sentence = this.separator.toQuirk(str);
            }
            //AT LAST!  we return the sentence to our map
            return sentence;
        });

        //at the very end, we recombine the sentences with their original whitespace to reform a paragraph
        const adjustedParagraph = utils.recombineWhitespace(adjustedSentences, whiteSpace);
        return adjustedParagraph;
    }

    //(TO-DO) Adjust to support paragraphs properly
    toPlain(str) {
        //first, split up the sentences from the paragraph
        const { sentences, whiteSpace } = utils.cleaveSentences(str, this.punctuation);
        const adjustedSentences = sentences.map(sentence => {
            //perform the same steps on every sentence
            //start by removing any prefixes and suffixes
            if (this.quirk.prefix) {
                sentence = sentence.replace(this.quirk.prefix.patternToStrip, '');
            }

            if (this.quirk.suffix) {
                sentence = sentence.replace(this.quirk.suffix.patternToStrip, '');
            }

            //next, remove any weird separators if we have them
            if (this.separator) {
                sentence = this.separator.toPlain(sentence);
            }

            //now, cleave the words themselves
            let { words, whiteSpace } = utils.cleaveWords(sentence);

            //(helper function to test if something is an exception)
            const isPlainException = (word) => {
                for (let i = 0; i < this.plain.exceptions.length; i++) {
                    if (this.plain.exceptions[i].test(word) === true) {
                        return true;
                    }
                }
                return false;
            };

            for (let j = 0; j < words.length; j++) {
                if (!isPlainException(words[j])) {
                    this.substitutions.forEach(sub => words[j] = sub.toPlain(words[j]));
                    //TO-DO: decide how to handle strips/subs for entire sentence
                    this.plain.strip.forEach(strip => words[j] = words[j].replace(strip, ""));
                    //If there was an overall case set, we then just sent the word to lowercase
                    if (['uppercase', 'lowercase', 'alternatingcaps'].includes(this.quirk.caseEnforcement.sentence) || this.quirk.caseEnforcement.word === 'capitalize') {
                        words[j] = words[j].toLowerCase();
                    } else { 
                        //Otherwise, we attempt to follow the existing case as closely as possible -- by looking for SHOUTED words
                        words[j] = utils.adjustForShouts(words[j]);
                    }
                } 
            }


            //now, recombine the words with their whitespace
            sentence = utils.recombineWhitespace(words, whiteSpace);

            //A few final tweaks!
            //Ex: many quirks mess up the personal pronoun 'I' - need to ensure this is capitalized!
            sentence = utils.capitalizeFirstPerson(sentence);

            //Finally, check if this chunk is a sentence that we need to capitalize
            //(Default assumption is that a proper sentence will have punctuation at the end; otherwise it's a fragment)
            if (this.plain.caseEnforcement.capitalizeFragments || utils.hasPunctuation(sentence, this.punctuation)) {
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