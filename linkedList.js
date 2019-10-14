//Node class
class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

//LinkedList
class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
        this.next = null;
    }

    // functions to be implemented 
    add(element) {
        let newNode = new Node(element);
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

    insertAt(index, element) {
        //Returns FALSE on a failed insertion
        //Returns TRUE on a successfull insertion
        if (index > this.size - 1 || index < 0) {
            return false; //don't insert if the index is nonsense
        }
        //create a new node
        let newNode = new Node(element);

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

    removeFrom(index) { //deletes a node at a particular location
        //Returns FALSE on a failed insertion
        //Returns TRUE on a successfull insertion
        if (index > this.size - 1 || index < 0) {
            return false; //don't insert if the index is nonsense
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