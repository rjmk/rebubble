# REBUBBLE

## Why?

Because [event delegation](http://davidwalsh.name/event-delegate) is cool, but checking you have the right node seems like a big faff.

## What

A little (tested!) tool (with 100% coverage!) that lets you 'rebubble' an event to find the actual element between the target and the handler that you want. The 'css' selectors can combine classes, tags and ids and supports the descendant selector.

Also, a handy method that allows you to not worry about passing in the 'this' to a function when attaching the event listener to a node with JS.

## How?

`index.js` is the only file you need to actually use rebubble. All the functions are documented with JSDoc. If you want to run the coverage on the tests, you will have to view the test.html file on a local server.
