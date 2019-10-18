const Substitution = require("./substitution");
const utils = require("./utils");
const ProseMap = require("./proseMap");
const { isObject, isString, isRegExp } = require("./validators");

class Quirk {
    constructor() {
        //DATA THAT APPLIES TO BOTH QUIRKS AND PLAIN TEXT
        this.substitutions = [];
        this.separator = null; //default word separator is a space
        this.emoji = [];

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
            sentenceBoundary: null, //DEFAULT: algorithm will assume all sentences are space-separated, and punctuated by one or more . ! ? ) characters
            wordBoundary: null //default: assume that words are separated by spaces
        }

        //DATA THAT APPLIES TO PLAIN TEXT
        this.plain = {
            caseEnforcement: {
                capitalizeFragments: false //defaults to false
            },
            exceptions: [],
            strip: []
        };
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

        //lastly: update our sentence boundaries!  Prefixes and suffixes make detecting the edges way easier :)
        //The update will slightly depend on having a suffix:
        let newBoundaryPattern = "";
        if (!this.quirk.suffix) { //NO SUFFIX
            //PATTERN: Match at least one space, then look ahead for the prefix
            newBoundaryPattern = `\\s+(?=(${utils.escapeRegExpSpecials(this.quirk.prefix.text)}))`;
        } else {  //SUFFIX EXISTS
            //PATTERN: Look behind for suffix, then match at least one space, then look ahead for the prefix
            newBoundaryPattern = `(?<=(${utils.escapeRegExpSpecials(this.quirk.suffix.text)}))\\s+(?=(${utils.escapeRegExpSpecials(this.quirk.prefix.text)}))`;
        }
        this.quirk.sentenceBoundary = new RegExp(newBoundaryPattern, "g");
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

        let newBoundaryPattern = "";

