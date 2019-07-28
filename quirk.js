function escapeRegExpSpecials(str) {
    const arr = str.split("");
    //matches the 12 special characters in regexps - \ ^ $ . | ? * + ( ) { [ ]
    const specialChars = /[\\\^\$\.\|\?\*\+\(\)\[\{\]]/;

    return arr
        .map(char => (specialChars.test(char) ? ("\\" + char) : char))
        .join("");
}

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
                        default:
                            break;
                    }
                });
            }
        }
        catch(err) {
            throw err;
        }
    }

    setPrefix(prefixStr) {
        //create a regexp
        if (typeof (prefixStr) !== "string" || prefixStr === "") {
            throw new Error("Prefix must be a non-empty string!");
        }
        try {
            this.prefix = new RegExp("^" + escapeRegExpSpecials(prefixStr));
        }
        catch {
            throw new Error("Invalid prefix");
        }
    }

    setSuffix(suffixStr) {
        //create a regexp
        if (typeof (suffixStr) !== "string" || suffixStr === "") {
            throw new Error("Suffix must be a non-empty string!");
        }
        try {
            this.suffix = new RegExp(escapeRegExpSpecials(suffixStr) + "$");
        }
        catch {
            throw new Error("Invalid suffix");
        }
    }


}

module.exports = Quirk;