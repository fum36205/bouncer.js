var App = App || {};
App.Bouncer = (function () {
    "use strict";
    /* eslint-env browser, jquery  */
    /* global Bouncer, BouncerMap, BouncerContext */

    var context,
        terminal,
        DELAY = 100;

    function onBouncerReady() {
        terminal.echo("Bouncer ready [bouncer]");
    }

    function onTerminalInput(command, term) {
        var result = context.run(command);
        term.echo(result);
    }

    function initBouncer() {
        var canvas = document.querySelector("#map"),
            map = new BouncerMap(canvas),
            bouncer = new Bouncer();
        context = new BouncerContext(bouncer, map);
        context.loadMapData("./data/demo_map.json", onBouncerReady);
    }

    function initTerminal() {
        $("#repl-terminal").terminal(onTerminalInput, {
            prompt: "> ",
            greetings: "",
            focus: true,
            completion: ["bouncer", "bouncer.turnLeft()", "bouncer.move()", "bouncer.isFrontClear"],
            onInit: function (term) {
                terminal = term;
            }
        });
    }

    function init() {
        initTerminal();
        initBouncer();
    }

    return {
        init: init
    };
}());
