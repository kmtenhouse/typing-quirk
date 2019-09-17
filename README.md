# typing-quirk
A package for encoding and decoding typing quirks.

## Overview
Fantasy writers, science fiction fans, and comic book geeks have often found themselves in need of systematic text replacement. Maybe you wrote a robot character who wraps every sentence in a command ```echo "like this"```. Maybe you're roleplaying a punny sea captain who swaps in the word 'sea' for 'see'. The online comic [Homestuck](https://www.homestuck.com/ "External Link: Homestuck Comic") in particular popularized these 'typing quirks' in an epic 8000+ page story with more than 30 unique styles.

This package attempts to help readers and writers more easily manage their text changing needs by creating rulesets for each quirk. It allows for easy encoding plain text into a quirk, and attempts to decode 'quirkified' text into more standard English. 

## How to Use
```
const Quirk = require("quirk");
let example = new Quirk();
example.addPrefix("::");
example.addSuffix("::");
example.addSubstitution("i", "ii", {ignoreCase: true});
example.addSubstitution("s", "2");
example.enforceQuirkCase("lowercase");

console.log(example.toQuirk("Check this stuff out! It even works for multiple sentences."));
//Outputs: ::check thii2 2tuff out!:: ::iit even work2 for multiiple 2entence2.::

console.log(example.toPlain("::check thii2 2tuff out!:: ::iit even work2 for multiiple 2entence2.::"));
//Outputs: Check this stuff out! It even works for multiple sentences.
```

Quirks are defined by invoking a new instance of the Quirk class and invoking its methods to configure a quirk's ruleset. Once configured, the quirk can be applied via the toQuirk() method. Quirkified text can be converted via the toPlain() method.

## Table of Contents
1. [ Quirk Ruleset Methods ](#ruleset)
    * [ addPrefix ](#add-prefix)
    * [ addSuffix ](#add-suffix)
    * [ addSeparator ](#add-separator)
    * [ addSubstitution ](#add-substitution)
    * [ enforceCase ](#enforce-case)

2. [ Text Conversion Methods ](#conversion)
    * [ toQuirk ](#to-quirk)
    * [ toPlain ](#to-plain)

<a href="ruleset"></a>

<hr />

## Quirk Ruleset Methods
This collection of methods creates rules that define a typing quirk. 

<hr />

<a href="add-prefix"></a>

### addPrefix(prefix, _optional_ patternToMatch)

Adds a set prefix to the beginning of every sentence. 

* ```prefix```: (String) A string to prepend at the start of every sentence.
* ```patternToMatch``` _(Optional)_: (RegExp object) Pattern to match when identifying prefixes. (Useful when parsing existing text that may have typos.)

<hr />
<a href="add-suffix"></a>

### addSuffix(suffix, _optional_ patternToMatch)

Adds a set suffix at the end of every sentence. 

* ```suffix```: (String) A string to append at the end of every sentence.
* ```patternToMatch``` _(Optional)_: (RegExp object) Pattern to match when identifying prefixes. (Useful when parsing existing text that may have typos.)

<hr />
<a href="add-separator"></a>

### addSeparator(separator)

Adds a custom string to separate the words of a sentence instead of spaces (the default). Every space (including tabs) will be replaced by this string.

* ```separator```: (String) A string that will replace existing whitespace within a sentence

<hr />
<a href="add-substitution"></a>

<hr />
<a href="enforce-case"></a>

<hr />
<a href="conversion"></a>

## Text Conversion Methods

These methods convert

<hr />
<a href="to-quirk"></a>

<hr />
<a href="to-plain"></a>

## How to Install
* Typing quirks is currently in pre-release, but the current project can be tested and used by forking this repository and cloning it to your local machine.