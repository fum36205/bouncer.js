(function (window) {
    "use strict";
    /* eslint-env browser */
    /* global BouncerLibrary */

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
            map;

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
            var targetField;

            targetField = getNextField();

            if (targetField !== undefined && targetField.type !== BouncerLibrary.Enums.FieldType.OBSTACLE) {
                return true;
            } else {
                return false;
            }
        }

        function move() {
            var targetField;

            targetField = getNextField();

            if (targetField !== undefined && targetField.type !== BouncerLibrary.Enums.FieldType.OBSTACLE) {
                position.x = targetField.x;
                position.y = targetField.y;
                notifyAll("move", getState());
                return {
                    "result": "bouncer moved to (" + position.x + "," + position.y + ")"
                };
            } else {
                notifyAll("crash", {
                    currentState: getState(),
                    targetField: targetField
                });
                return {
                    "type": "step",
                    "result": "bouncer crashed while moving"
                };
            }
        }

        function turnLeft() {

            if (orientation > 0) {
                orientation--;
            } else {
                orientation = BouncerLibrary.Enums.Orientation.WEST;
            }

            notifyAll("turn", getState());
            return {
                "type": "step",
                "result": "bouncer turned, now facing " + Object.keys(BouncerLibrary.Enums.Orientation)[orientation]
            };
        }

        that.addEventListener = addEventListener;
        that.removeEventListener = removeEventListener;
        that.move = move;
        that.turnLeft = turnLeft;
        that.isFrontClear = isFrontClear;
        that.setState = setState;
        that.setMap = setMap;
        return that;
    };

}(window));
