(function (window) {
    "use strict";
    /* eslint-env browser */
    /* global BouncerLibrary */

    if (typeof BouncerLibrary === "undefined") {
        window.BouncerLibrary = {};
    }

    window.BouncerLibrary.Context = function (bouncer, map) {
        var that = {};
        window.bouncer = bouncer;

        function run(code, delay) {
            var result;
            if (delay) {
                map.createCommandStack();
                bouncer.startLogging();
                window.eval(code);
                map.runCommandStack(delay);
                bouncer.stopLogging();
                result = bouncer.getLog();
                for (var i = 0; i < result.length; i++) {
                    if (Boolean.prototype.isPrototypeOf(result[i])) {
                        result[i] = result[i].msg;
                    }
                }
                result.type = "stack";
            } else {
                result = window.eval(code);
            }
            return result;
        }

        function loadMapData(mapUrl, callback) {
            map.load(mapUrl, function () {
                var initialBouncerState = map.getBouncerState();
                bouncer.setState(initialBouncerState);
                callback();
            });
        }

        function init() {
            bouncer.setMap(map.getMapProxy());
            bouncer.addEventListener(["turn", "move"], map);
        }

        init();

        that.run = run;
        that.loadMapData = loadMapData;
        return that;
    };

}(window));
