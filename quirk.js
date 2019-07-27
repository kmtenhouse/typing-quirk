class Quirk {
    constructor(prefix) {
        if(arguments.length > 0) {
            this.prefix = prefix;
        }
    }

    prefix(prefix) {
        //create a regexp
        if(typeof(prefix)!=="string" || prefix==="") {
            throw new Error("Prefix must be a non-empty string!");
        }
        try {
            this.prefix = new RegExp("^" + this.escapeRegExpSpecials(prefix));
        }
        catch {
            throw new Error("Invalid prefix");
        }
    }

    escapeRegExpSpecials(str) {
        const arr = str.split("");
        //matches the 12 special characters in regexps - \ ^ $ . | ? * + ( ) { [ ]
        const specialChars = /[\\\^\$\.\|\?\*\+\(\)\[\{\]]/;

        return arr
            .map(char => (specialChars.test(char) ? ("\\" + char) : char) )
            .join("");
    }
}

module.exports = Quirk;