//PROSEMAP
//A better way to separate a paragraph into individual words while preserving all information about whitespace

//(Requires a basic LinkedList to implement)
const LinkedList = require("./linkedList");

class ProseMap {
    //basic map takes in a paragraph and attempts to separate it 
    //
    constructor(paragraph = "") {
        this.list = new LinkedList();
        this.list.add(paragraph, "paragraph"); //by default our linked list will contain one node, a paragraph
        this.level = "paragraph"; //prose must be at the same level
    }

    //CLEAVE
    //Attempts to separate sentences into the linked list
    //DEFAULT ASSUMPTION: sentences are terminated by one or more " ' ` . ! ? ) 
    //that are NOT immediately preceeded by a comma
    cleaveSentences(customBoundaries = null) {
        //(optionally accepts a custom regexp pattern to cleave on)
        const pattern = customBoundaries || /(?<=[^\,][\"\'\`\.\!\?\)])\s+/g;

        //go through our existing linked list first
        const newList = new LinkedList();

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
    }

    //Cuts up an existing ProseMap into even smaller chunks
    //Optionally accepts a custom separator regexp to match on
    cleaveWords(customBoundaries = null) {
        //if we are at the paragraph level, start by cleaving the sentences!
        if (this.level === "paragraph") {
            this.cleaveSentences();
        }

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