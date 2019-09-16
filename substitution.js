class Substitution {
    constructor(regexpPattern, str) {
        if(typeof str!=="string") {
            throw new Error("Only strings can be encoded!");
        } else if (!(regexpPattern instanceof RegExp)) {
            throw new Error("Must provide a regular expression!");
        }
        this.pattern = regexpPattern;
        this.replaceWith = str;
    }

    encode(str) {
        if(typeof str!=="string") {
            throw new Error("Only strings can be encoded!");
        }

        return str.replace(this.pattern, this.replaceWith);
    }
}

module.exports = Substitution;