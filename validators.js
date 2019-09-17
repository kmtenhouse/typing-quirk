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