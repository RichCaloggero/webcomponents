(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var idGen = require ("../util/idGen");

var template = document.querySelector("#x-label-template");

customElements.define ("x-label", class extends HTMLElement {
constructor () {
super ();
var root = this.createRootElement ();
var id = idGen ("label-");
root.querySelector (".label").setAttribute ("id", id);
root.querySelector (".body").setAttribute ("aria-labelledby", id);
} // constructor

connectedCallback () {
this.normalize ();

Array.from(this.childNodes)
.filter(node => node.nodeType === 1)
.forEach (node => node.setAttribute ("slot", "body"));
} // connectedCallback

createRootElement () {
var root = this.attachShadow({delegatesFocus: true, mode: "open"});
var content = template.content.cloneNode(true);
root.appendChild(content);
return root;
} // createRootElement

}); // custom element


alert	 ("x-label.js loaded");

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
