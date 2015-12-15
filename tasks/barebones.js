module.exports = function (grunt) {
    "use strict";

    var defaults,
        jit,
        localConfig,
        merge,
        stacheConfig;

    /**
     * Merges two objects into one.
     * https://github.com/yeikos/js.merge
     */
    merge = require('merge');

    /**
     * JIT (Just In Time) plugin loader for Grunt.
     * https://github.com/shootaroo/jit-grunt
     */
    jit = require('jit-grunt');

    // Plugin defaults.
    defaults = {
        stache: {
            dir: 'node_modules/stache-barebones/',
            config: {},
            configFile: 'stache.yml'
        },
        clean: {
            build: {
                src: ['dist/']
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
                        cwd: 'src/pages/',
                        dest: 'dist/',
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
                        cwd: 'src/styles/',
                        src: ['*.scss'],
                        dest: 'dist/assets/styles/',
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
                    base: 'dist'
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
                    'newer:assemble'
                ]
            }
        }
    };

    /**
     * Retrieve and compile the appropriate YAML files and load it into
     * the plugin defaults.
     */
    stacheConfig = grunt.file.readYAML(defaults.stache.dir + defaults.stache.configFile);
    localConfig = grunt.file.readYAML(defaults.stache.configFile);
    defaults.stache.config = merge(stacheConfig, localConfig);
    grunt.config.merge(defaults);

    // Load NPM tasks dynamically.
    jit(grunt)({
        pluginsRoot: defaults.stache.dir + 'node_modules/'
    });

    // Grunt tasks.
    grunt.registerTask('serve', [
        //'clean',
        'newer:assemble',
        'newer:sass',
        'connect',
        'watch'
    ]);

};
