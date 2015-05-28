(function () {
    "use strict";
    /* global module */
    module.exports = function (grunt) {
        grunt.initConfig({
            pkg: grunt.file.readJSON("package.json"),
            eslint: {
                target: "src/js"
            },
            yuidoc: {
                compile: {
                    name: "<%= pkg.name %>",
                    description: "<%= pkg.description %>",
                    version: "<%= pkg.version %>",
                    url: "<%= pkg.homepage %>",
                    options: {
                        paths: "src/js",
                        outdir: "docs/"
                    }
                }
            },
            clean: ["dist"],
            concat: {
                options: {
                    separator: grunt.util.linefeed
                },
                dist: {
                    src: ["src/js/JSBouncer_Utilities.js", "src/js/JSBouncer_Map.js", "src/js/JSBouncer_Main.js"],
                    dest: "dist/bouncer.js"
                }
            },
            uglify: {
                target: {
                    files: {
                        "dist/bouncer.min.js": "dist/bouncer.js"
                    }
                }
            },
            cssmin: {
                target: {
                    files: [{
                        expand: true,
                        cwd: "src/css",
                        src: ["*.css", "!*.min.css"],
                        dest: "dist",
                        ext: ".min.css"
                    }]
                }
            },
            copy: {
                main: {
                    files: [
                        {
                            src: ["dist/bouncer.min.js"],
                            dest: "demo/js/libs/bouncer.min.js",
                            filter: "isFile"
                        },
                        {
                            src: ["dist/bouncer.min.css"],
                            dest: "demo/res/css/bouncer.min.css",
                            filter: "isFile"
                        }
                    ]
                }
            }
        });
        // dependencies
        grunt.loadNpmTasks("grunt-eslint");
        grunt.loadNpmTasks("grunt-contrib-clean");
        grunt.loadNpmTasks("grunt-contrib-yuidoc");
        grunt.loadNpmTasks("grunt-contrib-concat");
        grunt.loadNpmTasks("grunt-contrib-uglify");
        grunt.loadNpmTasks("grunt-contrib-cssmin");
        grunt.loadNpmTasks("grunt-contrib-copy");
        // tasks
        grunt.registerTask("default", ["eslint", "clean", "yuidoc", "concat", "uglify", "cssmin"]);
        grunt.registerTask("demo", ["default", "copy"]);
    };
}());
