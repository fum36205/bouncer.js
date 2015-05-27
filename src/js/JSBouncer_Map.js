(function (window) {
    "use strict";
    /* eslint-env browser */

    if (typeof (BouncerLibrary) === "undefined") {
        window.BouncerLibrary = {};
    }

    window.BouncerLibrary.Map = function (canvas, mapOptions) {

        var context,
            options;

        function init() {
            canvas.classList.add("bouncer-canvas");
            canvas.setAttribute("width", canvas.offsetWidth);
            canvas.setAttribute("height", canvas.offsetHeight);
            context = canvas.getContext("2d");
            context.save();
        }

        function loadOptions() {
            mapOptions = mapOptions || {};
            options = {};
            options.gridWidth = mapOptions.gridWidth || 16;
            options.gridHeight = mapOptions.gridHeight || 16;

        }

        function drawGrid() {
            var borderWidth = getComputedStyle(canvas, null).getPropertyValue("border-width").replace("px", ""),
                fieldWidth = canvas.getAttribute("width") / options.gridWidth,
                fieldHeight = canvas.getAttribute("height") / options.gridHeight;
            for (var x = 0; x < options.gridWidth; x++) {
                context.moveTo(x * fieldWidth, 0);
                context.lineTo(x * fieldWidth, canvas.getAttribute("height"));
            }
            for (var y = 0; y < options.gridHeight; y++) {
                context.moveTo(0, y * fieldHeight);
                context.lineTo(canvas.getAttribute("width"), y * fieldHeight);
            }
            context.lineWidth = borderWidth;
            context.strokeStyle = "black";
            context.stroke();
        }

        function draw() {
            drawGrid();
        }

        loadOptions();
        init();

        return {
            draw: draw
        };
    };


}(window));