        //lastly: update our sentence boundaries!  Prefixes and suffixes make detecting the edges way easier :)
        //The update will slightly depend on having a suffix:
        if (!this.quirk.prefix) { //NO PREFIX
            //PATTERN: Look behind for suffix, then match at least one space
            newBoundaryPattern = `(?<=(${utils.escapeRegExpSpecials(this.quirk.suffix.text)}))\\s+`;
        } else {  //PREFIX EXISTS
            //PATTERN: Look behind for suffix, then match at least one space, then look ahead for the prefix
            newBoundaryPattern = `(?<=(${utils.escapeRegExpSpecials(this.quirk.suffix.text)}))\\s+(?=(${utils.escapeRegExpSpecials(this.quirk.prefix.text)}))`;
        }
        this.quirk.sentenceBoundary = new RegExp(newBoundaryPattern, "g");
    }

    setSeparator(separator) {
        // Registers a custom word separator (ex: the*asterisk*is*the*separator*.)
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
        this.quirk.wordBoundary = new RegExp(utils.escapeRegExpSpecials(separator), "g");
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
        if ( (!isString(emoji) && !isRegExp(emoji) ) || emoji === "") {
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
        const prose = new ProseMap(str);
        prose.cleaveSentences(); 
        //(Note: we definitely want to split out any emoji as well)
        prose.cleaveEmoji(this.emoji);
        //once we've sorted that, cleave the individual words
        prose.cleaveWords();

        //(helper function to test if something is an exception)
        const isQuirkException = (word) => {
            for (let i = 0; i < this.quirk.exceptions.length; i++) {
                if (this.quirk.exceptions[i].test(word) === true) {
                    return true;
                }
            }
            return false;
        };

        //iterate through all words and perform substitions, strips, and fix case
        prose.forEach((node) => {
            let startWithCaps = false;
            if (node.isWord() && !isQuirkException(node.value)) {
                //PERFORM SUBSTITUTIONS AND STRIPS
                this.substitutions.forEach(sub => node.value = sub.toQuirk(node.value));
                this.quirk.strip.forEach(strip => node.value = node.value.replace(strip, ""));
                //HANDLE CASE ISSUES
                //Case enforcement imposed by overall sentence:
                switch (this.quirk.caseEnforcement.sentence) {
                    case "lowercase":
                        node.value = utils.convertToLowerCase(node.value, this.quirk.caseEnforcement.exceptions);
                        break;
                    case "uppercase":
                        node.value = utils.convertToUpperCase(node.value, this.quirk.caseEnforcement.exceptions);
                        break;
                    case "propercase":
                        node.value = utils.convertToLowerCase(node.value, this.quirk.caseEnforcement.exceptions);
                        if (node.isFirstWord) {
                            node.value = utils.capitalizeOneSentence(node.value, this.quirk.caseEnforcement.exceptions);
                        }
                        //Check if we need to caps any personal pronouns!
                        node.value = utils.capitalizeFirstPerson(node.value);
                        break;
                    default: break;
                }
                //If capitalize fragments is on, we also caps the first word of fragments
                if (node.isFirstWord && this.quirk.caseEnforcement.capitalizeFragments) {
                    node.value = utils.capitalizeOneSentence(node.value, this.quirk.caseEnforcement.exceptions);
                }

                //Lastly, check if we need to enforce caps on this word in particular
                if (this.quirk.caseEnforcement.word === 'capitalize') {
                    node.value = utils.capitalizeOneSentence(node.value, this.quirk.caseEnforcement.exceptions);
                }

                if (this.quirk.caseEnforcement.sentence === "alternatingcaps") {
                    node.value = utils.convertToAlternatingCase(node.value, startWithCaps, this.quirk.caseEnforcement.exceptions);
                    //test the last valid character to see if we are going to start the next round with caps or not
                    if (/[A-Z][^a-zA-Z]+$/.test(node.value)) {
                        startWithCaps = false;
                    } else if (/[a-z][^a-zA-Z]+$/.test(node.value)) {
                        startWithCaps = true;
                    }
                }

            } else if (node.isSeparator()) {
                //if there is a custom separator, add that
                if (this.separator) {
                    node.value = this.separator.toQuirk(node.value);
                }
            }
        });

        //(if necesary) join the words back into sentences so that we can do any final sentence-wide tweaks
        //This will happen if we have a prefix or suffix
        if (this.quirk.prefix || this.quirk.suffix) {
            prose.joinWords();
            prose.forEach(sentence => {
                sentence.value = (this.quirk.prefix ? this.quirk.prefix.text : '') + sentence.value + (this.quirk.suffix ? this.quirk.suffix.text : '');
            }, { sentence: true });
        }

        //at the very end, return our doctored text!
        return prose.join();
    }

    toPlain(str) {
        //first, split up the prose into sentences and deal with prefixes/suffixes/separators
        const prose = new ProseMap(str);
        prose.cleaveSentences(this.quirk.sentenceBoundary);
        prose.cleaveEmoji(this.emoji, this.quirk.wordBoundary);
        prose.forEach((sentence) => {
            //perform the same steps on every sentence
            //start by removing any prefixes and suffixes
            if (this.quirk.prefix) {
                sentence.value = sentence.value.replace(this.quirk.prefix.patternToStrip, '');
            }

            if (this.quirk.suffix) {
                sentence.value = sentence.value.replace(this.quirk.suffix.patternToStrip, '');
            }
        }, { sentence: true });

        //now, cleave the words themselves to deal with strips/subs/exceptions
        prose.cleaveWords(this.quirk.wordBoundary);

        //(helper function to test if something is an exception)
        const isPlainException = (word) => {
            for (let i = 0; i < this.plain.exceptions.length; i++) {
                if (this.plain.exceptions[i].test(word) === true) {
                    return true;
                }
            }
            return false;
        };

        //go through each node
        //if it's a word, and not an exception, we will fix strips/subs and the case
        prose.forEach(word => {
            if (word.isWord() && !isPlainException(word.value)) {
                this.substitutions.forEach(sub => word.value = sub.toPlain(word.value));
                //TO-DO: decide how to handle strips/subs for entire sentence
                this.plain.strip.forEach(strip => word.value = word.value.replace(strip, ""));
                //If there was an overall case set, we then just sent the word to lowercase
                if (['uppercase', 'lowercase', 'alternatingcaps'].includes(this.quirk.caseEnforcement.sentence) || this.quirk.caseEnforcement.word === 'capitalize') {
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
            //Ex: many quirks mess up the personal pronoun 'I' - need to ensure this is capitalized!
            sentence.value = utils.capitalizeFirstPerson(sentence.value);

            //Finally, check if this chunk is a sentence that we need to capitalize
            if (utils.hasPunctuation(sentence.value)) {
                sentence.value = utils.capitalizeOneSentence(sentence.value);
            }

            if (this.plain.caseEnforcement.capitalizeFragments) {
                sentence.value = utils.capitalizeOneSentence(sentence.value);
            }
        }, { sentence: true });

        return prose.join();
    }
}

module.exports = Quirk;