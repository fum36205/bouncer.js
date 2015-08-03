(function (window) {
    "use strict";
    /* eslint-env browser */

    if (typeof (BouncerLibrary) === "undefined") {
        window.BouncerLibrary = {};
    }

    window.BouncerLibrary.Enums = {};

    window.BouncerLibrary.Enums.Orientation = Object.freeze({
        NORTH: 0,
        EAST: 1,
        SOUTH: 2,
        WEST: 3
    });

    window.BouncerLibrary.Enums.FieldType = Object.freeze({
        COLOR: 0,
        OBSTACLE: 1,
        EMPTY: 2
    });

    window.BouncerLibrary.Enums.Commands = Object.freeze({
        MOVE: 0,
        TURN: 1,
        CHECK_FRONT: 2,
        SET_FIELD: 3
    });

}(window));
