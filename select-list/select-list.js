"use strict";
var keyboardNavigation = require ("../util/keyboardNavigation");
var dom = require ("../util/dom");

var template = document.querySelector("#select-list-template");

customElements.define ("select-list", class extends HTMLElement {
constructor () {
super ();
this._root = this.createRootElement();
} // constructor

connectedCallback () {
this.init();
this.render();
} // connectedCallback

init () {
this.initOptions();
alert ("select-list activedescendant: " + this._options.activedescendant);

this._control = this._root.querySelector(".select-list");
this._label = this._root.querySelector("#label");
this._list = this._root.querySelector(".listbox");
this._status = this._root.querySelector(".status");

if (this._options.label) {
this._label.setAttribute ("id", idGen("select-list-label-"));
this._label.textContent = this._options.label;
this._control.setAttribute ("aria-labelledby", this._label.getAttribute("id"));
} // if

} // init

initOptions () {
this._options = {
multiselect: this.hasAttribute("multiselect"),
embedded: this.hasAttribute("embedded"),
activedescendant: this.getAttribute("activedescendant") || "",
label: this.getAttribute("label") || ""
}; // this._options
} // initOptions

createRootElement () {
var root = this.attachShadow({delegatesFocus: true, mode: "open"});
var content = template.content.cloneNode(true);

root.appendChild(content);

return root;
} // createRootElement

render () {
this.attachHandlers();

} // render

attachHandlers () {
var self = this;

this.currentItem = keyboardNavigation(this._list, {
multiselect: this._options.multiselect,
embedded: this._options.embedded,
activedescendant: this._options.activedescendant,
activeNodeSelector: ":not([hidden])",

actions: {
toggleSelection: this.toggleSelection.bind(this),
accept: this.accept.bind(this),
cancel: this.cancel.bind(this)
}, // actions

keymap: {
toggleSelection: [" "],
accept: ["Enter"],
cancel: ["Escape"]
} // keymap
}); // keyboardNavigation

} // attachHandlers

toggleSelection (node) {
if (!node || !this._options.multiselect) return;

node.setAttribute ("aria-selected",
(node.getAttribute("aria-selected") === "true")? "false" : "true"
); // setAttribute
} // toggleSelection

accept () {
this.dispatchEvent(new CustomEvent("accept", {bubbles: true, composed: true}));
} // accept

cancel () {
this.dispatchEvent(new CustomEvent("cancel", {bubbles: true, composed: true}));
} // cancel


value () {
var nodes = dom.getAllNodes (this._list, "[aria-selected='true']");
//alert ("select-list.value: " + nodes.length + " " + nodes);
return dom.getAllNodes (this._list, "[aria-selected='true']")
.map (node => this.valueOf(node));
} // value

/*value () {
var nodes = this.querySelectorAll("[aria-selected='true']");
var result = nodes.map (node => this.valueOf(node), this);

return (result.length > 1)?
result : result[0];
} // value
*/

valueOf (node) {
if (! node) return "";
//alert (node.textContent);
return (node.hasAttribute("value"))?
node.getAttribute("value") : node.textContent;
} // valueOf

static get observedAttributes() {
return ["activedescendant"];
}

attributeChangedCallback (name, oldValue, newValue) {
this._options[name] = newValue;
alert ("attributeChanged: " + name + "=" + newValue);

if (name === "activedescendant") this.currentItem (this.currentItem());
} // attributeChangedCallback


displayItemCount (text) {
this.statusMessage (this.querySelectorAll("[role=option]").length + " " + (text || "items"));
} // displayItemCount

statusMessage (text) {
this._status.textContent = text;
} // statusMessage

}); // custom element

alert	 ("selectList.js loaded");
