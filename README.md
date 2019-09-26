# typing-quirk
A package for encoding and decoding typing quirks.

## Overview
Fantasy writers, science fiction fans, and comic book geeks have often found themselves in need of systematic text replacement. Maybe you wrote a robot character who wraps every sentence in a command ```echo "like this"```. Maybe you're roleplaying a punny sea captain who swaps in the word 'sea' for 'see'. The online comic [Homestuck](https://www.homestuck.com/ "External Link: Homestuck Comic") in particular popularized these 'typing quirks' in an epic 8000+ page story with more than 30 unique styles.

This package attempts to help readers and writers more easily manage their text changing needs by creating rulesets for each quirk. It allows for easy encoding plain text into a quirk, and attempts to decode 'quirkified' text into more standard English. 

## How to Use
```
const Quirk = require("quirk");
let example = new Quirk();
example.setPrefix(">>");
example.setSuffix("<<");
example.addSubstitution("i", "ii", {ignoreCase: true});
example.addSubstitution("s", "2");
example.setSentenceCase("lowercase");

console.log(example.toQuirk("Check this stuff out! It even works for multiple sentences."));
//Outputs: >>check thii2 2tuff out!<< >>iit even work2 for multiiple 2entence2.<<

console.log(example.toPlain(">>check thii2 2tuff out!<< >>iit even work2 for multiiple 2entence2.<<"));
//Outputs: Check this stuff out! It even works for multiple sentences.
```

Quirks are defined by invoking a new instance of the Quirk class and invoking its methods to configure a quirk's ruleset. Once configured, the quirk can be applied via the toQuirk() method. Quirkified text can be converted via the toPlain() method.

## Table of Contents
1. [ Quirk Ruleset Methods ](#ruleset)
    * [ setPrefix ](#set-prefix)
    * [ setSuffix ](#set-suffix)
    * [ setSeparator ](#set-separator)
    * [ addSubstitution ](#set-substitution)
    * [ setSentenceCase ](#set-sentence-case)

2. [ Text Conversion Methods ](#conversion)
    * [ toQuirk ](#to-quirk)
    * [ toPlain ](#to-plain)

<a href="ruleset"></a>

<hr />

## Quirk Ruleset Methods
This collection of methods creates rules that define a typing quirk. 

<hr />

<a href="set-prefix"></a>

### setPrefix(prefix, _optional_ patternToMatch)

Adds a set prefix to the beginning of every sentence. 

Parameters:
* ```prefix```: (String) A string to prepend at the start of every sentence.
* ```patternToMatch``` _(Optional)_: (RegExp object) Pattern to match when identifying prefixes. (Useful when parsing existing text that may have typos.)

<hr />
<a href="set-suffix"></a>

### setSuffix(suffix, _optional_ patternToMatch)

Adds a set suffix at the end of every sentence. 

Parameters:
* ```suffix```: (String) A string to append at the end of every sentence.
* ```patternToMatch``` _(Optional)_: (RegExp object) Pattern to match when identifying prefixes. (Useful when parsing existing text that may have typos.)

<hr />
<a href="set-separator"></a>

### setSeparator(separator)

Adds a custom string to separate the words of a sentence instead of spaces (the default). Every space (including spaces within tabs) will be replaced by this string.

Parameters:
* ```separator```: (String) A string that will replace all existing whitespace within a sentence

<hr />
<a href="set-substitution"></a>

### addSubstitution(plain, quirk, _optional_ options)

Adds a regular substitution that consistently swaps one set of characters for another. 

Parameters:
* ```plain```: (Can be EITHER a string OR an object) The character(s) to search for in plain English sentences
* ```quirk```: (Can be EITHER a string OR an object) What to replace the plain text with in quirkified sentences
* ```options```: _(Optional)_ An object that contains options, set as key: value pairs
    * ```ignoreCase```: (Boolean) If set to 'true', the substitution will work for any plain text that matches the pattern, regardless of capitalization


Note:
To allow developers maximum control, custom regular expressions can be passed in via objects of the following form:
```
{ 
    patternToMatch: /regularexpression/gi
    replaceWith: 'the string to swap in for any matches'
}
```

**Examples:**

_Creating a simple substitution_
```
const Quirk = require("./quirk");
let taz = new Quirk();
taz.addSubstitution('t', '+');
console.log(taz.toQuirk("All these t's are now plus signs."));
//outputs: All +hese +'s are now plus signs.
```

_Creating a substitution that matches both i and I in the original text_
```
const Quirk = require("quirk");
let example = new Quirk();
example.addSubstitution("e", "3",{ignoreCase: true});
console.log(example.toQuirk("NICE!  I am getting the hang of this :)")); 
//outputs: NIC3!  I am g3tting th3 hang of this :)

```

_Using substitution objects for fine control_
```
const Quirk = require("quirk");
let eridan = new Quirk();
eridan.addSubstitution(
    {
        patternToMatch: /in\b/g,
        replaceWith: "ing"
    },
    {
        patternToMatch: /ing\b/g,
        replaceWith: "in"
    }
);
console.log(eridan.toQuirk("trying out automatic clipping"));
//outputs: tryin out automatic clippin

```

<hr />
<a href="set-sentence-case"></a>

### setSentenceCase(caseType, _optional_ options)
Enforces a specific case upon quirkified sentences. This will OVERRIDE the case of the original input. 

Parameters:
* ```caseType```: (String) Specifies the case to convert strings to.
    * ```uppercase```: Output will be all UPPERCASE.
    * ```lowercase```: Output will be all lowercase.
    * ```propercase```: Output will be lowercase sentences, beginning with capital letters. Personal pronouns (I, I'm) are capitalized.
* ```options``` _(optional)_: (Object) Contains options, passed as key-value pairs
    * ```exceptions```: (String) A string containing all the individual characters that should not be affected by case enforcement

<hr />
<a href="conversion"></a>

## Text Conversion Methods

These methods convert strings to their 'quirked' versions and 'plain' versions.

<hr />
<a href="to-quirk"></a>

### toQuirk(textToConvert) 
Takes in a string and returns a quirkified version, based on the current ruleset provided.

Parameters:
* ```textToConvert``` (String) A string of plain English text

Returns: 
* A string containing a 'quirkified' version of the input

<hr />
<a href="to-plain"></a>

### toPlain(textToConvert) 
Takes in a quirkified string and returns a plain English version, based on the current ruleset provided. "Plain English" will attempt to separate sentences by standard English punctuation and capitalize the first word of every sentence. It will also capitalize first person pronouns (I, I'm).

Parameters:
* ```textToConvert``` (String) A quirkified string 

Returns: 
* A string containing a plain version of the input


<hr />

## How to Install
* Typing quirks is currently in pre-release, but the current project can be tested and used by forking this repository and cloning it to your local machine.