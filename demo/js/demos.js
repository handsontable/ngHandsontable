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
        url: getUrl('nudumu/6'),
        title: 'Simple example',
        description: 'Simple example'
      },
      'full-featured-demo': {
        url: getUrl('xezevi/4'),
        title: 'Full featured demo',
        description: 'Full featured demo'
      }
    },
    'configuration': {
      'configuration-by-object': {
        url: getUrl('getazu/4'),
        title: 'By `settings` object',
        description: 'Configuration by setting `settings` object'
      },
      'configuration-declarative-way': {
        url: getUrl('jupeme/4'),
        title: 'In declarative way',
        description: 'Configuration in declarative way'
      }
    },
    'columns': {
      'add-remove-column-ng-repeat': {
        url: getUrl('muluto/5'),
        title: 'Add/Remove (ng-repeat)',
        description: 'Add/Remove columns using ng-repeat'
      },
      'add-remove-column-by-attr': {
        url: getUrl('xayeru/4'),
        title: 'Add/Remove (`columns` attribute)',
        description: 'Add/Remove columns using `columns` attribute'
      }
    },
    'binding': {
      'data-binding': {
        url: getUrl('lupile/5'),
        title: 'Data binding',
        description: 'Data binding'
      },
      'settings-binding': {
        url: getUrl('xaqasi/4'),
        title: 'Table settings binding',
        description: 'Table settings binding'
      }
    },
    'callbacks': {
      'callbacks-by-object': {
        url: getUrl('nayito/7', 'html,js,console,output'),
        title: 'By `settings` object',
        description: 'Listening callbacks using `settings` object'
      },
      'callbacks-declarative-way': {
        url: getUrl('pucale/5', 'html,js,console,output'),
        title: 'In declarative way',
        description: 'Listening callbacks in declarative way'
      }
    },
    'plugins': {
      'copy-paste-context-menu': {
        url: getUrl('zohoge/3'),
        title: 'Enable copy/paste in context menu',
        description: 'Enable copy/paste in context menu'
      }
    },
    'pagination': {
      'rows-pagination': {
        url: getUrl('rorozo/1'),
        title: 'Paginate rows',
        description: 'Paginate rows'
      },
      'columns-pagination': {
        url: getUrl('kolerig/1'),
        title: 'Paginate columns',
        description: 'Paginate columns'
      },
    },
    'other': {
      'access-to-instance': {
        url: getUrl('fovoxu/5'),
        title: 'Access to Handsontable instance',
        description: 'Access to Handsontable instance'
      },
      'custom-validator': {
        url: getUrl('qoweju/4'),
        title: 'Custom validator',
        description: 'Custom validator'
      },
      'custom-renderer': {
        url: getUrl('locome/3'),
        title: 'Custom renderer',
        description: 'Custom renderer'
      },
    },
    'PRO': {
      'collapsing-columns-with-nested-headers': {
        url: getUrl('wilani/4'),
        title: 'Collapsing columns with nested headers',
        description: 'Create a nested, hierarchical structure of headers with expandable and collapsible columns'
      },
      'filtering-simple': {
        url: getUrl('fijida/4'),
        title: 'Data filtering (simple example)',
        description: 'Display rows that meet your criteria and hide the rest'
      },
      'filtering-external-inputs': {
        url: getUrl('rewefa/10'),
        title: 'Data filtering (external inputs)',
        description: 'Display rows that meet your criteria and hide the rest'
      },
      'hiding-columns': {
        url: getUrl('wapufa/3'),
        title: 'Hiding columns',
        description: 'Hide specific columns and show the rest'
      },
      'hiding-rows': {
        url: getUrl('roximi/4'),
        title: 'Hiding rows',
        description: 'Hide specific rows and show the rest'
      },
    },
  };
}());
