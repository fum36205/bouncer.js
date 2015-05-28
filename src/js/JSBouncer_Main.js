(function (window) {
    "use strict";
    /* eslint-env browser */
    /* global Bouncer, BouncerLibrary */

    var NewBouncer = function (canvas) {

        var map = new BouncerLibrary.Map(canvas);
        map.draw();

        function loadTask(url) {
            BouncerLibrary.get(url, function (data) {
                map.load(data.map);
            });
        }

        return {
            loadTask: loadTask
        };
    };

    if (typeof (Bouncer) === "undefined") {
        window.Bouncer = NewBouncer;
    }
}(window));
