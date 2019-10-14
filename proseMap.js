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
    cleaveParagraph() {
        const boundaries = "\"'`.!?)";
        for(let i = 0; i < this.original.length; i++) {
            
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