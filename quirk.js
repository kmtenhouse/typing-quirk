const Substitution = require("./substitution");
const utils = require("./utils")

class Quirk {
    constructor() {
        //initialize the number of substitutions to nothing
        this.substitutions = [];
        this.suffix = null; //default: no suffix
        this.prefix = null; //default: no prefix
        this.separator = null; //default word separator is a space
        this.sentenceCase = null; //default: attempt to follow the input as closely as possible

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

            if (typeof config !== 'object' || Array.isArray(config) || config === null) {
                throw new Error("Invalid argument passed to constructor!");
            }

            //use the config object to set up the quirk :)
            //ADD PREFIX
            /*  if (config.hasOwnProperty('prefix')) {
                 this.addPrefix(config.prefix);
             } */

            //ADD SUFFIX
            /* if (config.hasOwnProperty('suffix')) {
                this.addPrefix(config.suffix);
            } */

            //ADD SEPARATORS
            /*   if (config.hasOwnProperty('separator')) {
                  this.addPrefix(config.separator);
              } */
        }

    }

    addPrefix(prefix, pattern = '') {
        if (typeof prefix !== "string" || prefix === '') {
            throw new Error("Prefix must be a non-empty string!");
        }

        //if a pattern paramater was provided, check that 1) a regular expression
        if (pattern !== '' && !(pattern instanceof RegExp)) {
            throw new Error("Invalid regexp provided!");
        }
        //...and that it's a valid regexp for the start of a string
        if (pattern instanceof RegExp && !/^\^/.test(pattern.source)) {
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
        if (typeof suffix !== "string" || suffix === '') {
            throw new Error("Suffix must be a non-empty string!");
        }

        //if a pattern paramater was provided, check that 1) a regular expression
        if (pattern !== '' && !(pattern instanceof RegExp)) {
            throw new Error("Invalid regexp provided!");
        }
        //...and that it's a valid regexp for the end of a string
        if (pattern instanceof RegExp && !/\$$/.test(pattern.source)) {
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

    enforceCase(sentenceCase) {
        //enforces a specific case-sensitivity across all the text
        //(default is that the algorithm attempts to match the existing case as closely as possible)
        if (typeof sentenceCase !== 'string') {
            throw new Error("Must provide a valid sentence case! Options are lowercase, uppercase, propercase.");
        }

        const caseProvided = sentenceCase.toLowerCase();
        if (caseProvided === 'lowercase' || caseProvided === 'uppercase' || caseProvided === 'propercase') {
            this.sentenceCase = caseProvided;
        } else {
            throw new Error("Must provide a valid sentence case! Options are lowercase, uppercase, propercase.");
        }

    }

    addSubstitution(plain, quirk, options = null) {
        //options: case-sensitive substitutions; apply to full sentences or individual words (default)
        let newSub = new Substitution(plain, quirk);
        this.substitutions.push(newSub);
    }

    //the fun part - encoding their speech!!
    toQuirk(str) {
        this.substitutions.forEach(sub => str = sub.toQuirk(str));

        if (this.separator) {
            str = this.separator.toQuirk(str);
        }

        //join the sentence
        str = (this.prefix ? this.prefix.text : '') + str + (this.suffix ? this.suffix.text : '');
        //lastly, enforce case

        if (this.sentenceCase) {
            switch (this.sentenceCase) {
                case 'lowercase': str = str.toLowerCase();
                    break;
                case 'uppercase': str = str.toUpperCase();
                    break;
                default:
                    break;
            }
        }

        return str;
    }

    toPlain(str) {
        //start by removing prefix and suffix from the whole string
        if (this.prefix) {
            str = str.replace(this.prefix.patternToStrip, '');
        }

        if (this.suffix) {
            str = str.replace(this.suffix.patternToStrip, '');
        }

        if (this.separator) {
            str = this.separator.toPlain(str);
        }
        this.substitutions.forEach(sub => str = sub.toPlain(str));
        return str;
    }

}

module.exports = Quirk;