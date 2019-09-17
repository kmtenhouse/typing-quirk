# typing-quirk
A package for encoding and decoding typing quirks.

## Overview
Fantasy writers, science fiction fans, and comic book geeks have often found themselves in need of systematic text replacement. Maybe you wrote a robot character who wraps every sentence in a command ```echo "like this"```. Maybe you're roleplaying a punny sea captain who swaps in the word 'sea' for 'see'. The online comic [Homestuck](https://www.homestuck.com/ "External Link: Homestuck Comic") in particular popularized these 'typing quirks' in an epic 8000+ page story with more than 30 unique styles.

This package attempts to help readers and writers more easily manage their text changing needs by creating rulesets for each quirk. It allows for easy encoding plain text into a quirk, and attempts to decode 'quirkified' text into more standard English. 

## How to Use
```
const Quirk = require("quirk");
let example = new Quirk();
example.addSubstitution("U", "u");
example.enforceQuirkCase("uppercase", {exceptions: "u"});
let quirkifiedText = example.toQuirk("You have to check this out!");
// Output: 'YOu HAVE TO CHECK THIS OuT!'
let plainText = example.toPlain("YOu HAVE TO CHECK THIS OuT!");
// Output: 'YOu HAVE TO CHECK THIS OuT!'
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
This collection of methods creates rules that can be applied to text.


<a href="add-prefix"></a>

### addPrefix




<a href="add-suffix"></a>

### addSuffix

<a href="add-separator"></a>
<a href="add-substitution"></a>
<a href="enforce-case"></a>

<hr />
<a href="conversion"></a>

## Text Conversion Methods

<a href="to-quirk"></a>
<a href="to-plain"></a>

## How to Install
* Typing quirks is currently in pre-release, but the current project can be tested and used by forking this repository and cloning it to your local machine.