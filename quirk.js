const utils = require("./utils");
const Substitution = require("./substitution");

class Quirk {
    constructor() {
        try {
            this.substitutions = [];
            //the constructor can (optionally) take an object 
            if (arguments.length === 1 && typeof (arguments[0] === "object") && !Array.isArray(arguments[0])) {
                const configObj = arguments[0];

                if(configObj.hasOwnProperty("prefix")) {
                    this.setPrefix(configObj.prefix);
                }

                if(configObj.hasOwnProperty("suffix")) {
                    this.setSuffix(configObj.suffix);
                }

                if(configObj.hasOwnProperty("separator")) {
                    this.setSeparator(configObj.separator);
                } else {
                    //defaults to spaces
                    this.separator = { 
                        text: " ",
                        pattern: / /g
                    }
                }

                if(configObj.hasOwnProperty("substitutions") && Array.isArray(configObj.substitutions)) {
                    configObj.substitutions.forEach(sub => this.setSubstitution(sub));
                }
            }
        }
        catch (err) {
            throw err;
        }
    }

    setPrefix(prefixStr) {
        //create a regexp
        if (typeof (prefixStr) !== "string" || prefixStr === "") {
            throw new Error("Prefix must be a non-empty string!");
        }
        try {
            this.prefix = {
                pattern: new RegExp("^" + utils.escapeRegExpSpecials(prefixStr)),
                text: prefixStr
            };
        }
        catch (err) {
            throw err;
        }
    }

    setSuffix(suffixStr) {
        //create a regexp
        if (typeof (suffixStr) !== "string" || suffixStr === "") {
            throw new Error("Suffix must be a non-empty string!");
        }
        try {
            this.suffix = {
                pattern: new RegExp(utils.escapeRegExpSpecials(suffixStr) + "$"),
                text: suffixStr
            };
        }
        catch (err) {
            throw err;
        }
    }

    setSeparator(separator) {
        if (typeof (separator) !== "string" || separator === "") {
            throw new Error("Invalid separator!");
        }

       this.separator = {
           text: separator, 
           pattern: new RegExp(utils.escapeRegExpSpecials(separator), "g")
       };
    }

    setSubstitution(sub) {
        //takes in an original string, to be replaced by the quirk version
        if(!sub.hasOwnProperty(plain) || !sub.hasOwnProperty(quirk)) {
            throw new Error("Invalid substitution!");
        }

        const newSub = new Substitution({
            plainText: plain,
            quirkText: quirk
        });

        this.substitutions.push(newSub);
        
    }

    //takes in a string
    //returns the encoded version of that string
    encode(str) {
        //first, determine if we are going to use a custom separator or not

        let newStr = str.split(/ /)
            .map(word => {
                this.substitutions.forEach(sub => {
                    word = word.replace(sub.plain.pattern, sub.quirk.text);
                })
                return word;
            })
            .join(this.separator.text);

        return (this.prefix ? this.prefix.text : "") + newStr + (this.suffix ? this.suffix.text : "");
    }

    decode(str) {
        let newStr = str;
        if (this.prefix) {
            newStr = newStr.replace(this.prefix.pattern, "");
        }
        if (this.suffix) {
            newStr = newStr.replace(this.suffix.pattern, "");
        }
        if(this.separator) {
            newStr = newStr.replace(this.separator.pattern," ");
        }

        return newStr;
    }

}

module.exports = Quirk;