# bouncer.js
bouncer.js is a web frontend for bouncer

## Build
To build the library files run

```
npm install && grunt
```

The generated JavaScript and CSS files can be found in `/dist`. Include the files in your project to use the library.

## Usage

bouncer.js uses a `canvas` element to draw the current map and state. A reference to such an element must be provided when initializing Bouncer:

```javascript
var canvas = document.querySelector("#id");
var bouncer = new Bouncer(canvas);
ouncer.start();
```


