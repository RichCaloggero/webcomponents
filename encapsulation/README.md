## ID encapsulation

ID encapsulation seems to be broken in Firefox using webcomponentsjs-1.0.rc7

Running test.html via pollyserve produces seemingly correct shadow DOM, but when run in Firefox using NVDA, both input fields announce the same label when gaining focus.

I am not sure if this is a bug in the polyfill, or Firefox, but since Firefox does not support shadow DOM natively yet, I suspect the polyfill.

Can anyone suggest a workaround?
