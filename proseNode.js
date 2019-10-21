/* Copyright 2019 @twinarmageddons authors & contributors
/* This software may be modified and distributed under the terms
/* of the ISC License (ISC). See the LICENSE file for details. */

//proseNode: an object which contains text, emoji, or separators
//intended for use when breaking a paragraph into sentences and words
class ProseNode {
    constructor(value, nodeType) {
        this.value = value;
        this.next = null;
        this.isFirstWord = false;
        //set the node type based on a human readable map
        switch (nodeType) {
            case "paragraph": this._nodeType = 0;
                break;
            case "sentence": this._nodeType = 1;
                break;
            case "sentence separator": this._nodeType = 2;
                break;
            case "word": this._nodeType = 3;
                break;
            case "word separator": this._nodeType = 4;
                break;
            case "emoji": this._nodeType = 5;
                break;
            default: this._nodeType = -1;
                break;
        }
    }

    //GETTERS AND SETTERS
    //nodeName -- returns a human readable string about what a node contains
    get nodeName() {
        let result;
        switch (this._nodeType) {
            case 0: result = "paragraph";
                break;
            case 1: result = "sentence";
                break;
            case 2: result = "sentence separator";
                break;
            case 3: result = "word";
                break;
            case 4: result = "word separator";
                break;
            case 5: result = "emoji";
                break;
            default: result = "null";
                break;
        }
        return result;
    }

    set nodeType(val) {
        if(Number.isInteger(val) && val < 6 && val >= 0) { 
            this._nodeType = val;
        } 
    }

    get nodeType() {
        return this._nodeType;
    }

    //HELPER FUNCTIONS
    isSeparator() {
        //returns true if the node is any kind of separator
        return (this._nodeType === 2 || this._nodeType === 4);
    }

    isParagraph() {
        //returns true if the node is a paragraph
        return this._nodeType === 0;
    }

    isSentence() {
        //returns true if the node is a sentence
        return this._nodeType === 1;
    }

    isSentenceSeparator() {
        //returns true if the node is a sentence
        return this._nodeType === 2;
    }

    isWord() {
        //returns true if the node is a word
        return this._nodeType === 3;
    }

    isWordSeparator() {
        //returns true if the node is a word separator
        return this._nodeType === 4;
    }

    isEmoji() {
        //returns true if the node is an emoji
        return this._nodeType === 5;
    }
}

module.exports = ProseNode;