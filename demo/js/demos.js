(function() {
  'use strict';

  var
    DEFAULT_TABS = 'html,js,output',
    BASE_URL = 'http://jsbin.com/{id}/embed?';

  function getUrl(id, tabs) {
    return BASE_URL.replace('{id}', id) + (tabs || DEFAULT_TABS);
  }

  module.exports = {
    'intro': {
      'simple-example': {
        url: getUrl('nudumu/2'),
        title: 'Simple example',
        description: 'Simple example'
      },
      'full-featured-demo': {
        url: getUrl('xezevi/2'),
        title: 'Full featured demo',
        description: 'Full featured demo'
      }
    },
    'configuration': {
      'configuration-by-object': {
        url: getUrl('getazu/2'),
        title: 'By `settings` object',
        description: 'Configuration by setting `settings` object'
      },
      'configuration-declarative-way': {
        url: getUrl('jupeme/2'),
        title: 'In declarative way',
        description: 'Configuration in declarative way'
      }
    },
    'columns': {
      'add-remove-column': {
        url: getUrl('muluto/2'),
        title: 'Add/Remove columns (ng-repeat)',
        description: 'Add/Remove columns using ng-repeat'
      }
    },
    'binding': {
      'data-binding': {
        url: getUrl('lupile/3'),
        title: 'Data binding',
        description: 'Data binding'
      },
      'settings-binding': {
        url: getUrl('xaqasi/2'),
        title: 'Table settings binding',
        description: 'Table settings binding'
      }
    },
    'callbacks': {
      'callbacks-by-object': {
        url: getUrl('nayito/4', 'html,js,console,output'),
        title: 'By `settings` object',
        description: 'Listening callbacks using `settings` object'
      },
      'callbacks-declarative-way': {
        url: getUrl('pucale/2', 'html,js,console,output'),
        title: 'In declarative way',
        description: 'Listening callbacks in declarative way'
      }
    },
    'plugins': {
      'copy-paste-context-menu': {
        url: getUrl('zohoge/1'),
        title: 'Enable copy/paste in context menu',
        description: 'Enable copy/paste in context menu'
      }
    },
    'other': {
      'access-to-instance': {
        url: getUrl('fovoxu/2'),
        title: 'Access to Handsontable instance',
        description: 'Access to Handsontable instance'
      },
      'custom-validator': {
        url: getUrl('qoweju/1'),
        title: 'Custom validator',
        description: 'Custom validator'
      },
      'custom-renderer': {
        url: getUrl('locome/1'),
        title: 'Custom renderer',
        description: 'Custom renderer'
      }
    }
  };
}());
