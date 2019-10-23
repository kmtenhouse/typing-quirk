/* Copyright 2019 @twinarmageddons authors & contributors
/* This software may be modified and distributed under the terms
/* of the ISC License (ISC). See the LICENSE file for details. */

const Substitution = require("./substitution");
const ProseMap = require("./proseMap");
const Eraser = require('./eraser');
const { isString, isRegExp } = require("./validators");
const utils = require("./utils");

class Quirk {
    constructor() {
        //DATA THAT APPLIES TO BOTH QUIRKS AND PLAIN TEXT
        this.substitutions = [];
        this.separator = null; //default word separator is a space
        this.emoji = [];

        //DATA THAT APPLIES ONLY TO QUIRK
        this.quirk = {
            paragraph: {
                prefix: null, //default to none
                suffix: null //default to none
            },
            sentence: {
                boundaries: null, //DEFAULT: algorithm will assume all sentences are space-separated, and punctuated by one or more . ! ? ) characters
                caseEnforcement: null, //default: none
                capitalizeFragments: false, //defaults to false
                prefix: null, //default to none
                suffix: null //default to none
            },
            word: {
                boundaries: null, //default: assume words are separated by one or more spaces
                caseEnforcement: null, //default: none, 
                exceptions: [], //default is no word-level exceptions
                prefix: null, //default to none
                suffix: null //default to none
            },
            caseEnforcementExceptions: null, //default: no exceptions to case  
            strip: [],
            /*           prefix: {},
                      suffix: null, //default: no suffix */
        }

        //DATA THAT APPLIES TO PLAIN TEXT
        this.plain = {
            paragraph: {},
            sentence: {
                boundaries: null, //default: no special boundaries
                capitalizeFragments: false //defaults to false
            },
            word: {
                boundaries: null, //default: no special boundaries
                exceptions: []
            },
            strip: [],
        };
    }

    //sets a prefix to append before some text
    //(default): appends at the beginning of a sentence
    setPrefix(prefix, pattern = '', options = null) {
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

        //Finally, we can make a valid prefix!
        const prefixRegExp = (pattern ? pattern : new RegExp("^" + utils.escapeRegExpSpecials(prefix)));
        const prefixObject = new Eraser(prefix, prefixRegExp);

        //Time to see where we are applying this prefix: 
        if (options && options.paragraph) {
            this.quirk.paragraph.prefix = prefixObject;
        }

        if (options && options.word) {
            this.quirk.word.prefix = prefixObject;
            //To-do: update word boundaries
        }

        // (If no options are provided, the default prefix location is 'sentence')
        if (!options || options.sentence) {
            this.quirk.sentence.prefix = prefixObject;

            //lastly: update our sentence boundaries!  Prefixes and suffixes make detecting the edges way easier :)
            //The update will slightly depend on having a suffix:
            let newBoundaryPattern = "";
            if (!this.quirk.sentence.suffix) { //NO SUFFIX
                //PATTERN: Match at least one space, then look ahead for the prefix
                newBoundaryPattern = `\\s+(?=(${utils.escapeRegExpSpecials(this.quirk.sentence.prefix.text)}))`;
            } else {  //SUFFIX EXISTS
                //PATTERN: Look behind for suffix, then match at least one space, then look ahead for the prefix
                newBoundaryPattern = `(?<=(${utils.escapeRegExpSpecials(this.quirk.sentence.suffix.text)}))\\s+(?=(${utils.escapeRegExpSpecials(this.quirk.sentence.prefix.text)}))`;
            }
            this.quirk.sentence.boundaries = new RegExp(newBoundaryPattern, "g");
        }
    }

