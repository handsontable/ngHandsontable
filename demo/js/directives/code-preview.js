(function() {
  'use strict';

  var
    modules = require('modules'),

    DIRECTIVE_NAME = 'codePreview';

  CodePreview.$inject = [];


  function CodePreview() {
    return {
      restrict: 'EA',
      templateUrl: 'js/directives/code-preview.html',
      scope: {
        title: '='
      },
      link: function(scope, element, attr) {
        var iframe = element.find('iframe');

        iframe[0].src = attr[DIRECTIVE_NAME];
        iframe[0].style.minHeight = (window.innerHeight - iframe[0].getBoundingClientRect().top - 60) + 'px';
      }
    };
  }


  modules('app').register(function(module) {
    module.directive(DIRECTIVE_NAME, CodePreview);
  });
}());
