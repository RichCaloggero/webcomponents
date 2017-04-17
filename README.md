# Accessible Webcomponents

Here are outlines of 3 variations of the combobox theme coded as web components. Styling is minimal or nonexistant, and mouse behavior is mostly nonexistant, however all keyboard and screen reader behavior works with NVDA+Firefox (other screen reader / browser combinations may or may not work).

The directories multiselect, autocomplete, and tree are standalone components.
The select-list directory shows how one may nest components: reimplementing autocomplete and multiselect using a nested "select-list" component.
This approach is cleaner and produces more readable code.

These all use the aria combobox role as detailed in aria-1.1. As such, they may not perform well in all browser / screen reader combinations.  They were written and tested with NVDA+Firefox, and thus should be evaluated using same.

See the following for a thurough description of the combobox role, differences between `aria-1.0` and `aria-1.1` implementation, and current screen reader support:
http://www.ssbbartgroup.com/blog/differences-aria-1-0-1-1-changes-rolecombobox/

## Keyboard navigation

Keyboard navigation is supported in two ways:
- the operations specific for each widget are supported in the component's class definition itself
- standard navigation (i.e. in sub-components such as lists, trees, and menus) are implemented via a separate plugin which you can find within this repo, or in its own repo:
http://github.com/RichCaloggero/keyboard-navigation.git

## Label

The label directory contains the outline of a generic label component which can add group labels to elements in a similar way as the HTML label element -- simply wrap the item you wish to label and the label text in the "x-label" custom element.

## Demos

Clicking the links will take you to demos. Clone the repository or browse to the files on github to see the code.

### Standalone components

- [multiselect](http://RichCaloggero.github.io/webcomponents/multiselect/demo.html)
- [autocomplete](http://RichCaloggero.github.io/webcomponents/autocomplete/demo.html)
- [tree](http://RichCaloggero.github.io/webcomponents/tree/demo.html)

### Nested

- [simple select list](https://richcaloggero.github.io/webcomponents/select-list/demo.html)
- [autocomplete based on select-list](https://richcaloggero.github.io/webcomponents/select-list/autocomplete-demo.html)

### Label

- [x-label](https://richcaloggero.github.io/webcomponents/label/demo.html)




