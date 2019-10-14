//Node class
class Node {
    constructor(value, nodeType) {
        this.value = value;
        this.next = null;
        this.isFirstWord = false; 
        //set the node type based on a human readable map
        switch (nodeType) {
            case "sentence": this.nodeType = 0;
                break;
            case "sentence separator": this.nodeType = 1;
                break;
            case "word": this.nodeType = 2;
                break;
            case "word separator": this.nodeType = 3;
                break;
            default: this.nodeType = -1;
                break;
        }
    }

    //GETTERS AND SETTERS

    //nodeName -- returns a human readable string about what a node contains
    get nodeName() {
        let result;
        switch (this.nodeType) {
            case 0: result = "sentence";
                break;
            case 1: result = "sentence separator";
                break;
            case 2: result = "word";
                break;
            case 3: result = "word separator";
                break;
            default: result = "null";
                break;
        }
        return result;
    }

    //HELPER FUNCTIONS
    isSeparator() { 
        //returns true if the node is a separator
        return (this.nodeType===1 || this.nodeType===3);
    }

    isSentence() {
        //returns true if the node is a sentence
        return this.nodeType===0;
    }

    isWord() {
        return this.nodeType===2;
    }
}

//LinkedList
class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
        this.next = null;
    }

    // Add a new node to the list
    add(element, nodeType = null) {
        let newNode = new Node(element, nodeType);
        let currentNode;
        if (this.head === null) {
            this.head = newNode;
        } else {
            currentNode = this.head;
            while (currentNode.next) {
                currentNode = currentNode.next;
            }
            currentNode.next = newNode;
        }
        this.size++;
    }

    // Insert a new node at a certain position in the list
    insertAt(index, element, nodeType = null) {
        //Returns FALSE on a failed insertion
        //Returns TRUE on a successfull insertion
        if (index > this.size - 1 || index < 0) {
            return false; //don't insert if the index is nonsense
        }
        //create a new node
        let newNode = new Node(element, nodeType);

        if (index === 0) { //special case: inserting at head
            newNode.next = this.head;
            this.head = newNode;
        } else { //otherwise we have to find the right place in the chain to insert!
            let currentNode = this.head;
            let previousNode = null;
            let currentIndex = 0;
            while (currentIndex < index) {
                previousNode = currentNode;
                currentNode = currentNode.next;
                currentIndex++;
            }
            //the new node is going to be AT the index we provided, so:
            newNode.next = currentNode;
            previousNode.next = newNode;
        }
        this.size++;
        return true;
    }

    //deletes a node at a particular location
    removeFrom(index) {
        //Returns FALSE on a failed deletion
        //Returns TRUE on a successfull deletion
        if (index > this.size - 1 || index < 0) {
            return false; //don't delete if the index is nonsense
        }

        if (index === 0) { //special case: removing from head
            let newHead = this.head.next;
            this.head = newHead;
        } else { //otherwise we have to find the right place in the chain to renove!
            let currentNode = this.head;
            let previousNode = null;
            let currentIndex = 0;
            while (currentIndex < index) {
                previousNode = currentNode;
                currentNode = currentNode.next;
                currentIndex++;
            }
            //we are removing FROM the index we provided, so:
            previousNode.next = currentNode.next;
        }
        this.size--;
        return true;
    }

    //Get the node at a particular index
    findNode(index) {
        if (index > this.size - 1 || index < 0) {
            return null; //-1 is not found
        }
        let currentIndex = 0;
        let currentNode = this.head;
        while (currentIndex < index) {
            currentNode = currentNode.next;
            currentIndex++;
        }
        return currentNode;
    }

    // Helper Methods 
    //GETTER for the length
    get length() {
        return this.size;
    }

    //Quick test if the list is empty
    isEmpty() {
        return (this.length > 0 ? false : true);
    }

    //Returns a stringified version of the entire list
    //(if there's nothing in the list, will return an empty string)
    join() {
        if (this.isEmpty()) {
            return "";
        }
        //otherwise, join together the value for all the nodes
        let currentNode = this.head;
        let str = "";
        do {
            str += currentNode.value;
            currentNode = currentNode.next;
        } while (currentNode);
        return str;
    }

}

module.exports = LinkedList;