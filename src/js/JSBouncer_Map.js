(function (window) {
    "use strict";
    /* eslint-env browser */
    /* global BouncerLibrary */

    if (typeof BouncerLibrary === "undefined") {
        window.BouncerLibrary = {};
    }

    window.BouncerLibrary.Map = function (canvas, mapOptions) {
        var that = new BouncerLibrary.Prototypes.BouncerListener(),
            context,
            options,
            bouncer,
            fields,
            fieldMapping,
            commandStack;

        function drawBouncer() {
            var fieldWidth = canvas.getAttribute("width") / options.gridWidth,
                fieldHeight = canvas.getAttribute("height") / options.gridHeight,
                centerX = (bouncer.x * fieldWidth) + fieldWidth / 2,
                centerY = (bouncer.y * fieldWidth) + fieldHeight / 2,
                radius = (fieldWidth / 2) * 0.8,
                eyeSize = radius * 0.2,
                start = 45 * (Math.PI / 180),
                end = 315 * (Math.PI / 180),
                rotation = 0,
                xScale = 1,
                yScale = 1;

            switch (bouncer.orientation) {
            case BouncerLibrary.Enums.Orientation.NORTH:
                rotation = 90;
                break;
            case BouncerLibrary.Enums.Orientation.EAST:
                rotation = 0;
                break;
            case BouncerLibrary.Enums.Orientation.SOUTH:
                rotation = 270;
                xScale = -1;
                break;
            case BouncerLibrary.Enums.Orientation.WEST:
                rotation = 180;
                yScale = -1;
                break;
            default:
                rotation = 0;
            }

            context.save();
            context.translate(centerX, centerY);
            context.scale(xScale, yScale);
            context.rotate((Math.PI / 180) * rotation);
            context.beginPath();
            context.moveTo(0, 0);
            context.arc(0, 0, radius, start, end);
            context.lineTo(0, 0);
            context.fillStyle = BouncerLibrary.getAttributeFromCSS("backgroundColor", ".bouncer-player.body.color");
            context.fill();
            context.closePath();
            context.beginPath();
            context.arc(-eyeSize * 1.5, eyeSize * 1.5, eyeSize, 0, 2 * Math.PI);
            context.fillStyle = BouncerLibrary.getAttributeFromCSS("backgroundColor", ".bouncer-player.eye.color");
            context.fill();
            context.closePath();
            context.restore();
        }

        function drawObstacle(x, y) {
            var borderWidth = parseInt(getComputedStyle(canvas, null).getPropertyValue("border-width").replace("px", "")),
                fieldWidth = canvas.getAttribute("width") / options.gridWidth,
                fieldHeight = canvas.getAttribute("height") / options.gridHeight;
            context.beginPath();
            context.rect(x * fieldWidth + borderWidth / 2, y * fieldWidth + borderWidth / 2, fieldWidth - borderWidth, fieldHeight - borderWidth);
            context.fillStyle = BouncerLibrary.getAttributeFromCSS("backgroundColor", ".bouncer-grid.fields.obstacle");
            context.fill();
            context.closePath();
        }

        function drawColoredField(x, y, color) {
            var borderWidth = parseInt(getComputedStyle(canvas, null).getPropertyValue("border-width").replace("px", "")),
                fieldWidth = canvas.getAttribute("width") / options.gridWidth,
                fieldHeight = canvas.getAttribute("height") / options.gridHeight;
            context.beginPath();
            context.rect(x * fieldWidth + borderWidth / 2, y * fieldWidth + borderWidth / 2, fieldWidth - borderWidth, fieldHeight - borderWidth);
            context.fillStyle = BouncerLibrary.getAttributeFromCSS("backgroundColor", ".bouncer-grid.fields.colors." + color);
            context.fill();
            context.closePath();
        }

        function drawFields() {
            fields.forEach(function (item) {
                switch (item.type) {
                case BouncerLibrary.Enums.FieldType.COLOR:
                    drawColoredField(item.x, item.y, item.value);
                    break;
                case BouncerLibrary.Enums.FieldType.OBSTACLE:
                    drawObstacle(item.x, item.y);
                    break;
                }
            });
        }

        function drawGrid() {
            var borderWidth = getComputedStyle(canvas, null).getPropertyValue("border-width").replace("px", ""),
                fieldWidth = canvas.getAttribute("width") / options.gridWidth,
                fieldHeight = canvas.getAttribute("height") / options.gridHeight;

            context.beginPath();
            for (var x = 0; x < options.gridWidth; x++) {
                context.moveTo(x * fieldWidth, 0);
                context.lineTo(x * fieldWidth, canvas.getAttribute("height"));
            }
            for (var y = 0; y < options.gridHeight; y++) {
                context.moveTo(0, y * fieldHeight);
                context.lineTo(canvas.getAttribute("width"), y * fieldHeight);
            }
            context.lineWidth = borderWidth;
            context.strokeStyle = BouncerLibrary.getAttributeFromCSS("border-color", ".bouncer-grid.color");
            context.stroke();
            context.closePath();
        }

        function clear() {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }

        function draw() {
            clear();
            drawGrid();
            drawFields();
            drawBouncer();
        }

        function getField(x, y) {
            var field;

            if (x < 0 || y < 0 || x >= options.gridWidth || y >= options.gridHeight) {
                return undefined;
            }

            field = fieldMapping[x][y];
            if (field === undefined) {
                field = {
                    x: x,
                    y: y,
                    type: BouncerLibrary.Enums.FieldType.EMPTY
                };
            }
            return field;
        }

        function onBouncerMoved(newState) {
            bouncer.x = newState.x;
            bouncer.y = newState.y;
            bouncer.orientation = newState.orientation;

            if (commandStack.use === true) {
                commandStack.push({
                    type: BouncerLibrary.Enums.Commands.MOVE,
                    x: newState.x,
                    y: newState.y,
                    orientation: newState.orientation
                });
            } else {
                draw();
            }
        }

        function onBouncerTurned(newState) {
            bouncer.x = newState.x;
            bouncer.y = newState.y;
            bouncer.orientation = newState.orientation;

            if (commandStack.use === true) {
                commandStack.push({
                    type: BouncerLibrary.Enums.Commands.TURN,
                    x: newState.x,
                    y: newState.y,
                    orientation: newState.orientation
                });
            } else {
                draw();
            }
        }

        function init() {
            fields = [];
            commandStack = [];
            bouncer = {
                x: 0,
                y: 0,
                orientation: "EAST"
            };
            canvas.classList.add("bouncer-canvas");
            canvas.setAttribute("width", canvas.offsetWidth);
            canvas.setAttribute("height", canvas.offsetHeight);
            context = canvas.getContext("2d");
            // Translating origin to lower-left
            context.translate(0, canvas.height);
            context.scale(1, -1);
        }

        function setOptions(newOptions) {
            newOptions = newOptions || {};
            options = options || {};
            options.gridWidth = newOptions.gridWidth || options.gridWidth || 16;
            options.gridHeight = newOptions.gridHeight || options.gridHeight || 16;
        }

        function load(url, callback) {
            BouncerLibrary.get(url, function (map) {
                var newOptions = {};
                map = map.map;
                bouncer = map.bouncer || bouncer;
                bouncer.orientation = BouncerLibrary.Enums.Orientation[bouncer.orientation];
                fields = map.fields || fields;
                fieldMapping = [];
                for (var i = 0; i < map.width; i++) {
                    fieldMapping[i] = [];
                }
                fields.forEach(function (field) {
                    field.type = BouncerLibrary.Enums.FieldType[field.type];
                    fieldMapping[field.x][field.y] = field;
                });
                newOptions.gridWidth = map.width;
                newOptions.gridHeight = map.height;
                setOptions(newOptions);
                draw();
                if (callback) {
                    callback();
                }
            });
        }

        function getBouncerState() {
            return {
                x: bouncer.x,
                y: bouncer.y,
                orientation: bouncer.orientation
            };
        }

        function getMapProxy() {
            return {
                getFieldInfo: getField
            };
        }

        function createCommandStack() {
            /* eslint-disable */
            console.log("create command stack");
            /* eslint-enable */
            commandStack = [];
            commandStack.use = true;
            commandStack.push({
                type: BouncerLibrary.Enums.Commands.MOVE,
                x: bouncer.x,
                y: bouncer.y,
                orientation: bouncer.orientation
            });
        }

        function runCommandStack(delay) {
            /* eslint-disable */
            console.log("running command stack");
            /* eslint-enable */
            commandStack.inUse = false;
            commandStack.forEach(function (command, index) {
                switch (command.type) {
                case BouncerLibrary.Enums.Commands.MOVE:
                case BouncerLibrary.Enums.Commands.TURN:
                    setTimeout(function () {
                        bouncer.x = command.x;
                        bouncer.y = command.y;
                        bouncer.orientation = command.orientation;
                        draw();
                    }, delay * index);
                    break;
                }
            });

            return {
                type: "stack",
                result: "processing command stack"
            };
        }

        setOptions(mapOptions);
        init();

        that.draw = draw;
        that.onBouncerTurned = onBouncerTurned;
        that.onBouncerMoved = onBouncerMoved;
        that.getMapProxy = getMapProxy;
        that.getBouncerState = getBouncerState;
        that.setOptions = setOptions;
        that.createCommandStack = createCommandStack;
        that.runCommandStack = runCommandStack;
        that.load = load;
        return that;
    };

}(window));
