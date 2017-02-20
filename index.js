/* jshint node: true */
'use strict';

const STYLESHEETS_URIS = [
  'https://fonts.googleapis.com/css?family=Merriweather+Sans:400,700|Merriweather:400,700|Expletus+Sans|Lato:400,700|Fira+Mono',
  'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
];

module.exports = {
  name: 'ember-ecusson',

  contentFor: function(type, config) {
    if (type == 'head') {
      let links = "";
      STYLESHEETS_URIS.forEach((uri) => {
        links += `<link rel="stylesheet" href="${uri}">\n`
      });
      return links;
    }
  }
};
