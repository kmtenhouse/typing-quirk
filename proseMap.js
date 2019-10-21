/* Copyright 2019 @twinarmageddons authors & contributors
/* This software may be modified and distributed under the terms
/* of the ISC License (ISC). See the LICENSE file for details. */

//PROSEMAP
//A better way to separate a paragraph into individual words while preserving all information about whitespace

//Requires the ProseNode class
const Node = require("./proseNode");
//V1.1.0: Switching from LinkedList to arrays for better performance, ability to use array features such as built-in filter and map

class ProseMap {
    //basic map takes in a paragraph and sets that as the only node in the list
    constructor(text = "", level = "paragraph") { //by default our input will contain one node, a paragraph
        this.nodes = [];
        const firstNode = new Node(text, level);
        this.nodes.push(firstNode);
        this.level = level; //ProseMap must be at the same level as the initial node
    }

    //CLEAVE
    //Attempts to separate sentences into the linked list
    //DEFAULT ASSUMPTION: sentences are terminated by one or more " ' ` . ! ? ) 
    //that are NOT immediately preceeded by a comma
    //Function returns TRUE if operation was able to proceed
    //FALSE if function could not proceed
    cleaveSentences(customBoundaries = null) {
        if (this.level === "word" || this.level === "sentence") {
            return false; //if we are already at a lower level, we can't do this lol
        }
        //(optionally accepts a custom regexp pattern to cleave on)
        const pattern = customBoundaries || /(?<=[^\,][\"\'\`\.\!\?\)])\s+/g;

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
                //now, add them to the new linked list!
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

    //Cuts up existing sentences further by finding emoji and treating them as punctuation
    //Emoji nodes are special and should not be treated as separators; they are exempt from modification
    //Function returns TRUE if operation was able to proceed
    //FALSE if function could not proceed
    cleaveEmoji(emoji = [], customWordBoundaries = null) {

        //helper function to detect emoji
        const isEmoji = word => {
            for (let i = 0; i < emoji.length; i++) {
                if (emoji[i].test(word) === true) {
                    return true;
                }
            }
            return false;
        };

        if (emoji.length > 0 && this.level === "sentence") {
            //start by cleaving the whole sentence into words
            this.cleaveWords(customWordBoundaries);
            //now we iterate through the existing list and see if any 'words' should be reclassified as emoji
            //we also have to reclassify any separators (on either side) as sentence boundaries

            let previousNode = null;
            for (let i = 0; i < this.nodes.length; i++) {
                let currentNode = this.nodes[i];
                //if the current node is a word separator, first check if the node immediately preceding is an emoji
                //if so, this is now a sentence separator
                if (currentNode.isWordSeparator()) {
                    if (previousNode !== null && previousNode.isEmoji()) {
                        currentNode.nodeType = 2;
                    }
                }

                //otherwise, check if the current node is a word that is secretly an emoji
                if (currentNode.isWord() && isEmoji(currentNode.value)) {
                    currentNode.nodeType = 5; //flag the current 'word' to be an emoji instead
                    //...and check our previous word to see if it's a separator we should now reclass
                    if (previousNode !== null && previousNode.isWordSeparator()) {
                        previousNode.nodeType = 2;
                    }
                }

                //lastly, update our previous node
                previousNode = currentNode;
            }

            //lastly, we rejoin the words into sentences
            this.joinWords();
            return true;
        }
        return false;
    }

    //Cuts up an existing ProseMap into even smaller chunks
    //Optionally accepts a custom separator regexp to match on
    cleaveWords(customBoundaries = null) {
        if (this.level !== "sentence") {
            return false; //we can only cleave words when we start from the sentence level!
            //TO DO: make the prosemap take in the custom sentence / word boundaries / emoji from the beginning??  So that we CAN cleave to word?
        }
        const wordBoundaries = customBoundaries || /(?<!^)\s/g;
        const wordList = [];

        //Using vanilla for loops for performance
        for (let i = 0; i < this.nodes.length; i++) {
            const currentNode = this.nodes[i];
            //If the current node is NOT a sentence, just pop it blithely into the new array and move on
            if (!currentNode.isSentence()) {
                wordList.push(currentNode);
            } else {
                //Otherwise, we have hit a sentence! We're going to start a brand new linked list for its words.
                const sentence = currentNode.value;
                //first, grab the whitespace so we can preserve it
                const whiteSpace = sentence.match(wordBoundaries);
                //next, split the paragraph into discrete sentences
                const words = sentence.split(wordBoundaries);
                //(TO-DO) if we have a first word, let's flag it by adding a custom flag

                //now, all the words to the list
                let index = 0;
                //figure out our max
                const numWords = (words ? words.length : 0);
                const numSpaces = (whiteSpace ? whiteSpace.length : 0);
                const max = (numWords > numSpaces ? numWords : numSpaces);
                let isFirstWord = true;
                while (index < max) {
                    if (index < numWords) {
                        const newWordNode = new Node(words[index], "word");
                        if (isFirstWord) {
                            newWordNode.isFirstWord = true;
                            isFirstWord = false; //we never use this again
                        }
                        wordList.push(newWordNode);
                    }
                    if (index < numSpaces) {
                        wordList.push(new Node(whiteSpace[index], "word separator"));
                    }
                    index++;
                }
            }
        }

        //Set our internal list to be this new one:
        this.nodes = wordList;

        //Set the level to "word" now
        this.level = "word";
        return true;
    }

    //ITERATE
    //run a callback function on all the nodes
    //(NOTE: may now be deprecated)
    forEach(callbackFn) {
        this.nodes.forEach(callbackFn);
    }

    //JOINS
    //Joins the entire list into a single string
    join() {
        let str = "";
        for (let i = 0; i < this.nodes.length; i++) {
            str += this.nodes[i].value;
        }
        return str;
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
}

module.exports = ProseMap;