    setSuffix(suffix, pattern = '', options = null) {
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

        //Finally, we can make a valid suffix!
        //create the proper regexp for the suffix (if necessary)
        const suffixRegExp = (pattern ? pattern : new RegExp(utils.escapeRegExpSpecials(suffix) + "$"));
        const suffixObject = new Eraser(suffix, suffixRegExp);

        //Now, figure out what level we are attaching the suffix to
        if (options && options.paragraph) {
            this.quirk.paragraph.suffix = suffixObject;
        }

        if (options && options.word) {
            this.quirk.word.suffix = suffixObject;
            //To-do: update word boundaries
        }

        // (If no options are provided, the default prefix location is 'sentence')
        if (!options || options.sentence) {
            this.quirk.sentence.suffix = suffixObject;

            let newBoundaryPattern = "";
            //lastly: update our sentence boundaries!  Prefixes and suffixes make detecting the edges way easier :)
            //The update will slightly depend on having a suffix:
            if (!this.quirk.sentence.prefix) { //NO PREFIX
                //PATTERN: Look behind for suffix, then match at least one space
                newBoundaryPattern = `(?<=(${utils.escapeRegExpSpecials(this.quirk.sentence.suffix.text)}))\\s+`;
            } else {  //PREFIX EXISTS
                //PATTERN: Look behind for suffix, then match at least one space, then look ahead for the prefix
                newBoundaryPattern = `(?<=(${utils.escapeRegExpSpecials(this.quirk.sentence.suffix.text)}))\\s+(?=(${utils.escapeRegExpSpecials(this.quirk.sentence.prefix.text)}))`;
            }
            this.quirk.sentence.boundaries = new RegExp(newBoundaryPattern, "g");
        }
    }

    setSeparator(separator) {
        // Registers a custom sentence and word separator (ex: the*asterisk*is*the*separator*.)
        // Default behavior: separator is the same for both words and sentences
        // (To-do: Option to pass an object that specifies if this separator is for words or sentences)
        // Only disallowed separator is ''
        if (typeof separator !== 'string' || separator === '') {
            throw new Error("Must provide a valid separator!");
        }

        //Set up the substitution for separators
        this.separator = new Substitution(' ', {
            patternToMatch: /\s/g,
            replaceWith: separator
        });

        //as well as how to detect separators
        this.quirk.word.boundaries = new RegExp(utils.escapeRegExpSpecials(separator), "g");
        //To-Do: look at how sentence boundaries are affected
        this.quirk.sentence.boundaries = new RegExp(utils.escapeRegExpSpecials(separator), "g");
    }

    setWordCase(wordCase, options = null) {
        //enforces a specific case on each word within a sentence
        //(To do): add an option to set a pattern for caps 
        //(To do): make this play nicely with exceptions for sentence case as well
        //Right now the default for 'capitalize' is the first char of every word
        if (!isString(wordCase) || ['capitalize'].includes(wordCase.toLowerCase()) === false) {
            throw new Error("Must provide a valid word case!  Options are: capitalize");
        }

        this.quirk.word.caseEnforcement = wordCase.toLowerCase();
    }

    setSentenceCase(sentenceCase, options = null) {
        //enforces a specific case across all text when quirkified 
        //(default is that the algorithm attempts to match the existing case of the input as closely as possible)
        //valid options are as follows:
        const validCase = {
            "lowercase": true,
            "uppercase": true,
            "propercase": true,
            "alternatingcaps": true,
            "inversecase": true
        };

        if (!isString(sentenceCase) || !validCase[sentenceCase.toLowerCase()]) {
            throw new Error("Must provide a valid sentence case! Options are lowercase, uppercase, propercase, inversecase, and alternatingcaps.");
        }

        //if a value other than a string is provided as the (optional) second parameter, throw an error
        if (options) {
            if (!options.hasOwnProperty('exceptions') || !isString(options.exceptions) || options.exceptions === '')
                throw new Error("Exceptions to enforceCase must be provided as an object { exceptions: <String of characters to exclude> }!");
        }

        //set the overall quirk case
        this.quirk.sentence.caseEnforcement = sentenceCase.toLowerCase();

        //lastly, if we have passed a string of letters that should not be affected by case enforcement, create a match pattern for them
        if (options) {
            let matchPattern = options.exceptions;
            //(TO-DO): add these to any that are coming from word
            this.quirk.caseEnforcementExceptions = new RegExp("[" + utils.escapeRegExpSpecials(matchPattern) + "]");
        }
    }

    setCapitalizeFragments(val) {
        //sets whether or not the algorithm should attempt to capitalize sentence fragments when decoding
        //(Default is false)
        if (typeof val !== "boolean") {
            throw new Error("setCapitalizeFragments must be true or false!");
        }
        this.plain.sentence.capitalizeFragments = val;
        //TO-DO: decide if these will be different behaviors in the future!
        this.quirk.sentence.capitalizeFragments = val;
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
            this.plain.word.exceptions.push(patternToAdd);
        }

