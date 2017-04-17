## ID encapsulation

ID encapsulation seems to be broken in Firefox using webcomponentsjs-1.0.rc8

Running test.html via pollyserve produces seemingly correct shadow DOM, but when run in Firefox using NVDA, both input fields announce the same label when gaining focus.

I am not sure if this is a bug in the polyfill, or Firefox, but since Firefox does not support shadow DOM natively yet, I suspect the polyfill.

The following announces "element 1" when the `input` in shadow dom gains focus:

```
<x-t label="element 1">
<div class="x-t style-scope">
<span id="label" class="style-scope x-t">element 1</span>
<input aria-labelledby="label" class="style-scope x-t">
</div>
</x-t>
```

The following should announce "element 2" when the `input` gains focus, but "element 1" is announced instead:

```
<x-t label="element 2">
<div class="x-t style-scope">
<span id="label" class="style-scope x-t">element 2</span>
<input aria-labelledby="label" class="style-scope x-t">
</div>
</x-t>
```

Can others verify with different screen reader / browser combinations?

Am I missing something? I'm fairly new in the world of webcomponents, so I very well may be missing something; if so, please set me straight via comment!

Thanx...

-- Rich
