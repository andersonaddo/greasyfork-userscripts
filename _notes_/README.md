Credit to `refined-github/refined-github` repo for this cool info:

"GitHub fires several custom events that we can listen to. You can run this piece of code in the console to start seeing every event being fired:"

```js
const d = Node.prototype.dispatchEvent;
Node.prototype.dispatchEvent = function (...a) {
	console.log(...a);
	// debugger; // Uncomment when necessary
	d.apply(this, a);
};
```