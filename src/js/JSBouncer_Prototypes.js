(function (window) {
    "use strict";
    /* eslint-env browser */

    if (typeof (BouncerLibrary) === "undefined") {
        window.BouncerLibrary = {};
    }

    window.BouncerLibrary.Prototypes = {};

    window.BouncerLibrary.Prototypes.BouncerListener = function () {
        var that = {};

        function onBouncerTurned() {}

        function onBouncerMoved() {}

        that.onBouncerTurned = onBouncerTurned;
        that.onBouncerMoved = onBouncerMoved;
        return that;
    };

}(window));
