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
            var x, y, field;
            for (x = 0; x < options.gridWidth; x++) {
                for (y = 0; y < options.gridHeight; y++) {
                    field = fieldMapping[x][y];
                    if (field === undefined) {
                        continue;
                    }
                    switch (field.type) {
                    case BouncerLibrary.Enums.FieldType.COLOR:
                        if (field.drawState !== undefined) {
                            if (field.drawState.type === BouncerLibrary.Enums.FieldType.COLOR) {
                                drawColoredField(field.drawState.x, field.drawState.y, field.drawState.value);
                            }
                        } else {
                            drawColoredField(field.x, field.y, field.value);
                        }
                        break;
                    case BouncerLibrary.Enums.FieldType.OBSTACLE:
                        drawObstacle(field.x, field.y);
                        break;
                    }
                }
            }
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
            if (x < 0 || y < 0 || x >= options.gridWidth || y >= options.gridHeight) {
                return undefined;
            }
            return fieldMapping[x][y];
        }

        function setField(x, y, type, value) {
            var field, newField;
            if (x < 0 || y < 0 || x >= options.gridWidth || y >= options.gridHeight) {
                return false;
            }


            newField = {
                type: BouncerLibrary.Enums.FieldType.COLOR,
                x: x,
                y: y,
                value: value
            };


            field = fieldMapping[x][y];

            if (field === undefined) {
                newField.drawState = {
                    type: BouncerLibrary.Enums.FieldType.EMPTY,
                    x: x,
                    y: y
                };
            } else {
                newField.drawState = {
                    type: field.type,
                    x: x,
                    y: y,
                    value: field.value
                };
            }

            fieldMapping[x][y] = newField;

            if (commandStack.use === true) {
                commandStack.push({
                    type: BouncerLibrary.Enums.Commands.SET_FIELD,
                    x: x,
                    y: y,
                    newType: type,
                    newValue: value
                });
            } else {
                fieldMapping[x][y].drawState = undefined;
                draw();
            }
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
            commandStack = [];
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
                bouncer = map.bouncer;
                bouncer.orientation = BouncerLibrary.Enums.Orientation[bouncer.orientation];
                fieldMapping = [];
                for (var x = 0; x < options.gridWidth; x++) {
                    fieldMapping[x] = [];
                    for (var y = 0; y < options.gridHeight; y++) {
                        fieldMapping[x][y] = {
                            type: BouncerLibrary.Enums.FieldType.EMPTY,
                            x: x,
                            y: y
                        };
                    }
                }
                map.fields.forEach(function (field) {
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
                getFieldInfo: getField,
                setFieldInfo: setField
            };
        }

        function createCommandStack() {
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
            commandStack.use = false;
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
                case BouncerLibrary.Enums.Commands.SET_FIELD:
                    setTimeout(function () {
                        setField(command.x, command.y, command.newType, command.newValue);
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
