const LinkedList = require("../../linkedList");
const expect = require("chai").expect;

describe("linked list", function () {
    it("should make a new empty list", function () {
        let testList = new LinkedList();
        expect(testList.length).to.equal(0);
        expect(testList.join()).to.equal("");
    });

    it("should add items to the list", function () {
        let testList = new LinkedList();
        testList.add("one");
        testList.add("two");
        expect(testList.length).to.equal(2);
        expect(testList.join()).to.equal("onetwo");
    });

    it("should return the appropriate human readable node names", function () {
        let testList = new LinkedList();
        testList.add("One two three!", "sentence"); //1
        testList.add(" ", "sentence separator"); //2
        testList.add("And four five six. "); //3
        testList.add("A", "word"); //4
        testList.add(" ", "word separator"); //5
        testList.add("test", "word"); //4
        const sNode = testList.findNode(0);
        const sepNode = testList.findNode(1);
        const nonsense = testList.findNode(2);
        const wordNode = testList.findNode(3);
        const wordSepNode = testList.findNode(4);
        expect(sNode.nodeName).to.equal("sentence");
        expect(sNode.nodeType).to.equal(1);
        expect(sNode.isSeparator()).to.be.false;
        expect(sNode.isSentence()).to.be.true;
        expect(sNode.isWord()).to.be.false;
        expect(sepNode.nodeName).to.equal("sentence separator");
        expect(sepNode.nodeType).to.equal(2);
        expect(sepNode.isSentence()).to.be.false;
        expect(sepNode.isWord()).to.be.false;
        expect(sepNode.isSeparator()).to.be.true;
        expect(nonsense.nodeName).to.equal("null");
        expect(nonsense.isSentence()).to.be.false;
        expect(nonsense.isWord()).to.be.false;
        expect(nonsense.isSeparator()).to.be.false;
        expect(nonsense.nodeType).to.equal(-1);
        expect(wordNode.nodeName).to.equal("word");
        expect(wordNode.isSentence()).to.be.false;
        expect(wordNode.isWord()).to.be.true;
        expect(wordNode.isSeparator()).to.be.false;
        expect(wordNode.nodeType).to.equal(3);
        expect(wordSepNode.nodeName).to.equal("word separator");
        expect(wordSepNode.isSentence()).to.be.false;
        expect(wordSepNode.isWord()).to.be.false;
        expect(wordSepNode.isSeparator()).to.be.true;
        expect(wordSepNode.nodeType).to.equal(4);
        expect(testList.join()).to.equal("One two three! And four five six. A test");
    });

    it("should find items on the list by index", function () {
        let testList = new LinkedList();
        testList.add("zero");
        testList.add("one");
        testList.add("two");
        const zero = testList.findNode(0);
        const one = testList.findNode(1);
        const two = testList.findNode(2);
        const nonsense = testList.findNode(3);
        const moreNonsense = testList.findNode(-3);
        expect(testList.length).to.equal(3);
        expect(zero.value).to.equal("zero");
        expect(one.value).to.equal("one");
        expect(two.value).to.equal("two");
        expect(nonsense).to.equal(null);
        expect(moreNonsense).to.equal(null);
    });

    it("should add items at the head when specified", function () {
        let testList = new LinkedList();
        testList.add("one");
        testList.add("two");
        testList.insertAt(0, "zero");
        expect(testList.length).to.equal(3);
        expect(testList.join()).to.equal("zeroonetwo");
    });

    it("should add items in the middle when specified", function () {
        let testList = new LinkedList();
        testList.add("zero");
        testList.add("two");
        testList.insertAt(1, "one");
        expect(testList.length).to.equal(3);
        expect(testList.join()).to.equal("zeroonetwo");
    });

    it("should remove items from the list when removing from the head", function () {
        let testList = new LinkedList();
        testList.add("one");
        testList.add("two");
        testList.removeFrom(0);
        expect(testList.length).to.equal(1);
        expect(testList.join()).to.equal("two");
    });

    it("should remove items from the list when removing from the end", function () {
        let testList = new LinkedList();
        testList.add("one");
        testList.add("two");
        testList.removeFrom(1);
        expect(testList.length).to.equal(1);
        expect(testList.join()).to.equal("one");
    });

    it("should not remove anything when given an invalid index", function () {
        let testList = new LinkedList();
        testList.add("one");
        testList.add("two");
        testList.removeFrom(3);
        testList.removeFrom(-1);
        expect(testList.length).to.equal(2);
        expect(testList.join()).to.equal("onetwo");
    });

});