        //otherwise, as long as we don't have a 'quirk=false', this applies to quirk
        if (!options || (options && options.quirk !== false)) {
            this.quirk.word.exceptions.push(patternToAdd);
        }
    }

    //HELPFUL ADDITIONS
    //Register an emoji 
    //Emoji are excepted from both plain and quirk
    //They are also treated as a break between sentences
    addEmoji(emoji) {
        if ((!isString(emoji) && !isRegExp(emoji)) || emoji === "") {
            throw new Error("Must provide a string or valid regexp for the emoji!")
        }
        //Register the emoji as a form of punctuation!
        //We are going to make it a regexp for our own use
        const emojiRegExp = (isRegExp(emoji) ? emoji : new RegExp(utils.escapeRegExpSpecials(emoji)));
        this.emoji.push(emojiRegExp);
    }

    //the fun part - encoding their speech!!
    toQuirk(str) {
        //first, split up the sentences 
        //note: we assume that the sentence and word boundaries are English-language default
        const prose = new ProseMap(str, { emoji: this.emoji, wordBoundaries: this.plain.word.boundaries, sentenceBoundaries: this.plain.sentence.boundaries });
        prose.cleaveSentences();
        //(TO-DO): add any 'sentence level' work here

        //once we've sorted that, cleave the individual words
        prose.cleaveWords();

        //do a quick check if we'll need to care about case enforcement:
        const caseEnforcementExists = ((this.quirk.sentence.caseEnforcement || this.quirk.word.caseEnforcement || this.quirk.sentence.capitalizeFragments) ? true : false)

        //iterate through all words and perform substitions, strips, and fix case
        prose.forEach((node) => {
            if (node.isWord() && !this._isWordException(node, this.quirk.word.exceptions)) {

                //PERFORM SUBSTITUTIONS AND STRIPS
                this.substitutions.forEach(sub => node.value = sub.toQuirk(node.value));
                this.quirk.strip.forEach(strip => node.value = node.value.replace(strip, ""));

                //HANDLE CASE ISSUES (ONLY IF NECESSARY)
                if (caseEnforcementExists) {
                    this._adjustQuirkWordCase(node);
                }

            } else if (node.isSeparator()) {
                //if there is a custom separator, swap that in
                if (this.separator) {
                    node.value = this.separator.toQuirk(node.value);
                }
            }
        });

        //(if necesary) join the words back into sentences so that we can do any final sentence-wide tweaks
        //This will happen if we have a prefix or suffix
        if (this.quirk.sentence.prefix || this.quirk.sentence.suffix) {
            prose.joinWords();
            prose.forEach(sentence => {
                if (sentence.isSentence()) {
                    sentence.value = (this.quirk.sentence.prefix ? this.quirk.sentence.prefix.text : '') + sentence.value + (this.quirk.sentence.suffix ? this.quirk.sentence.suffix.text : '');
                }
            });
        }

        //at the very end, return our doctored text!
        return prose.join();
    }

    toPlain(str) {
        //first, split up the prose into sentences and deal with prefixes/suffixes/separators
        const prose = new ProseMap(str, { emoji: this.emoji, wordBoundaries: this.quirk.word.boundaries, sentenceBoundaries: this.quirk.sentence.boundaries });

        //Cut the paragraph into sentences first
        prose.cleaveSentences();

        prose.forEach((sentence) => {
            //perform the same steps on every sentence
            //start by removing any prefixes and suffixes
            if (sentence.isSentence()) {
                if (this.quirk.sentence.prefix) {
                    sentence.value = this.quirk.sentence.prefix.strip(sentence.value);
                }

                if (this.quirk.sentence.suffix) {
                    sentence.value = this.quirk.sentence.suffix.strip(sentence.value);
                }
            }
        });

        //now, cleave the words themselves to deal with strips/subs/exceptions
        prose.cleaveWords();

        //go through each node
        //if it's a word, and not an exception, we will fix strips/subs and the case
        prose.forEach(word => {
            if (word.isWord() && !this._isWordException(word, this.plain.word.exceptions)) {
                this.substitutions.forEach(sub => word.value = sub.toPlain(word.value));
                //TO-DO: decide how to handle strips/subs for entire sentence
                this.plain.strip.forEach(strip => word.value = word.value.replace(strip, ""));
                //If there was an overall case set, we then just sent the word to lowercase
                if (['uppercase', 'lowercase', 'alternatingcaps', 'inversecase'].includes(this.quirk.sentence.caseEnforcement) || this.quirk.word.caseEnforcement === 'capitalize') {
                    word.value = word.value.toLowerCase();
                } else {
                    //Otherwise, we attempt to follow the existing case as closely as possible -- by looking for SHOUTED words
                    word.value = utils.adjustForShouts(word.value);
                }
            } else if (this.separator && word.isSeparator()) {
                word.value = this.separator.toPlain(word.value);
            }
        });

        //now, recombine the word back into sentences for final tweaks
        prose.joinWords();

        //A few final sentence-wide tweaks:
        prose.forEach(sentence => {
            if (sentence.isSentence()) {
                //Ex: many quirks mess up the personal pronoun 'I' - need to ensure this is capitalized!
                sentence.value = utils.capitalizeFirstPerson(sentence.value);

                //Finally, check if this chunk is a sentence that we need to capitalize
                if (utils.hasPunctuation(sentence.value)) {
                    sentence.value = utils.capitalizeFirstCharacter(sentence.value);
                }

                if (this.plain.sentence.capitalizeFragments) {
                    sentence.value = utils.capitalizeFirstCharacter(sentence.value);
                }
            }
        });

        return prose.join();
    }
    //INTERNAL HELPERS
    //Function takes in a word node and returns true if it is an exception
    //Returns true if an exception was found, false otherwise
    _isWordException(wordNode, exceptionList) {
        for (let i = 0; i < exceptionList.length; i++) {
            if (exceptionList[i].test(wordNode.value) === true) {
                return true;
            }
        }
        return false;
    }

    //Function takes in a word node and adjusts it based on any case enforcement in place
    //Examples: UPPERCASE, lowercase
    _adjustQuirkWordCase(node) {
        //First, handle any case enforcement imposed by overall sentence:
        switch (this.quirk.sentence.caseEnforcement) {
            case "lowercase":
                node.value = utils.convertToLowerCase(node.value, this.quirk.caseEnforcementExceptions);
                break;
            case "uppercase":
                node.value = utils.convertToUpperCase(node.value, this.quirk.caseEnforcementExceptions);
                break;
            case "propercase":
                //Enforced propercase means that we must always lowercase words, save for the first one
                node.value = utils.convertToLowerCase(node.value, this.quirk.caseEnforcementExceptions);
                //Lastly, check if we need to caps any personal pronouns!
                node.value = utils.capitalizeFirstPerson(node.value);
                //(TO-DO): Capitalize any registered proper nouns
                break;
            case "inversecase":
                //Inversecase is basically the opposite of propercase... iT LOOKS LIKE THIS! wITH FIRST CHARACTER LOW, OTHERS HIGH
                node.value = utils.convertToUpperCase(node.value, this.quirk.caseEnforcementExceptions);
                break;
            default: break;
        }

        //Lastly, do some extra stuff if this is the very first word in a sentence!
        //Three cases: 
        //1) propercase is enforced => capitalize word
        //2) sentence case fragment capitalization is enabled  => capitalize word
        //3) inversecase is enforced => LOWERCASE the first word!
        if (node.isFirstWord) {
            if (this.quirk.sentence.capitalizeFragments || this.quirk.sentence.caseEnforcement === "propercase") {
                node.value = utils.capitalizeFirstCharacter(node.value, this.quirk.caseEnforcementExceptions);
            } else if (this.quirk.sentence.caseEnforcement === "inversecase") {
                node.value = utils.lowercaseFirstCharacter(node.value, this.quirk.caseEnforcementExceptions);
            }
        }

        //One other special case -- word-level rules
        //Example: Capitalizing Every Word In The Sentence
        if (this.quirk.word.caseEnforcement === 'capitalize') {
            node.value = utils.capitalizeFirstCharacter(node.value, this.quirk.caseEnforcementExceptions);
        }

        //TO-DO: move this one to the PARAGRAPH level instead!
        if (this.quirk.sentence.caseEnforcement === "alternatingcaps") {
            node.value = utils.convertToAlternatingCase(node.value, startWithCaps, this.quirk.caseEnforcementExceptions);
            //test the last valid character to see if we are going to start the next round with caps or not
            if (/[A-Z][^a-zA-Z]+$/.test(node.value)) {
                startWithCaps = false;
            } else if (/[a-z][^a-zA-Z]+$/.test(node.value)) {
                startWithCaps = true;
            }
        }
    }

    //Function takes in a paragraph node and adjusts it based on any case enforcement in place
    //Example: aLtErNaTiNg CaPs. ThAt CrOsS pErIoDs.
    _adjustQuirkParagraphCase(paragraphNode) {

    }
}

module.exports = Quirk;