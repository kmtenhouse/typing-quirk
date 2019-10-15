const expect = require("chai").expect;
const Quirk = require("../../quirk");

const contractionList = [
    "ain't",
    "amn't",
    "aren't",
    "S'e",
    "Ha'ta",
    "can't (rarely, cain't)",
    "cause",
    "could've",
    "couldn't",
    "couldn't've",
    "daren't",
    "daresn't",
    "dasn't",
    "didn't",
    "doesn't",
    "don't",
    "e'er",
    "everyone's",
    "finna",
    "gimme",
    "giv'n",
    "gonna",
    "gon't",
    "gotta",
    "hadn't",
    "hasn't",
    "haven't",
    "he'd",
    "he'll",
    "he's",
    "he've",
    "how'd",
    "howdy",
    "how'll",
    "how're",
    "how's",
    "I'd",
    "I'll",
    "I'm",
    "I'm'a",
    "I'm'o",
    "I've",
    "isn't",
    "it'd",
    "it'll",
    "it's",
    "let's",
    "ma'am",
    "mayn't",
    "may've",
    "mightn't",
    "might've",
    "mustn't",
    "mustn't've",
    "must've",
    "needn't",
    "ne'er",
    "o'clock",
    "o'er",
    "ol'",
    "oughtn't",
    "s",
    "shalln't",
    "shan't",
    "she'd",
    "she'll",
    "she's",
    "should've",
    "shouldn't",
    "shouldn't've",
    "somebody's",
    "someone's",
    "something's",
    "so're",
    "that'll",
    "that're",
    "that's",
    "that'd",
    "there'd",
    "there'll",
    "there're",
    "there's",
    "these're",
    "they'd",
    "they'll",
    "they're",
    "they've",
    "this's",
    "those're",
    "tis",
    "to've",
    "twas",
    "wasn't",
    "we'd",
    "we'd've",
    "we'll",
    "we're",
    "we've",
    "weren't",
    "what'd",
    "what'll",
    "what're",
    "what's",
    "what've",
    "when's",
    "where'd",
    "where're",
    "where's",
    "where've",
    "which's",
    "who'd",
    "who'd've",
    "who'll",
    "whom'st",
    "whom'st'd've'ed",
    "who're",
    "who's",
    "who've",
    "why'd",
    "why're",
    "why's",
    "won't",
    "would've",
    "wouldn't",
    "y'all",
    "y'all'd've",
    "you'd",
    "you'll",
    "you're",
    "you've"
];

describe("removing contractions", function () {
    it("should add emoji to both plain and quirk substitution lists", function () {

    });
});