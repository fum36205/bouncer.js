(function (window) {
    "use strict";
    /* eslint-env browser */
    /* global Bouncer, BouncerLibrary */

    var NewBouncer = function (canvas) {

        var map = new BouncerLibrary.Map(canvas);

        function start() {
            map.draw();
        }

        return {
            start: start
        };
    };

    if (typeof (Bouncer) === "undefined") {
        window.Bouncer = NewBouncer;
    }
}(window));
