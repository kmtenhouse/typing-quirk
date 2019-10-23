/* Copyright 2019 @twinarmageddons authors & contributors
/* This software may be modified and distributed under the terms
/* of the ISC License (ISC). See the LICENSE file for details. */

//PROSEMAP
//A better way to separate a paragraph into individual words while preserving all information about whitespace

//Requires the ProseNode class
const Node = require("./proseNode");
//V1.1.1: Switching from LinkedList to arrays for better performance, ability to use array features such as built-in filter and map

class ProseMap {
    //by default our input will contain one node and assume it contains a paragraph
    //optionally, developers can provide custom settings for word boundaries, sentence boundaries, and a list of emoji 
    constructor(text = "", options = null) {
        //define an array of ProseNodes
        this.nodes = [];
        //by default, a new ProseMap will contain one node - a paragraph
        this.text = text;
        //define our word and sentence boundaries
        this.wordBoundaries = ((options && options.wordBoundaries) ? options.wordBoundaries : /(?<!^)\s/g); //default: assume 'words' are separated by one or more whitespaces
        this.sentenceBoundaries = ((options && options.sentenceBoundaries) ? options.sentenceBoundaries : /(?<=[^\,][\"\'\`\.\!\?\)])\s+/g); //default: assume 'sentences' are terminated by one or more " ' ` ! ? ) and then whitespace
        //define any exceptions
        this.emoji = ((options && options.emoji) ? options.emoji : []); //default: no emoji are registered
    }

    //GETTERS AND SETTERS
    //Text: the complete text contained in a prosemap
    get text() {
        return this.join();
    }

    set text(str) {
        //WARNING: THIS IS A DESTRUCTIVE ACTION!  It removes the old text and changes it
        if (typeof str !== "string") {
            throw new Error("Must provide a string as the text for a prosemap!");
        }
        //okay, we 
        this.nodes = [];
        //by default, a new ProseMap will contain one node - a paragraph
        this.level = "paragraph";
        const firstNode = new Node(str, "paragraph");
        this.nodes.push(firstNode);
    }

    //Sentence Boundaries: the regular expression that detects how sentences should be kept apart
    get sentenceBoundaries() {
        return this._sentenceBoundaries;
    }

    set sentenceBoundaries(pattern) {
        if (pattern instanceof RegExp === false) {
            throw new Error("Must provide a regular expression in order to define a sentence boundary!");
        }
        this._sentenceBoundaries = pattern;
    }

    //Word Boundaries: the regular expression that detects how words are spaced apart
    get wordBoundaries() {
        return this._wordBoundaries;
    }

    set wordBoundaries(pattern) {
        if (pattern instanceof RegExp === false) {
            throw new Error("Must provide a regular expression in order to define a sentence boundary!");
        }
        this._wordBoundaries = pattern;
    }

    //Emoji: an array of regular expressions that denotes 'emoji'
    get emoji() {
        return this._emoji;
    }

    set emoji(arr) {
        //Validate that we have an array of regular expressions for our emoji
        //(To Do: accept an array of regular strings as well)

        if (Array.isArray(arr) === false) {
            throw new Error("Must provide an array of regular expressions to define emoji!");
        }

        for (let i = 0; i < arr.length; i++) {
            if (arr[i] instanceof RegExp === false) {
                throw new Error("Must provide an array of regular expressions to define emoji!");
            }
        }

        //Congrats!  We have a valid emoji array
        this._emoji = arr;
    }

    //CLEAVE
    //Attempts to separate sentences 
    //DEFAULT ASSUMPTION: sentences are terminated by one or more " ' ` . ! ? ) 
    //that are NOT immediately preceeded by a comma
    //Function returns TRUE if operation was able to proceed
    //FALSE if function could not proceed
    cleaveSentences() {
        if (this.level === "word" || this.level === "sentence") {
            return false; //if we are already at a lower level, we can't do this lol
        }
        //(optionally accepts a custom regexp pattern to cleave on)
        const pattern = this.sentenceBoundaries;

        //create a new array that we'll put stuff in
        const newList = [];

        //loop through all nodes
        for (let i = 0; i < this.nodes.length; i++) {
            const currentNode = this.nodes[i];
            if (currentNode.isParagraph()) {
                const str = currentNode.value;
                //first, grab the whitespace so we can preserve it
                const whiteSpace = str.match(pattern);
                //next, split out the sentences
                const sentences = str.split(pattern);
                //now, add them to the new list!
                let index = 0;
                //figure out our max
                const numSentences = (sentences ? sentences.length : 0);
                const numSpaces = (whiteSpace ? whiteSpace.length : 0);
                const max = (numSentences > numSpaces ? numSentences : numSpaces);
                while (index < max) {
                    if (index < numSentences) {
                        newList.push(new Node(sentences[index], "sentence"));
                    }
                    if (index < numSpaces) {
                        newList.push(new Node(whiteSpace[index], "sentence separator"));
                    }
                    index++;
                }
            } else {
                newList.push(currentNode);
            }
        }

        //lastly, we overwrite the old list with our new one
        this.nodes = newList;
        //update the prosemap to indicate it's now broken into sentences
        this.level = "sentence";
        return true;
    }

    //Cuts up an existing ProseMap into even smaller chunks
    //Optionally accepts a custom separator regexp to match on
    cleaveWords() {
        if (this.level !== "sentence") {
            return false; //we can only cleave words when we start from the sentence level!
        }

        //Start an empty array for our word list
        const wordList = [];

        //Using vanilla for loops for performance
        for (let i = 0; i < this.nodes.length; i++) {
            const currentNode = this.nodes[i];
            //If the current node is NOT a sentence, just pop it blithely into the new array and move on
            if (!currentNode.isSentence()) {
                wordList.push(currentNode);
            } else {
                //Otherwise, we have hit a sentence! We're going to grab all its words, separators, and emoji:
                const allWords = this._cleaveWordsFromSentence(currentNode);
                //Now push all these nodes into our wordList:
                for (let j = 0; j < allWords.length; j++) {
                    wordList.push(allWords[j]);
                }
            }
        }

        //Overwrite our internal list with this new one:
        this.nodes = wordList;

        //Set the ProseMap level to "word" now
        this.level = "word";
        return true;
    }

    //ITERATE
    //run a callback function on all the nodes
    forEach(callbackFn) {
        this.nodes.forEach(callbackFn);
    }

    //JOINS
    //Joins the entire list into a single string
    join() {
        return this.nodes.map((node) => node.value).join('');
    }

    //Joins all words / word separators back into sentences
    joinWords() {
        if (this.level !== "word") {
            return false; //can only join from the word level
        }
        const newList = [];
        let sentence = "";
        for (let i = 0; i < this.nodes.length; i++) {
            const currentNode = this.nodes[i];
            if (currentNode.isWord() || currentNode.isWordSeparator()) {
                sentence += currentNode.value;
            } else {
                if ((currentNode.isEmoji() || currentNode.isSentenceSeparator()) && sentence !== "") {
                    //first, push the sentence that we have built
                    newList.push(new Node(sentence, "sentence"));
                    //next, push the separator itself!
                    newList.push(currentNode);
                    sentence = "";
                } else {
                    //otherwise it's a sentence separator or emoji or something - leave as-is
                    newList.push(currentNode);
                }
            }
        }

        //do one final push for the final sentence that could be lingering:
        newList.push(new Node(sentence, "sentence"));
        //switch the new list to be our internal node list...
        this.nodes = newList;
        //and set the level back to sentence
        this.level = "sentence";
        return true;
    }

    //Joins all sentences back into a paragraph (so you can split all over again)
    joinSentences() {
        if (this.level !== "sentence") {
            return false; //can only join from the word level
        }
        const paragraph = this.join();
        this.nodes = [];
        this.nodes.push(new Node(paragraph, "paragraph"));
        this.level = "paragraph"
        return true;
    }

    //INTERNAL HELPERS
    //_cleaveEmoji(wordNode) -
    //Function takes in a word node and flags if it is an emoji
    //Returns true if an emoji was found, false otherwise
    _isEmoji(wordNode) {
        for (let i = 0; i < this._emoji.length; i++) {
            if (this._emoji[i].test(wordNode.value) === true) {
                return true;
            }
        }
        return false;
    }

    //_cleaveWordsFromSentence(sentenceNode) -
    //Function takes in a sentence node and breaks it apart into words, word separators, and emoji
    //Returns an array of the resulting nodes
    _cleaveWordsFromSentence(sentenceNode) {
        //Grab the text of the sentence
        const sentence = sentenceNode.value;
        //Start an empty array for the words
        const wordList = []; 
        //now, grab the whitespace so we can preserve it
        const whiteSpace = sentence.match(this.wordBoundaries);
        //next, split the paragraph into discrete sentences
        const words = sentence.split(this.wordBoundaries);
        //now, all the words to the list
        let index = 0;
        //figure out our max
        const numWords = (words ? words.length : 0);
        const numSpaces = (whiteSpace ? whiteSpace.length : 0);
        const max = (numWords > numSpaces ? numWords : numSpaces);
        //A couple helpers:
        let isFirstWord = true;
        let emojiExist = (this._emoji.length > 0 ? true : false);
        //While we still have whitespace and sentences:
        while (index < max) {
            //Add words and emoji
            if (index < numWords) {
                const newWordNode = new Node(words[index], "word");
                //First, double-check if this "word" is actually an emoji and flag it!
                //(TO-DO) Check performance -- should we suppress this sometimes?
                if (emojiExist && this._isEmoji(newWordNode)) {
                    newWordNode.nodeType = 5; //modify the nodetype ONLY if an emoji was detected!
                } else {
                //Otherwise, if this is not an emoji AND 
                //Next, check if this is the very first word we have found and flag that
                    if (isFirstWord) {
                        newWordNode.isFirstWord = true;
                        isFirstWord = false; //there is only one first word!
                    }
                }
                //Finally, push the completed node to the list
                wordList.push(newWordNode);
            }
            //Add spaces
            if (index < numSpaces) {
                wordList.push(new Node(whiteSpace[index], "word separator"));
            }
            index++;
        }
        return wordList;
    }
}

module.exports = ProseMap;