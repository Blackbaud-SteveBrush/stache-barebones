"use strict";
module.exports = function (grunt) {

    /**
     * Merges two objects into one.
     * https://github.com/yeikos/js.merge
     */
    var merge = require('merge');

    /**
     * JIT (Just In Time) plugin loader for Grunt.
     * https://github.com/shootaroo/jit-grunt
     */
    var jit = require('jit-grunt');

    // Plugin defaults.
    var defaults = {
        stache: {
            dir: 'node_modules/stache-barebones/',
            config: {},
            configFile: 'stache.yml'
        },
        clean: {
            build: {
                src: ['build/']
            }
        },
        assemble: {
            options: {
                layout: 'default',
                layoutdir: '<%= stache.dir %>src/layouts/',
                layoutext: '.hbs'
            },
            default: {
                options: {},
                files: [
                    {
                        expand: true,
                        cwd: 'content/pages/',
                        dest: 'build/',
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
                files: [
                    {
                        expand: true,
                        cwd: 'content/styles/',
                        src: ['*.scss'],
                        dest: 'build/assets/styles/',
                        ext: '.css'
                    }
                ]
            }
        },
        connect: {
            dev: {
                options: {
                    port: 4000,
                    livereload: 4100,
                    base: 'build'
                }
            }
        },
        watch: {
            options: {
                livereload: 4100
            },
            stache: {
                files: [
                    '<%= stache.dir %>src/**/*.*',
                ],
                tasks: [
                    'assemble'
                ]
            }
        }
    };

    /**
     * Retrieve and compile the appropriate YAML files and load it into
     * the plugin defaults.
     */
    var stacheConfig = grunt.file.readYAML(defaults.stache.dir + defaults.stache.configFile);
    var localConfig = grunt.file.readYAML(defaults.stache.configFile);
    defaults.stache.config = merge(stacheConfig, localConfig);
    grunt.config.merge(defaults);

    // Load NPM tasks dynamically.
    jit(grunt)({
        pluginsRoot: defaults.stache.dir + 'node_modules/'
    });

    // Grunt tasks.
    grunt.registerTask('serve', [
        'clean',
        'assemble',
        'sass',
        'connect',
        'watch'
    ]);

};
