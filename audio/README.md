# Webaudio Components

This was originially begun as a way to learn Polymer.

The package contains two distinct types of elements:
- connectors
- audio processing elements

The connectors build the connection graph and generally have no UI. They include:
- audio-series
- audio-parallel
- audio-split
- audio-merge

The audio processing elements currently include:
- audio-player
- audio-gain
- audio-filter
- audio-delay

We wrap everything inside an audio-context element.

## All elements

All elements, both connectors and audio processors, are web components. They consist of a custom element and its JS class definition.
All elements are subclasses of AudioContext.
The entire HTML graph needs to be wrapped in a `<audio-context> ... </audio-context>` element.

## Connectors

### Series connector

- each child is connected in series to  its siblings, in source order
- _in of first child connects to _in of the series
- _out of last child connects to _out of the series

### Parallel connector

- _in of the parallel connector connects to _in of all children
- _out of each child connects to _out of the parallel connector

## Split

- split must have either 1 or 2 children, currently each of which must be a series
- if 2 then each is connected to either left or right output of the element's _in connector, and outputs are merged back into a stereo signal at the element's _out connector
	+ first child is left, second child is right
	 + reverse boolean attribute reverses left and right at the output
- if 1, child then 
	+ default is to connects left of _in to left of _out
	+ the boolean reverse attribute connects left of _in to right of _out
	+ the boolean swap attribute causes first child toj take input from right of _in instead of left
		+ if only swap used on split with single child, then _in left goes to _out right
+ if both reverse and swap are used on a split with a single child, then _in right goes to _out left

### Merge

- merge must have 1 or 2 children, each of which must be series
- if 2, then both are merged into _out as a 2-channel mono stream
- if 1, then it is spread over both output channels


