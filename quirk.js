const utils = require("./utils");
const Substitution = require("./substitution");

class Quirk {
    constructor() {
        try {
            //the constructor can (optionally) take an object 
            if (arguments.length === 1 && typeof (arguments[0] === "object") && !Array.isArray(arguments[0])) {
                const configObj = arguments[0];
                const keys = Object.keys(configObj);
                keys.forEach(key => {
                    switch (key) {
                        case "prefix": this.setPrefix(configObj[key]);
                            break;
                        case "suffix": this.setSuffix(configObj[key]);
                            break;
                        case "separator": this.setSeparator(configObj[key]);
                            break;
                        default:
                            break;
                    }
                });
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

    //takes in a string
    //returns the encoded version of that string
    encode(str) {
        return (this.prefix ? this.prefix.text : "") + (this.separator ? str.replace(/\s/g, this.separator.text) : str) + (this.suffix ? this.suffix.text : "");
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