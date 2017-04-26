(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var idGen = require ("../util/idGen");

var template = document.querySelector("#autocomplete-template");
var searchText = "";
var filterText = "";

customElements.define ("x-autocomplete", class extends HTMLElement {
constructor () {
super ();
} // constructor

connectedCallback () {
var self = this;
customElements.whenDefined("select-list").then (function () {
this.init();
this.render();
}.bind(this)); // when defined
} // connectedCallback

init () {
this.initOptions();

this._filterText = "";
this._root = this.createRootElement();
this._control = this._root.querySelector('.autocomplete');
this._typeahead = this._root.querySelector('.typeahead');
this._labelText = this._root.querySelector('label .text');
this._popup = this._root.querySelector('.autocomplete-popup');
this._list = this._root.querySelector('.autocomplete-list');
this._status = this._root.querySelector('.status');

if (this._options.activedescendant) {
this._activedescendant = idGen("autocomplete-activedescendant-");
this._list.setAttribute ("activedescendant", this._activedescendant);
} // if

this._labelText.textContent = this._options.label;
this._status.classList.toggle ("screen-reader-only", !this._options.showStatusMessages);

} // init

initOptions () {
this._options = {
activedescendant: this.hasAttribute("activedescendant"),
label: this.getAttribute("label") || "",
showStatusMessages: this.getAttribute("showStatusMessages")
}; // options
} // initOptions

createRootElement () {
var root = this.attachShadow({delegatesFocus: true, mode: "open"});
var content = template.content.cloneNode(true);

/*if (window.ShadowDOMPolyfill) {
WebComponents.ShadowCSS.shimStyling(content, 'x-autocomplete');
}
*/

root.appendChild(content);

return root;
} // createRootElement

render () {
this.attachHandlers();

} // render

attachHandlers () {
var self = this;
this._typeahead.addEventListener ("keydown", this.handleOpenOnDownArrow.bind(this));
this._typeahead.addEventListener ("input", this.handleListFilter.bind(this));

this._list.addEventListener ("accept", this.accept.bind(this));
this._list.addEventListener ("cancel", this.cancel.bind(this));
this._list.addEventListener("click", this.accept.bind(this));
if (this._options.activedescendant) this._list.addEventListener ("activedescendant", (e => this.updateActivedescendant.call(this, e.target)));

} // attachHandlers

handleOpenOnDownArrow (e) {
if (e.key === "ArrowDown") {
this.open ();

if (this._options.activedescendant) {
this.control.setAttribute ("aria-activedescendant", this._activedescendant);
} else {
this._list.currentItem().focus();
} // if

e.preventDefault();
e.stopPropagation();
e.stopImmediatePropagation();
return false;
} // if

return true;
} // handleOpenOnDownArrow


handleListFilter (e) {
//console.log("filter: ", e);
this.open();
this.filterList (this._typeahead.value);
} // handleListFilter

filterList (text) {
this.restoreList ();

if (text) {
text = text.toLowerCase().trim();
//debug ("filter: ", text);
this.allElements().forEach (function (element) {
var elementText = element.textContent.toLowerCase().trim();
//debug ("- ", elementText.startsWith(text), elementText);
if (!elementText.startsWith(text)) element.setAttribute ("hidden", "true");
}); // forEach
} // if

this.displayItemCount ();
} // filterList 

restoreList () {
this.allElements().forEach (function (element) {
element.removeAttribute ("hidden");
}); // forEach
} // restoreList


accept() {
this._typeahead.value = this.value();
this.close ();
return true;
} // accept

cancel () {
this.close();
this._typeahead.value = "";
this.restoreList ();
//this.blur();
return true;
} // cancel

updateActivedescendant (node) {
this._control.setAttribute ("aria-activedescendant", node.getAttribute("id"));
} // updateActivedescendant


/// elements and items

value () {
return this._list.value ();
} // value

valueOf (node) {
if (! node) return "";
//alert (node.textContent);
return (node.hasAttribute("value"))?
node.getAttribute("value") : node.textContent;
} // valueOf

selectedElements () {
return Array.from(this.querySelectorAll("[selected]"));
} // selectedElements

allElements () {
return Array.from(this.querySelectorAll("[role=option]"));
} // allElements

selectAll () {
this.allElements().forEach (e => this.selectItem(e));
} // selectAll

unselectAll () {
this.allElements().forEach (e => this.unselectItem(e));
} // unselectAll


fireChangeEvent () {
var event = new CustomEvent("change");
this.dispatchEvent(event);
};



itemElements (selector) {
selector = selector || "li:not([hidden])";
return Array.from(this.querySelectorAll(selector));
}; // itemElements


attributeChangedCallback (optionName, oldValue, newValue) {
this._options[optionName] = newValue;
};

open () {
this.togglePopup(true);
} // open

close () {
this.togglePopup(false);

if (this._options.activedescendant) {
this._control.removeAttribute ("aria-activedescendant");
} else {
this._typeahead.focus();
} // if

this._control.removeAttribute ("aria-controls");
} // close

togglePopup (show) {
this._isOpened = show;
this._popup.style.display = show ? 'block' : 'none';
this._control.setAttribute("aria-expanded", show? "true" : "false");
} // togglePopup


displayItemCount (text) {
this.statusMessage (this.itemElements().length + " " + (text || "items"));
} // displayItemCount

statusMessage (text) {
this._status.textContent = text;
} // statusMessage

}); // custom element


alert	 ("autocomplete component loaded");


},{"../util/idGen":2}],2:[function(require,module,exports){
module.exports = idGen;
function idGen (stem) {
return stem + positiveIntegers.next().value;
} // idGen

var positiveIntegers = positiveIntegerGenerator ();
function* positiveIntegerGenerator () {
let n = 0;
while (true) yield ++n;
} // positiveIntegerGenerator 

},{}]},{},[1]);
