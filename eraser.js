/* Copyright 2019 @twinarmageddons authors & contributors
/* This software may be modified and distributed under the terms
/* of the ISC License (ISC). See the LICENSE file for details. */

const escapeRegExpSpecials = require('./utils').escapeRegExpSpecials;
const { isString, isRegExp } = require('./validators');

//This is a one-way substitution which erases a particular pattern from a string
//by replacing it with ''
class Eraser {
    constructor(whatToStrip, patternToStrip) {
        if(!isString(whatToStrip) || (patternToStrip && !isRegExp(patternToStrip)) ) {
            throw new Error("Must provide plain text (and optionally also a regular expression) for what to strip!")
        }

        this.patternToStrip = (isRegExp(patternToStrip) ? patternToStrip : new RegExp(escapeRegExpSpecials(whatToStrip), "g") );
    }

    strip(str) {
        str = str.replace(this.patternToStrip, '');
        return str;
    }
}

module.exports = Eraser;