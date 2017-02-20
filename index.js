/* jshint node: true */
'use strict';

const CONTENT_FOR_HEAD = '<link href="https://fonts.googleapis.com/css?family=Merriweather+Sans:400,700|Merriweather:400,700|Expletus+Sans|Lato:400,700|Fira+Mono" rel="stylesheet"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">';

module.exports = {
  name: 'ember-ecusson',

  contentFor: function(type, config) {
    if (type == 'head') {
      return CONTENT_FOR_HEAD;
    }
  }
};
