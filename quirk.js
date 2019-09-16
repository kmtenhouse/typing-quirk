const Substitution = require("./substitution");
const regexgen = require('regexgen');

class Quirk {
    constructor() {
        //initialize the number of substitutions to nothing
        this.substitutions = [];

        //check if we received a possible config object with valid items
        if (arguments.length > 0) {
            //valid config objects are: 
            //1) one object only
            //2) not null
            //3) not an array
            if(arguments.length > 1) {
                throw new Error("Too many arguments to constructor!");
            }
            const config = arguments[0];

            if (typeof config !== 'object' || Array.isArray(config) || config===null) {
                throw new Error("Invalid argument passed to constructor!");
            } 
            console.log(config);
        }

    }

    addSubstitution(plain, quirk) {
        let newSub = new Substitution(plain, quirk);
        this.substitutions.push(newSub);
    }

    //the fun part - encoding their speech!!
    toQuirk(str) {
        this.substitutions.forEach(sub => str = sub.toQuirk(str));
        return str;
    }

    toPlain(str) {
        this.substitutions.forEach(sub => str = sub.toPlain(str));
        return str;
    }

}

module.exports = Quirk;