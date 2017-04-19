module.exports = idGen;
function idGen (stem) {
return stem + positiveIntegers.next().value;
} // idGen

var positiveIntegers = positiveIntegerGenerator ();
function* positiveIntegerGenerator () {
let n = 0;
while (true) yield ++n;
} // positiveIntegerGenerator 
