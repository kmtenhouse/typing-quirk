const Substitution = require("./substitution");
const regexgen = require('regexgen');

class Quirk {
    constructor() {
        //initialize the number of substitutions to nothing
        this.substitutions = [];
        this.suffix = null;
        this.prefix = null;

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
            if (config.hasOwnProperty('prefix')) {
                this.addPrefix(config.prefix);
            }

            //ADD SUFFIX
            if (config.hasOwnProperty('suffix')) {
                this.addPrefix(config.suffix);
            }
        }

    }

    addPrefix(prefix) {
        if (typeof prefix !== "string" || prefix === '') {
            throw new Error("Prefix must be a non-empty string!");
        }

        let prefixPattern = "^" + escapeRegExpSpecials(prefix);
        console.log(prefixPattern);
        let prefixRegExp = new RegExp(prefixPattern);

        //create the proper regexp for the prefix (if necessary)
        this.prefix = {
            text: prefix,
            patternToStrip: prefixRegExp
        };
    }

    addSuffix(suffix) {
        if (typeof suffix !== "string" || suffix === '') {
            throw new Error("Suffix must be a non-empty string!");
        }
        //create the proper regexp for the suffix (if necessary)
        let suffixPattern = escapeRegExpSpecials(suffix)+ "$";
        let suffixRegExp = new RegExp(suffixPattern);

        this.suffix = {
            text: suffix,
            patternToStrip: suffixRegExp
        };
    }

    addSubstitution(plain, quirk) {
        let newSub = new Substitution(plain, quirk);
        this.substitutions.push(newSub);
    }

    //the fun part - encoding their speech!!
    toQuirk(str) {
        this.substitutions.forEach(sub => str = sub.toQuirk(str));
        return (this.prefix ? this.prefix.text : '') + str + (this.suffix ? this.suffix.text : '');
    }

    toPlain(str) {
        //start by removing prefix and suffix from the whole string
        if (this.prefix) {
            str = str.replace(this.prefix.patternToStrip, '');
        }

        if (this.suffix) {
            str = str.replace(this.suffix.patternToStrip, '');
        }

        this.substitutions.forEach(sub => str = sub.toPlain(str));
        return str;
    }

}

//HELPER FUNCTIONS
//
//
function escapeRegExpSpecials(str) {
    const arr = str.split("");
    //matches the 12 special characters in regexps - \ ^ $ . | ? * + ( ) { [ ]
    const specialChars = /[\\\^\$\.\|\?\*\+\(\)\[\{\]]/;

    return arr
        .map(char => (specialChars.test(char) ? ("\\" + char) : char))
        .join("");
}

module.exports = Quirk;