(function (window) {
    "use strict";
    /* eslint-env browser */
    /* global Bouncer */

    if (typeof (Bouncer) === "undefined") {
        window.Bouncer = window.BouncerLibrary.Bouncer;
    }

    if (typeof (BouncerMap) === "undefined") {
        window.BouncerMap = window.BouncerLibrary.Map;
    }

    if (typeof (BouncerContext) === "undefined") {
        window.BouncerContext = window.BouncerLibrary.Context;
    }

}(window));
