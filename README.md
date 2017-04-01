# Accessible Webcomponents

Here are outlines of 3 variations of the combobox theme coded as web components. Styling is minimal or nonexistant, and mouse behavior is mostly nonexistant, however all keyboard and screen reader behavior works with NVDA+Firefox (other screen reader / browser combinations may or may not work).
Clicking the links will take you to demos. Clone the repository or browse to the files on github to see the code.

## Keyboard Navigation

One of the most compelling reasons for writing this code is to address the issue of keyboard navigation.
`Aria` does *not* provide any behavior "out of the box".
This means that all keyboard navigation must be provided by the author.
It is not, IMO, the lack of developer understanding of `aria` that contributes to the poor accessibility of custom widgets,  but lack of or erroneous / not helpful keyboard navigation. 

We attempt to combat this issue with the keyboardNavigation.js plugin provided here.
It will work within shadow DOM (which is how it is used in these components) as well as in light DOM.
It can currently handle listbox and tree widgets, and can handle both standalone or embedded scenareos.
Future work plans to enable menu navigation as well.

## Component Demos

- [multiselect](http://RichCaloggero.github.io/webcomponents/multiselect/demo.html)
- [autocomplete](http://RichCaloggero.github.io/webcomponents/autocomplete/demo.html)
- [tree](http://RichCaloggero.github.io/webcomponents/tree/demo.html)

These all use the aria combobox role as prescribed by aria-1.1. As such, they may not perform well in all browser / screen reader combinations.  They were written and tested with NVDA+Firefox, and thus should be evaluated using same.

See the following for a thurough description of the combobox role and current screen reader support:
http://www.ssbbartgroup.com/blog/differences-aria-1-0-1-1-changes-rolecombobox/



