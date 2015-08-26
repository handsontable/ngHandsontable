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
        url: getUrl('nudumu/4'),
        title: 'Simple example',
        description: 'Simple example'
      },
      'full-featured-demo': {
        url: getUrl('xezevi/3'),
        title: 'Full featured demo',
        description: 'Full featured demo'
      }
    },
    'configuration': {
      'configuration-by-object': {
        url: getUrl('getazu/3'),
        title: 'By `settings` object',
        description: 'Configuration by setting `settings` object'
      },
      'configuration-declarative-way': {
        url: getUrl('jupeme/3'),
        title: 'In declarative way',
        description: 'Configuration in declarative way'
      }
    },
    'columns': {
      'add-remove-column-ng-repeat': {
        url: getUrl('muluto/4'),
        title: 'Add/Remove (ng-repeat)',
        description: 'Add/Remove columns using ng-repeat'
      },
      'add-remove-column-by-attr': {
        url: getUrl('xayeru/3'),
        title: 'Add/Remove (`columns` attribute)',
        description: 'Add/Remove columns using `columns` attribute'
      }
    },
    'binding': {
      'data-binding': {
        url: getUrl('lupile/4'),
        title: 'Data binding',
        description: 'Data binding'
      },
      'settings-binding': {
        url: getUrl('xaqasi/3'),
        title: 'Table settings binding',
        description: 'Table settings binding'
      }
    },
    'callbacks': {
      'callbacks-by-object': {
        url: getUrl('nayito/5', 'html,js,console,output'),
        title: 'By `settings` object',
        description: 'Listening callbacks using `settings` object'
      },
      'callbacks-declarative-way': {
        url: getUrl('pucale/4', 'html,js,console,output'),
        title: 'In declarative way',
        description: 'Listening callbacks in declarative way'
      }
    },
    'plugins': {
      'copy-paste-context-menu': {
        url: getUrl('zohoge/2'),
        title: 'Enable copy/paste in context menu',
        description: 'Enable copy/paste in context menu'
      }
    },
    'other': {
      'access-to-instance': {
        url: getUrl('fovoxu/4'),
        title: 'Access to Handsontable instance',
        description: 'Access to Handsontable instance'
      },
      'custom-validator': {
        url: getUrl('qoweju/3'),
        title: 'Custom validator',
        description: 'Custom validator'
      },
      'custom-renderer': {
        url: getUrl('locome/2'),
        title: 'Custom renderer',
        description: 'Custom renderer'
      }
    }
  };
}());
