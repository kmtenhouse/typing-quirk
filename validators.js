function isObject(obj) {
    return(typeof obj === 'object' && obj!==null && !Array.isArray(obj));
}

function isString(str) {
    return(typeof str === 'string');
}

module.exports = {
    isObject: isObject,
    isString: isString
}