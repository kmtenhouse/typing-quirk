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
    cleaveSentences(customBoundaries=null) {
        //(optionally accepts a custom regexp pattern to cleave on)
        const pattern = (customBoundaries ? customBoundaries :  /(?<=[^\,][\"\'\`\.\!\?\)])\s+/g);

        //first, grab the whitespace so we can preserve it
        const whiteSpace = this.original.match(pattern);
        const sentences = this.original.split(pattern);

        //now, add them to the linked list!
        let index = 0;  
        const max = (sentences.length > whiteSpace.length ? sentences.length : whiteSpace.length);
        while(index < max) {
            if(index < sentences.length) {
                this.list.add(sentences[index]);
            }
            if(index < whiteSpace.length) {
                this.list.add(whiteSpace[index]);
            }
            index++;
        }
    }

    cleaveWords() {

    }

    //GET SENTENCES

    //GET WORDS

    //JOIN 
    join() {
        return this.list.join();
    }
}

module.exports = ProseMap;