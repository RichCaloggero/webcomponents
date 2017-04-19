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
