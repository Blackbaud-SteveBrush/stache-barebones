"use strict";

module.exports = function (grunt) {

    var defaults = {
        assemble: {
            options: {
                layoutdir: 'node_modules/stache-barebones/src/layouts/',
                layoutext: '.hbs',
                layout: 'layout-default',
            },
            default: {
                options: {},
                files: [
                    {
                        expand: true,
                        cwd: 'content/',
                        dest: 'serve/',
                        src: [
                            '**/*.md',
                            '**/*.hbs',
                            '**/*.html'
                        ]
                    }
                ]
            }
        },
        sass: {
            options: {
                style: 'compressed'
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'node_modules/stache-barebones/src/styles',
                    src: ['*.scss'],
                    dest: 'serve/dist/styles/',
                    ext: '.css'
                }]
            }
        },
        connect: {
            dev: {
                options: {
                    port: 4000,
                    livereload: 4100,
                    base: 'serve'
                }
            }
        },
        watch: {
            options: {
                livereload: 4100
            },
            stache: {
                files: [
                    'node_modules/stache-barebones/src/**/*.*',
                ],
                tasks: [
                    'assemble'
                ]
            }
        }
    };

    grunt.config.merge(defaults);

    grunt.registerTask('serve', [
        'assemble',
        'sass',
        'connect',
        'watch'
    ]);

    require('jit-grunt')(grunt)({
        pluginsRoot: 'node_modules/stache-barebones/node_modules/'
    });

};
