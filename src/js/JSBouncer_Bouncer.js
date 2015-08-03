(function (window) {
    "use strict";
    /* eslint-env browser */
    /* global BouncerLibrary */
    /*eslint no-new-wrappers:0 */

    if (typeof (BouncerLibrary) === "undefined") {
        window.BouncerLibrary = {};
    }

    window.BouncerLibrary.Bouncer = function () {
        var that = {},
            events = ["turn", "move", "paint"],
            listeners = {},
            position = {
                x: 0,
                y: 0
            },
            orientation = BouncerLibrary.Enums.Orientation.EAST,
            map,
            log = [];

        function addEventListener(event, listener) {
            if (event instanceof Array) {
                event.forEach(function (singleEvent) {
                    addEventListener(singleEvent, listener);
                });
            }
            if (events.indexOf(event) === -1) {
                return;
            }
            if (listeners[event] === undefined) {
                listeners[event] = [];
            }
            listeners[event].push(listener);
        }

        function removeEventListener(event, listener) {
            var index;
            if (listeners[event] === undefined) {
                return;
            }
            index = listeners[event].indexOf(listener);
            listeners[event].splice(index, 1);
        }

        function getState() {
            return {
                x: position.x,
                y: position.y,
                orientation: orientation
            };
        }

        function setState(state) {
            position.x = state.x;
            position.y = state.y;
            orientation = state.orientation;
        }

        function setMap(newMap) {
            map = newMap;
        }

        function notifyAll(event, params) {
            var callback;
            if (listeners[event] === undefined) {
                return;
            }
            switch (event) {
            case "move":
                callback = "onBouncerMoved";
                break;
            case "turn":
                callback = "onBouncerTurned";
                break;
            }
            listeners[event].forEach(function (listener) {
                if (typeof listener === "function") {
                    listener(params);
                    return;
                }

                if (typeof listener[callback] === "function") {
                    listener[callback](params);
                    return;
                }
            });
        }

        function getNextField() {
            var targetX = position.x,
                targetY = position.y,
                targetField;

            switch (orientation) {
            case BouncerLibrary.Enums.Orientation.NORTH:
                targetY++;
                break;
            case BouncerLibrary.Enums.Orientation.EAST:
                targetX++;
                break;
            case BouncerLibrary.Enums.Orientation.SOUTH:
                targetY--;
                break;
            case BouncerLibrary.Enums.Orientation.WEST:
                targetX--;
                break;
            }

            targetField = map.getFieldInfo(targetX, targetY);
            return targetField;
        }

        function isFrontClear() {
            var targetField, result;

            targetField = getNextField();

            if (targetField !== undefined && targetField.type !== BouncerLibrary.Enums.FieldType.OBSTACLE) {
                result = new Boolean(true);
                result.msg = {
                    type: "checkFront",
                    result: "front is clear"
                };
            } else {
                result = new Boolean(false);
                result.msg = {
                    type: "checkFront",
                    result: "front is blocked"
                };
            }
            if (log.use === true) {
                log.push(result);
            }
            return result.valueOf();
        }

        function getCurrentFieldColor() {
            var targetField, result;
            targetField = map.getFieldInfo(position.x, position.y);
            if (targetField.type === BouncerLibrary.Enums.FieldType.COLOR) {
                result = new String(targetField.value);
                result.msg = {
                    type: "colorRequest",
                    result: "current field is " + targetField.value
                };
            } else {
                result = new String("undefined");
                result.msg = {
                    type: "colorRequest",
                    result: "current field has no color"
                };
            }
            if (log.use === true) {
                log.push(result);
            }
            return result.valueOf();
        }

        function setCurrentFieldColor(color) {
            map.setFieldInfo(position.x, position.y, BouncerLibrary.Enums.FieldType.COLOR, color);
        }

        function move() {
            var targetField, result;

            targetField = getNextField();

            if (targetField !== undefined && targetField.type !== BouncerLibrary.Enums.FieldType.OBSTACLE) {
                position.x = targetField.x;
                position.y = targetField.y;
                notifyAll("move", getState());
                result = new Boolean(true);
                result.msg = {
                    type: "step",
                    result: "bouncer moved to (" + position.x + "," + position.y + ")"
                };
            } else {
                notifyAll("crash", {
                    currentState: getState(),
                    targetField: targetField
                });
                result = new Boolean(false);
                result.msg = {
                    type: "step",
                    result: "bouncer crashed while moving"
                };
            }
            if (log.use === true) {
                log.push(result);
            }
            return result.valueOf();
        }

        function turnLeft() {
            var result;
            if (orientation > 0) {
                orientation--;
            } else {
                orientation = BouncerLibrary.Enums.Orientation.WEST;
            }
            notifyAll("turn", getState());

            result = new Boolean(true);
            result.msg = {
                "type": "step",
                "result": "bouncer turned, now facing " + Object.keys(BouncerLibrary.Enums.Orientation)[orientation]
            };
            if (log.use === true) {
                log.push(result);
            }
            return result.valueOf();
        }

        function startLogging() {
            log.use = true;
            log.startIndex = log.length;
        }

        function stopLogging() {
            log.use = false;
            log.stopIndex = log.length;
        }

        function getLog() {
            var currentLog = log.slice(log.startIndex, log.stopIndex);
            return currentLog;
        }

        that.addEventListener = addEventListener;
        that.removeEventListener = removeEventListener;
        that.move = move;
        that.turnLeft = turnLeft;
        that.isFrontClear = isFrontClear;
        that.getCurrentFieldColor = getCurrentFieldColor;
        that.setCurrentFieldColor = setCurrentFieldColor;
        that.setState = setState;
        that.setMap = setMap;
        that.startLogging = startLogging;
        that.stopLogging = stopLogging;
        that.getLog = getLog;
        return that;
    };

}(window));
