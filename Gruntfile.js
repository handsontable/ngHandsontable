/**
 * This file is used to build Angular UI Handsontable from `src/*`
 *
 * Installation:
 * 1. Install Grunt CLI (`npm install -g grunt-cli`)
 * 1. Install Grunt 0.4.0 and other dependencies (`npm install`)
 *
 * Build:
 * Execute `grunt` from root directory of this directory (where Gruntfile.js is)
 * To execute automatically after each change, execute `grunt --force default watch`
 *
 * Result:
 * building Angular UI Handsontable will create files:
 *  - dist/angular-ui-handsontable.full.js
 *  - dist/angular-ui-handsontable.full.css
 *  - dist/angular-ui-handsontable.full.min.js
 *  - dist/angular-ui-handsontable.full.min.css
 *
 * See http://gruntjs.com/getting-started for more information about Grunt
 */
module.exports = function (grunt) {
  var myBanner = '/**\n' +
    ' * <%= pkg.name %> <%= pkg.version %>\n' +
    ' * \n' +
    ' * Date: <%= (new Date()).toString() %>\n' +
    '*/\n\n';


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        banner: myBanner
      },
      full_js: {
        src: [
          'src/ie-shim.js',
          'src/angular-ui-handsontable.js',
          'bower_components/handsontable/dist/jquery.handsontable.full.js'
        ],
        dest: 'dist/angular-ui-handsontable.full.js'
      },
      full_css: {
        src: [
          'bower_components/handsontable/dist/jquery.handsontable.full.css'
        ],
        dest: 'dist/angular-ui-handsontable.full.css'
      }
    },
    uglify: {
      options: {
        banner: myBanner
      },
      "dist/angular-ui-handsontable.full.min.js": ["dist/angular-ui-handsontable.full.js" ]
    },
    cssmin: {
      options: {
        banner: myBanner
      },
      "dist/angular-ui-handsontable.full.min.css": ["dist/angular-ui-handsontable.full.css" ]
    },
    watch: {
      files: ['src/**/*', 'bower_components/**/*'],
      tasks: ['concat', 'uglify', 'cssmin']
    }
  });

  // Default task.
  grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);

  grunt.loadNpmTasks('grunt-css');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
};