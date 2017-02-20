/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-ecusson',

  included: function(app) {
  	app.import('app/styles/app.scss');
  	this._super.included.call(this, app);
  }
};
