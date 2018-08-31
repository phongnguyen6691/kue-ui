'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    babel: {
      sourceMaps: 'inline'
    }
  });

  // disabled until https://github.com/yesmeck/jquery-jsonview/issues/26 is fixed
  // app.import('node_modules/jquery-jsonview/dist/jquery.jsonview.css');
  app.import('node_modules/jquery-jsonview/dist/jquery.jsonview.js');

  return app.toTree();
};
