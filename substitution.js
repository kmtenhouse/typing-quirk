const utils = require("./utils");

class Substitution {
    constructor() {
        if (arguments.length === 1 && typeof (arguments[0] === "object") && !Array.isArray(arguments[0])) {
            const configObj = arguments[0];
            if(!configObj.hasOwnProperty("quirkText") || !configObj.hasOwnProperty("plainText")) {
                throw new Error("Must include both the quirkText and the plainText it will replace!");
            }
            this.quirk = {
                pattern: new RegExp(utils.escapeRegExpSpecials(configObj.quirkText), "g"),
                text: configObj.quirkText
            };
            this.plain = {
                pattern: new RegExp(utils.escapeRegExpSpecials(configObj.plainText), "g"),
                text: configObj.plainText
            }
        }
    }
}

module.exports = Substitution;