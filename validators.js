/* Copyright 2019 @twinarmageddons authors & contributors
/* This software may be modified and distributed under the terms
/* of the ISC License (ISC). See the LICENSE file for details. */

function isObject(obj) {
    return(typeof obj === 'object' && obj!==null && !Array.isArray(obj));
}

function isString(str) {
    return(typeof str === 'string');
}

function isRegExp(reg) {
    return(reg instanceof RegExp);
}

module.exports = {
    isObject: isObject,
    isString: isString,
    isRegExp: isRegExp
}