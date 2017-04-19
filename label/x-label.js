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
