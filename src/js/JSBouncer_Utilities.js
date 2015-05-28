(function (window) {
    "use strict";
    /* eslint-env browser */

    if (typeof (BouncerLibrary) === "undefined") {
        window.BouncerLibrary = {};
    }

    window.BouncerLibrary.get = function (url, callback) {
        var xhr = new XMLHttpRequest();

        function onreadystatechange() {
            if (xhr.readyState < 4) {
                return;
            }

            if (xhr.status !== 200) {
                return;
            }

            if (xhr.readyState === 4) {
                var result = JSON.parse(xhr.responseText);
                callback(result);
            }
        }

        xhr.onreadystatechange = onreadystatechange;
        xhr.open("GET", url, true);
        xhr.send();
    };

    window.BouncerLibrary.getAttributeFromCSS = function (attribute, selector) {
        var child = "<span class='" + selector.replace(".", "").replace(/\./g, " ") + "' ></span>",
            el = document.createElement("div"),
            target,
            value;
        el.innerHTML = child;
        target = el.firstChild;
        document.body.appendChild(target);
        value = window.getComputedStyle(target)[attribute];
        document.body.removeChild(target);
        return value;
    };
}(window));
