# bouncer.js
bouncer.js is a web frontend for bouncer

## Build
To build the library files run

```
npm install && grunt
```

The generated JavaScript and CSS files can be found in `/dist`. Include the files in your project to use the library.

## Usage

### Single Commands (`move`, `turn`)
bouncer.js uses a `canvas` element to draw the current map and state. To use the library create both a `BouncerMap` and a `Bouncer` instance.

```javascript
// create objects
var canvas = document.querySelector("#id");
var map = new BouncerMap(canvas);
var bouncer = new Bouncer();

// setup listener
bouncer.setMap(map.getMapProxy());
bouncer.addEventListener(["turn", "move"], map);

// load map
map.load(mapUrl, function () {
    var initialBouncerState = map.getBouncerState();
    bouncer.setState(initialBouncerState);
    /*
    here you can run bouncer commands:
    bouncer.move();
    bouncer.turn();
    */
});
```

### Command Stacks
You probably want to delay the drawing of new bouncer states to create a animated sequence shown in the map:

```javascript
var canvas = document.querySelector("#map");
var map = new BouncerMap(canvas);
var bouncer = new Bouncer();

// load map
map.load(mapUrl, function () {
    var initialBouncerState = map.getBouncerState();
    bouncer.setState(initialBouncerState);
    map.createCommandStack();
    /*
    here you can add bouncer commands to the created stack:
    bouncer.move();
    bouncer.turn();
    */
    // run stacked commands with a delay of 100ms between commands
    map.runCommandStack(100);
});
```

### Context and eval
To evaluate and run code blocks use the `BouncerContext` instance

```javascript
var canvas = document.querySelector("#map");
var map = new BouncerMap(canvas);
var bouncer = new Bouncer();
var context = new BouncerContext(bouncer, map);
context.loadMapData("./data/demo_map.json", function() {
	// if DELAY is given, command stacks are used
	context.run(COMMAND_BLOCK, DELAY);
});

```




