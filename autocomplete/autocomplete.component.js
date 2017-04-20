(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var keyboardNavigation = require ("../util/keyboardNavigation");

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

this._labelText.textContent = this._options.label;
this._status.classList.toggle ("screen-reader-only", !this._options.showStatusMessages);

} // init

initOptions () {
this._options = {
label: this.getAttribute("label") || '',
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

} // attachHandlers

handleOpenOnDownArrow (e) {
if (e.key === "ArrowDown") {
this.open ();
this._list.currentItem().focus();
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
this._typeahead.focus();
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


//alert	 ("autocomplete component loaded");


},{"../util/keyboardNavigation":3}],2:[function(require,module,exports){
"use strict";
/// DOM traversal

module.exports.nextSibling = nextSibling;
function nextSibling (node, selector = "*") {
selector = selector.trim();
while (node) {
node = node.nextSibling;
if (node && node.nodeType === 1 && node.matches(selector)) return node;
} // while
return null;
} // nextSibling

module.exports.previousSibling = previousSibling;
function previousSibling (node, selector = "*") {
selector = selector.trim();
//alert ("previousSibling: selector is " + selector);
while (node) {
node = node.previousSibling;
if (node && node.nodeType === 1 && node.matches(selector)) return node;
} // while
return null;
} // previousSibling

module.exports.firstChild = firstChild;
function firstChild (node) {
if (! node) return null;
node = node.firstChild;
if (! node) return null;
if (node.nodeType === 1) return node;
else return nextSibling(node);
} // firstChild

module.exports.lastChild = lastChild;
function lastChild (node) {
if (! node) return null;
node = node.lastChild;
if (! node) return null;
if (node && node.nodeType === 1) return node;
else return previousSibling(node);
} // firstChild

module.exports.nodeName = nodeName;
function nodeName (node) {
if (! node) return "";
if (! node.nodeName) {
throw Error ("bad node: " + JSON.stringify(node));
} // if
return node.nodeName.toLowerCase();
} // nodeName

module.exports.indexOf = indexOf;
function indexOf (node) {
var s, p = node.parentNode;
if (! node) return -1;
if (! p) return -1;
s = firstChild(p);
var i = 0;

while (s && s !== node) {
s = nextSibling(s);
i += 1;
} // while

return (s)? i : -1;
} // indexOf

module.exports.getAllNodes = getAllNodes;
function getAllNodes (nodes, selector = "*") {
selector = selector.trim();
return flatten (nodes)
.filter (node => node.matches(selector));

function flatten (node) {
if (length in node) {
node = Array.from(node);
return flatten(node[0]).concat(flatten(node.slice(1)));
} else {
if (! node || node.nodeType !== 1) return [];
return flatten(node.childNodes)
.concat(
nodeName(node) === "slot"? flatten(node.assignedNodes()) : [node]
);
} // if
} // flatten

} // getAllNodes

},{}],3:[function(require,module,exports){
"use strict";

module.exports = keyboardNavigation;
function keyboardNavigation (container, options) {
var dom = require ("./dom.js");
var focusedNode = null;
var searchTimer = null;
var searchText = "";
var searchTimeout = 400; // milliseconds
var keymap, actions;

var defaultOptions = {
type: "list", // list, tree, or menu
embedded: false, // if embedded in another widget, will not maintain tabindex="0" on container or child element
multiselect: false,
applyAria: true,
nodeSelector: "li",
activeNodeSelector: "",
groupSelector: "ul",
wrap: false,

keymap: {
next: ["ArrowDown", "ArrowRight"],
prev: ["ArrowUp", "ArrowLeft"],
first: ["Home"],
last: ["End"]
}, // keymap

actions: {
next: nextItem,
prev: prevItem,
first: firstItem,
last: lastItem,

up: upLevel,
down: downLevel,

out: function () {}
} // actions
}; // defaultOptions
options = options || {};

if (container.matches("select")) return;

options = Object.assign ({}, defaultOptions, options);
options.keymap = Object.assign ({}, defaultOptions.keymap, options.keymap);
options.actions = Object.assign ({}, defaultOptions.actions, options.actions);

options.keymap = processKeymap (options.keymap);

if (container.matches("ul")) removeBullets (container);

if (options.applyAria) applyAria (container, options.type);
setFocusedNode(initialFocus());


container.addEventListener ("keypress", function (e) {
var character = e.char || String.fromCharCode (e.which);
if (e.which === 0) return true;
if (isAlphanumeric(character)) return handleSearchKey (character);
return true;
}); // keypress


container.addEventListener ("keydown", function (e) {
var key = e.key || e.which || e.keyCode;
var actionName = options.keymap[key];
var action = options.actions[actionName]; // action

if (! key) {
alert ("invalid key: " + key);
throw new Error ("invalid key: " + key);
} // if
stopTimer ();

if (action) return performAction (action, e);
else return true;
}); // keydown

function performAction (action, e) {
var newNode;

if (action instanceof Function) {
newNode = action.call (container, getFocusedNode());
if (newNode !== e.target) current (newNode, "search");

} else if (typeof(action) === "string") {
e.target.dispatchEvent (new CustomEvent(action));

} else {
alert ("invalid action: " + action);
return true;
} // if

return false;
} // performAction


function current (node, search) {
if (node) {
setFocusedNode (node, search);
node.focus ();
if (! options.multiselect) {
setAttributes("aria-selected"); // removes the attribute completely
node.setAttribute("aria-selected", "true");
} // if
return node;

} else {
return getFocusedNode ();
} // if
} // current

function initialFocus () {
var node = getNodes()[0];
return node;
} // initialFocus

function getFocusedNode () {
return (focusedNode &&  focusedNode.matches(options.nodeSelector + options.activeNodeSelector))?
focusedNode : initialFocus();
} // getFocusedNode

function setFocusedNode (node, search) {
if (! node) return;
focusedNode = node;
if (! options.embedded) {
setAttributes ("tabindex", "-1");
focusedNode.setAttribute ("tabindex", "0");
} // if

if (! options.multiselect) {
// selection follows focus
setAttributes ("aria-selected"); // remove attribute completely
focusedNode.setAttribute ("aria-selected", "true");
} // if

if (search && options.type === "tree") definePath (node);
} // setFocusedNode

function definePath (node) {
var root = node.closest ("[role=tree]");
if (! node || !root) return;
setAttributes ("aria-expanded", "false", options.nodeSelector + "[aria-expanded='true']");

while (node && root.contains(node)) {
node = node.parentElement.closest("[role=treeitem]");
if (node) node.setAttribute ("aria-expanded", "true");
} // while
} // definePath

// create an observer instance
var observer = new MutationObserver(function(mutations) {
mutations.forEach(function(mutation) {
if (options.applyAria) applyAria (container, options.type);
setFocusedNode (initialFocus());
}); // forEach Mutations

}); // new Observer

// pass in the target node, as well as the observer options
//observer.observe(container, {childList: true});

// later, you can stop observing
//observer.disconnect();

function processKeymap (_keymap) {
var keymap = {};
for (var action in _keymap) {

for (var key of _keymap[action]) {
keymap[key] = action;
} // for
} // for

return keymap;
} // processKeymap

function applyAria (container, type) {
var name, branches, children;
type = type.toLowerCase();

if (type === "list") {
setAttributes ("role", "listbox", options.groupSelector);

getNodes(options.nodeSelector).forEach (node => {
node.setAttribute ("role", "option");
if (options.multiselect) node.setAttribute ("aria-selected", "false");
node.setAttribute ("tabindex", "-1");
});

options.rootSelector = "[role=listbox]";
options.groupSelector = "[role=listbox]";
options.nodeSelector = "[role=option]";

} else if (type === "tree") {
setAttributes ("role", "group", options.groupSelector);

getNodes (options.nodeSelector).forEach (node => {
if (node.querySelector(options.groupSelector)) node.setAttribute("aria-expanded", "false");
else if (options.multiselect) node.setAttribute ("aria-selected", "false");
node.setAttribute("role", "treeitem");
node.setAttribute ("tabindex", "-1");
});

container.setAttribute ("role", "tree");
options.rootSelector = "[role=tree]";
options.groupSelector = "[role=group]";
options.nodeSelector = "[role=treeitem]";
} // if

if (options.multiselect) setAttributes ("aria-multiselectable", "true", options.rootSelector);
} // applyAria


function removeBullets (container) {
getNodes("ul").forEach (node => node.style.listStyleType = "none");
} // removeBullets

function getNodes (selector = (options.nodeSelector + options.activeNodeSelector), nodes = container) {
return dom.getAllNodes (nodes, selector);
} // getNodes


/// default actions

function nextItem (node) {
return dom.nextSibling (node, options.nodeSelector + options.activeNodeSelector);
} // nextItem

function prevItem (node) {
return dom.previousSibling (node, options.nodeSelector + options.activeNodeSelector);
} // prevItem

function firstItem (node) {
return getNodes().slice(0,-1)[0];
} // firstItem 

function lastItem (node) {
return getNodes().slice(-1)[0];
} // lastItem 


function upLevel (node) {
var root = node.closest (options.rootSelector);
var up = node.parentNode.closest(options.nodeSelector);
if (up && root.contains(up)) {
up.setAttribute ("aria-expanded", "false");
return up;
} // if

return node;
} // upLevel

function downLevel (node) {
var down = node.querySelector(options.groupSelector + " > " + options.nodeSelector);
if (down) {
node.setAttribute ("aria-expanded", "true");
return down;
} // if

return node;
} // downLevel


/// search

function handleSearchKey (character) {
searchText += character;

searchTimer = setTimeout (function () {
searchList (searchText);
searchText = "";
}, searchTimeout || 200); // milliseconds
} // handleListSearch

function searchList (text) {
var node;
if (text) {
text = text.toLowerCase().trim();

node = find (getNodes(), function (element) {
var elementText = element.textContent.toLowerCase().trim();
return elementText.startsWith (text);
}, indexOf(current()));

if (node) current (node.closest("li"), "search");
return node;
} // if

return null;

function find (list, test, start, index) {
start = start || 0;
var length = list.length;

if (length === 0) return (index)? -1 : null;
if (start < 0) start = length+start;
start = (start+1) % length;

for (var i=start; i<length; i++) {
if (test(list[i])) return (index)? i : list[i];
} // for

if (start > 0) {
for (var i=0; i<start; i++) {
if (test(list[i])) return (index)? i : list[i];
} // for
} // if

return (index)? -1 : null;
} // findIndex
} // searchList

function stopTimer () {
clearTimeout (searchTimer);
} // stopTimer

function setAttributes (name = "", value = "", selector = options.nodeSelector) {
name = name.trim();
selector = selector.trim();
value = value.trim();
if (! name) return;

getNodes (selector).forEach (
(node) => (value)? node.setAttribute(name, value)
: node.removeAttribute(name)
); // forEach
} // setAttributes


function isAlphanumeric (x) {
var result = /[-+=_.!@#$%^&*()0-9a-zA-Z]/.test (x);
//alert ("isAlphanumeric " + x + " is " + result);
return result;
} // isAlphanumeric

/// API		
return current;
} // keyboardNavigation

//alert ("keyboardNavigation.js loaded");

},{"./dom.js":2}]},{},[1]);