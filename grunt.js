/**
 * This file is used to build Angular UI Handsontable from `src/*`
 *
 * Installation:
 * 1. Install Grunt (`npm install -g grunt`)
 *
 * Build:
 * Execute `grunt` from root directory of this directory (where grunt.js is)
 * To execute automatically after each change, execute `grunt --force default watch`
 *
 * Result:
 * building Angular UI Handsontable will create files:
 *  - dist/angular-ui-handsontable.full.js
 *  - dist/angular-ui-handsontable.full.css
 *
 * See https://github.com/cowboy/grunt for more information about Grunt
 */
module.exports = function (grunt) {
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/**\n' +
        ' * <%= pkg.name %> <%= pkg.version %>\n' +
        ' * \n' +
        ' * Date: <%= (new Date()).toString() %>\n' +
        '*/'
    },
    concat: {
      full_js: {
        src: [
          '<banner>',
          'src/angular-ui-handsontable.js',
          'src/3rdparty/handsontable/jquery.handsontable.full.js'
        ],
        dest: 'dist/angular-ui-handsontable.full.js'
      },
      full_css: {
        src: [
          '<banner>',
          'src/3rdparty/handsontable/jquery.handsontable.full.css'
        ],
        dest: 'dist/angular-ui-handsontable.full.css'
      }
    },
    watch: {
      files: ['<config:concat.full_js.src>', '<config:concat.full_css.src>'],
      tasks: 'concat'
    }
  });

  // Default task.
  grunt.registerTask('default', 'concat');
};