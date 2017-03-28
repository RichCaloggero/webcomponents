"use strict";

function keyboardNavigation (container, options) {
var focusedNode = null;
var searchTimer = null;
var searchText = "";
var searchTimeout = 400; // milliseconds
var keymap, actions;

var defaultOptions = {
type: "list", // list, tree, or menu
embedded: false, // if embedded in another widget, will not maintain tabindex="0" on container or child element
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
if (newNode !== e.target) current (newNode);

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
return (focusedNode && options.activeNodeSelector && focusedNode.matches(options.activeNodeSelector))?
focusedNode : initialFocus();
} // getFocusedNode

function setFocusedNode (node, search) {
if (! node) return;
focusedNode = node;
if (! options.embedded) {
getNodes(options.nodeSelector + "[tabindex='0']")
.forEach (node => node.setAttribute("tabindex", "-1"));
focusedNode.setAttribute ("tabindex", "0");
} // if

if (search && options.type === "tree") definePath (node);
} // setFocusedNode

function definePath (node) {
var root = node.closest ("[role=tree]");
if (! node || !root) return;
getNodes(options.nodeSelector + "[aria-expanded='true']")
.forEach (node => node.setAttribute("aria-expanded", "false"));

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
getNodes("ul").forEach (node => node.setAttribute ("role", "listbox"));
getNodes("li").forEach (node => {
node.setAttribute ("role", "option");
node.setAttribute ("tabindex", "-1");
});

} else if (type === "tree") {
getNodes ("ul").forEach (node => node.setAttribute("role", "group"));
getNodes ("li").forEach (node => {
if (node.querySelector("ul")) node.setAttribute("aria-expanded", "false");
else node.setAttribute ("aria-selected", "false");
node.setAttribute("role", "treeitem");
node.setAttribute ("tabindex", "-1");
});
container.setAttribute ("role", "tree");

} // if
} // applyAria


function removeBullets (container) {
getNodes("ul").forEach (node => node.style.listStyleType = "none");
} // removeBullets

function getNodes (selector = options.nodeSelector, nodes = container) {
return getAllNodes (nodes, selector + options.activeNodeSelector);
} // getNodes


/// default actions

function nextItem (node) {
return nextSibling (node, options.activeNodeSelector);
} // nextItem

function prevItem (node) {
return previousSibling (node, options.activeNodeSelector);
} // prevItem

function firstItem (node) {
return getNodes().slice(0,-1)[0];
} // firstItem 

function lastItem (node) {
return getNodes().slice(-2)[0];
} // lastItem 


function upLevel (node) {
var root = node.closest ("[role=tree]");
var up = node.parentNode.closest("[role=treeitem]");
if (up && root.contains(up)) {
up.setAttribute ("aria-expanded", "false");
return up;
} // if

return node;
} // upLevel

function downLevel (node) {
var down = node.querySelector("[role=group] > [role=treeitem]");
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

function isAlphanumeric (x) {
var result = /[-+=_.!@#$%^&*()0-9a-zA-Z]/.test (x);
//alert ("isAlphanumeric " + x + " is " + result);
return result;
} // isAlphanumeric

/// API		
return current;
} // keyboardNavigation

//alert ("keyboardNavigation.js loaded");
