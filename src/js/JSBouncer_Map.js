(function (window) {
    "use strict";
    /* eslint-env browser */
    /* global BouncerLibrary */

    if (typeof (BouncerLibrary) === "undefined") {
        window.BouncerLibrary = {};
    }

    window.BouncerLibrary.Map = function (canvas, mapOptions) {

        var context,
            options,
            fields;

        function drawColoredField(x, y, color) {
            var borderWidth = parseInt(getComputedStyle(canvas, null).getPropertyValue("border-width").replace("px", "")),
                fieldWidth = canvas.getAttribute("width") / options.gridWidth,
                fieldHeight = canvas.getAttribute("height") / options.gridHeight;
            context.beginPath();
            context.rect(x * fieldWidth + borderWidth / 2, y * fieldWidth + borderWidth / 2, fieldWidth - borderWidth, fieldHeight - borderWidth);
            context.fillStyle = BouncerLibrary.getAttributeFromCSS("backgroundColor", ".bouncer-grid.colors." + color);
            context.fill();
            context.closePath();
        }

        function drawFields() {
            fields.forEach(function (item) {
                switch (item.type) {
                case "color":
                    drawColoredField(item.x, item.y, item.value);
                    break;
                }
            });
        }

        function drawGrid() {
            var borderWidth = getComputedStyle(canvas, null).getPropertyValue("border-width").replace("px", ""),
                fieldWidth = canvas.getAttribute("width") / options.gridWidth,
                fieldHeight = canvas.getAttribute("height") / options.gridHeight;

            context.beginPath();
            for (var x = 0; x < options.gridWidth; x++) {
                context.moveTo(x * fieldWidth, 0);
                context.lineTo(x * fieldWidth, canvas.getAttribute("height"));
            }
            for (var y = 0; y < options.gridHeight; y++) {
                context.moveTo(0, y * fieldHeight);
                context.lineTo(canvas.getAttribute("width"), y * fieldHeight);
            }
            context.lineWidth = borderWidth;
            context.strokeStyle = BouncerLibrary.getAttributeFromCSS("border-color", ".bouncer-grid.color");
            context.stroke();
            context.closePath();
        }

        function clear() {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }

        function draw() {
            clear();
            drawGrid();
            drawFields();
        }

        function init() {
            canvas.classList.add("bouncer-canvas");
            canvas.setAttribute("width", canvas.offsetWidth);
            canvas.setAttribute("height", canvas.offsetHeight);
            context = canvas.getContext("2d");
            // Translating origin to lower-left
            context.translate(0, canvas.height);
            context.scale(1, -1);
            fields = [];
        }

        function setOptions(newOptions) {
            newOptions = newOptions || {};
            options = options || {};
            options.gridWidth = newOptions.gridWidth || options.gridWidth || 16;
            options.gridHeight = newOptions.gridHeight || options.gridHeight || 16;
        }

        function load(map) {
            var newOptions = {};
            fields = map.fields || fields;
            newOptions.gridWidth = map.width;
            newOptions.gridHeight = map.height;
            setOptions(newOptions);
            draw();
        }

        setOptions(mapOptions);
        init();

        return {
            draw: draw,
            setOptions: setOptions,
            load: load
        };
    };


}(window));
