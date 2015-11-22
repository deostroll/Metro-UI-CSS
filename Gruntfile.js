module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);
    var path = require('path');
    var autoprefixer = require('autoprefixer-core');

    var config = {
      path: 'web/',
      port: 2586
    };

    var bower = grunt.file.readJSON('bower.json');

    grunt.initConfig({
        web: config,
        bower: bower,
        pkg: grunt.file.readJSON('package.json'),

        banner: '/*!\n' +
                ' * Metro UI CSS v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
                ' * Copyright 2012-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
                ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
                ' */\n',

        requirejs_banner: "\n(function( factory ) {\n"+
                          "    if ( typeof define === 'function' && define.amd ) {\n" +
                          "        define([ 'jquery' ], factory );\n"+
                          "    } else {\n" +
                          "        factory( jQuery );\n"+
                          "    }\n"+
                          "}(function( jQuery ) { \n'use strict';\n\nvar $ = jQuery;\n\n",

        clean: {
            build: ['build/js', 'build/css', 'build/fonts'],
            docs: ['docs/css/metro*.css', 'docs/js/metro*.js'],
            compiled_html: ['.compiled_html'],
            web: ['web']
        },

        concat: {
            options: {
                banner: '<%= banner %>' + '<%= requirejs_banner%>',
                footer: "\n\n return $.Metro.init();\n\n}));",
                stripBanners: true,
                process: function(src, filepath) {
                    return '// Source: ' + filepath + '\n' +
                        src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                }
            },
            metro: {
                src: [
                    'js/requirements.js',
                    'js/global.js',
                    'js/widget.js',
                    'js/initiator.js',
                    'js/utils/*.js',
                    'js/widgets/*.js'
                ],
                dest: 'build/js/<%= pkg.name %>.js'
            }
        },

        uglify: {
            options: {
                banner: '<%= banner %>',
                stripBanners: false,
                sourceMap: false
            },
            metro: {
                src: '<%= concat.metro.dest %>',
                dest: 'build/js/<%= pkg.name %>.min.js'
            }
        },

        less: {
            options: {
                paths: ['less'],
                strictMath: false
            },
            compileCore: {
                src: 'less/<%= pkg.name %>.less',
                dest: 'build/css/<%= pkg.name %>.css'
            },
            compileResponsive: {
                src: 'less/<%= pkg.name %>-responsive.less',
                dest: 'build/css/<%= pkg.name %>-responsive.css'
            },
            compileRtl: {
                src: 'less/<%= pkg.name %>-rtl.less',
                dest: 'build/css/<%= pkg.name %>-rtl.css'
            },
            compileSchemes: {
                src: 'less/<%= pkg.name %>-schemes.less',
                dest: 'build/css/<%= pkg.name %>-schemes.css'
            },
            compileFont: {
                src: 'less/<%= pkg.name %>-icons.less',
                dest: 'build/css/<%= pkg.name %>-icons.css'
            }
        },

        postcss: {
            options: {
                processors: [
                    autoprefixer({ browsers: ['> 5%'] })
                ]
            },
            dist: { src: 'build/css/*.css' }
        },

        cssmin: {
            minCore: {
                src: 'build/css/<%= pkg.name %>.css',
                dest: 'build/css/<%= pkg.name %>.min.css'
            },
            minRtl: {
                src: 'build/css/<%= pkg.name %>-rtl.css',
                dest: 'build/css/<%= pkg.name %>-rtl.min.css'
            },
            minResponsive: {
                src: 'build/css/<%= pkg.name %>-responsive.css',
                dest: 'build/css/<%= pkg.name %>-responsive.min.css'
            },
            minSchemes: {
                src: 'build/css/<%= pkg.name %>-schemes.css',
                dest: 'build/css/<%= pkg.name %>-schemes.min.css'
            },
            minFont: {
                src: 'build/css/<%= pkg.name %>-icons.css',
                dest: 'build/css/<%= pkg.name %>-icons.min.css'
            }
        },

        copy: {
            build_font: {
                src: 'fonts/*',
                dest: 'build/',
                expand: true
            },
            docs_css_core: {
                src: 'build/css/<%= pkg.name %>.css',
                dest: 'docs/css/<%= pkg.name %>.css'
            },
            docs_css_rtl: {
                src: 'build/css/<%= pkg.name %>-rtl.css',
                dest: 'docs/css/<%= pkg.name %>-rtl.css'
            },
            docs_css_responsive: {
                src: 'build/css/<%= pkg.name %>-responsive.css',
                dest: 'docs/css/<%= pkg.name %>-responsive.css'
            },
            docs_css_schemes: {
                src: 'build/css/<%= pkg.name %>-schemes.css',
                dest: 'docs/css/<%= pkg.name %>-schemes.css'
            },
            docs_css_font: {
                src: 'build/css/<%= pkg.name %>-icons.css',
                dest: 'docs/css/<%= pkg.name %>-icons.css'
            },
            docs_js: {
                src: 'build/js/<%= pkg.name %>.js',
                dest: 'docs/js/<%= pkg.name %>.js'
            },
            //copy all web assets
            web: {
              src: '<%= bower.main %>',
              dest: '<%= web.path %>'
            },
            //copy our working js file
            htmljs: {
              files: [
                {
                  expand: true,
                  cwd: 'html',
                  dest: '<%= web.path %>',
                  src: 'main.js'
                }
              ]
            },
            //copy the built js file
            buildjs: {
              src: 'build/js/metro.js',
              dest: '<%= web.path %>'
            }
        },

        replace: {

        },

        watch: {
            scripts: {
                files: ['js/*.js', 'js/utils/*.js', 'js/widgets/*js'],
                tasks: ['concat', 'uglify', 'copy:docs_js']
            },
            //watch - files in web folder
            web: {
              files: ['<%= web.path %>/**/*.{html,js}'],
              options: {
                livereload: true
              }
            },
            //watch - changes in our working js file
            js: {
              files: [ 'html/main.js'],
              tasks: [ 'copy:htmljs' ]
            },
            //watch changes in our working html file
            html : {
              files: [ 'html/index.html'],
              tasks: ['metrofy']
            },
            //watch - changes in the built metro.js file
            build: {
              files: ['js/**/*.js'],
              tasks: ['concat', 'copy:buildjs']
            }
        },
        //serve it up
        connect: {
          web: {
            options: {
              livereload: true,
              port: '<%= web.port %>',
              middleware: function(connect){
                var app = connect();
                var _static = require('./node_modules/grunt-contrib-connect/node_modules/serve-static');
                app.use('/bower_components', _static('./bower_components'))
                app.use('/', _static('web'));
                return [ app ];
              },
              open: true
            },
          }
        },
        wiredep: {
          html: {
            src: 'html/index.html'
          }
        }
    });

    grunt.registerTask('default', [
        'clean', 'concat', 'uglify', 'less', 'postcss', 'cssmin', 'copy', 'watch'
    ]);

    grunt.registerTask('build',['clean', 'concat', 'uglify', 'less', 'postcss', 'cssmin', 'copy'] );

    // grunt.registerTask('build', [
    //     'clean', 'concat', 'uglify', 'less', 'postcss', 'cssmin', 'copy', 'watch'
    // ]);

    grunt.registerTask('serve',[
      'clean',
      'concat',
      'uglify',
      'less',
      'postcss',
      'cssmin',
      'copy',
      'metrofy',
      'connect',
      'watch'
    ]);

    grunt.registerTask('metrofy',function() {
      var file = grunt.file.read('html/index.html');
      var lines = file.split('\n');
      var strings = {
        css: '<!-- metro:css -->',
        js: '<!-- metro:js -->'
      };
      // console.log(lines[0]);
      var result = [];
      var cssDone = false, allDone = false;
      lines.forEach(function(ln){
        if(!allDone) {
          if(!cssDone) {
            if(ln.indexOf(strings.css) > -1) {
                var cssFiles = bower.main.filter(function(s){ return s.indexOf('.css') > -1; });
                result.push(ln);
                cssFiles.forEach(function(css){
                  var script = '<link rel="stylesheet" href="' + css + '"/>';
                  result.push(ln.replace(strings.css, script));
                });
                cssDone = true;
                return;
            }
          }
          else {
            //js files
            if(ln.indexOf(strings.js) > -1) {
              var jsFiles = bower.main.filter(function(s){ return s.indexOf('.js') > -1; });
              result.push(ln);
              jsFiles.forEach(function(js){
                var script = '<script type="text/javascript" src="' + js + '"></script>';
                result.push(ln.replace(strings.js, script));
              });
              allDone = true;
              return;
            }
          }
        }
        result.push(ln);
      });
      // console.log(path.join)
      var writeFile = path.join(grunt.config('web').path, 'index.html');
      grunt.file.write(writeFile, result.join('\n'));
    });
};
