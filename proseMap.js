/* Copyright 2019 @twinarmageddons authors & contributors
/* This software may be modified and distributed under the terms
/* of the ISC License (ISC). See the LICENSE file for details. */

//PROSEMAP
//A better way to separate a paragraph into individual words while preserving all information about whitespace

//(Requires a basic LinkedList to implement)
const LinkedList = require("./linkedList");

class ProseMap {
    //basic map takes in a paragraph and sets that as the only node in the list
    constructor(text = "", level = "paragraph") { //by default our linked list will contain one node, a paragraph
        this.list = new LinkedList();
        this.list.add(text, level);
        this.level = level; //prose must be at the same level as the initial node
        //(TO-DO): Figure out what to do if people try to make the first node a separator??
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

        //go through our existing linked list first
        const newList = new LinkedList();

        //this is our list of verified emoji
        const verifiedEmoji = [];

        this.forEach(node => {
            if (node.isParagraph()) {
                const str = node.value;
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
                        newList.add(sentences[index], "sentence");
                    }
                    if (index < numSpaces) {
                        newList.add(whiteSpace[index], "sentence separator");
                    }
                    index++;
                }
            } else {
                newList.add(node.value, node.nodeName);
            }
        });

        //lastly, we overwrite the old list with our new one
        this.list = newList;
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
            //start by cleaving the whole sentence into words so we can save some energy
            this.cleaveWords(customWordBoundaries);
            //now we iterate through the existing list and see if any 'words' should be reclassified as emoji
            //we also have to reclassify any separators (on either side) as sentence boundaries
        
            let currentNode = this.list.head;
            let previousNode = null;
            while (currentNode) {
                //if the current node is a word separator, first check if the node immediately preceding is an emoji
                //if so, this is now a sentence separator
                if (currentNode.isWordSeparator()) {
                    if (previousNode!==null && previousNode.isEmoji()) {
                        currentNode.nodeType = 2;
                    }
                }
                //otherwise, check if the current node is a word that is secretly an emoji
                if (currentNode.isWord() && isEmoji(currentNode.value)) {
                    currentNode.nodeType = 5; //set the 'word' to be an emoji instead
                    //...and check our previous to see if it's a separator we should reclass
           
                    if (previousNode!==null && previousNode.isWordSeparator()) {
                        previousNode.nodeType = 2;
                    }
                }
                previousNode = currentNode;
                currentNode = currentNode.next;
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
        if (this.level === "sentence") {
            const wordBoundaries = customBoundaries || /(?<!^)\s/g;
            let currentNode = this.list.head;
            let previousNode = null;
            while (currentNode) {
                //if we have hit a sentence, we're going to start a brand new linked list for its words!
                if (currentNode.isSentence()) {
                    const sentence = currentNode.value; //don't change the original!
                    const wordList = new LinkedList();
                    //first, grab the whitespace so we can preserve it
                    const whiteSpace = sentence.match(wordBoundaries);
                    //next, split the paragraph into discrete sentences
                    const words = sentence.split(wordBoundaries);
                    //now, add them to the linked list!
                    let index = 0;
                    //figure out our max
                    const numWords = (words ? words.length : 0);
                    const numSpaces = (whiteSpace ? whiteSpace.length : 0);
                    const max = (numWords > numSpaces ? numWords : numSpaces);
                    while (index < max) {
                        if (index < numWords) {
                            wordList.add(words[index], "word");
                        }
                        if (index < numSpaces) {
                            wordList.add(whiteSpace[index], "word separator");
                        }
                        index++;
                    }
                    //lastly, we insert this into the existing list!
                    const firstWord = wordList.head;
                    firstWord.isFirstWord = true; //make sure we remember that this is the start of the sentence!
                    const lastWord = wordList.findNode(wordList.length - 1);
                    const nextParagraphNode = currentNode.next;
                    //the current node is now the first word of the sentence...
                    if (previousNode === null) {
                        this.list.head = firstWord;
                    } else {
                        previousNode.next = firstWord;
                    }
                    //...and the final node of that word list hooks back to the paragraph!
                    lastWord.next = nextParagraphNode;
                    // we adjust the size of the list...
                    this.list.size += wordList.length;
                    //and we move right along to the next paragraph segment :)
                    currentNode = nextParagraphNode;
                } else {
                    previousNode = currentNode;
                    currentNode = currentNode.next;
                }
            }
            this.level = "word";
            return true;
        } else {
            return false;
        }
    }

    //ITERATE
    forEach(callbackFn, filters = null) {
        let currentNode = this.list.head;
        let index = 0;
        while (currentNode) {
            if (!filters || filters[currentNode.nodeName] === true) {
                callbackFn(currentNode, index);
            }
            index++;
            currentNode = currentNode.next;
        }
    }

    //JOINS
    //Joins the entire list into a single string
    join() {
        return this.list.join();
    }

    //Joins all words / word separators back into sentences
    joinWords() {
        const newList = new LinkedList();
        let currentNode = this.list.head;
        let sentence = "";
        while (currentNode) {
            if (currentNode.isWord() || currentNode.isWordSeparator()) {
                sentence += currentNode.value;
            } else {
                if (sentence !== "") {
                    newList.add(sentence, "sentence");
                    sentence = "";
                }
                newList.add(currentNode.value, currentNode.nodeName);
            }
            currentNode = currentNode.next;
        }
        //check for one last sentence...
        if (sentence) {
            newList.add(sentence, "sentence");
        }
        this.list = newList;
        this.level = "sentence";
    }

    //Joins all sentences back into a paragraph (so you can split all over again)
    joinSentences() {
        const paragraph = this.list.join();
        this.list = new LinkedList();
        this.list.add(paragraph, "paragraph");
        this.level = "paragraph"
    }
}

module.exports = ProseMap;