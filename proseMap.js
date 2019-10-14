//PROSEMAP
//A better way to separate a paragraph into individual words while preserving all information about whitespace

//(Requires a basic LinkedList to implement)
const LinkedList = require("./linkedList");

class ProseMap {
    //basic map takes in a paragraph and attempts to separate it 
    //
    constructor(paragraph) {
        this.list = new LinkedList();
        this.original = paragraph || "";
    }

    //CLEAVE
    //Attempts to separate sentences into the linked list
    //DEFAULT ASSUMPTION: sentences are terminated by one or more " ' ` . ! ? ) 
    //that are NOT immediately preceeded by a comma
    cleaveSentences(customBoundaries = null) {
        //(optionally accepts a custom regexp pattern to cleave on)
        const pattern = (customBoundaries ? customBoundaries : /(?<=[^\,][\"\'\`\.\!\?\)])\s+/g);

        //first, grab the whitespace so we can preserve it
        const whiteSpace = this.original.match(pattern);
        //next, split out the sentences
        const sentences = this.original.split(pattern);

        //now, add them to the linked list!
        let index = 0;
        const max = (sentences.length > whiteSpace.length ? sentences.length : whiteSpace.length);
        while (index < max) {
            if (index < sentences.length) {
                this.list.add(sentences[index], "sentence");
            }
            if (index < whiteSpace.length) {
                this.list.add(whiteSpace[index], "sentence separator");
            }
            index++;
        }
    }

    //Cuts up an existing ProseMap into even smaller chunks
    //Optionally accepts a custom separator regexp to match on
    cleaveWords(customSeparator = null) {
        const wordBoundaries = customSeparator || /(?<!^)\s/g;
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
                const max = (words.length > whiteSpace.length ? words.length : whiteSpace.length);
                while (index < max) {
                    if (index < words.length) {
                        wordList.add(words[index], "word");
                    }
                    if (index < whiteSpace.length) {
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
    }

    //ITERATE
    forEach(callbackFn) {
        let currentNode = this.list.head;
        let index = 0;
        while (currentNode) {
            callbackFn(currentNode, index);
            index++;
            currentNode = currentNode.next;
        }
    }

    //JOINS

    //Joins the entire list as one
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
                if (sentence!=="") {
                    newList.add(sentence, "sentence");
                    sentence = "";
                }
                newList.add(currentNode.value, currentNode.nodeName);
            }
            currentNode = currentNode.next;
        }
        this.list = newList;
    }
}

module.exports = ProseMap;