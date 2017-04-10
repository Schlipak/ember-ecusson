/* jshint node: true */
'use strict';

const Funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');

const STYLESHEETS_URIS = [
  'https://fonts.googleapis.com/css?family=Merriweather+Sans:400,700|Merriweather:400,400i,700,700i|Expletus+Sans|Lato:400,700|Fira+Mono',
  'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
  'assets/dropzone.min.css',
  'assets/atom-one-light.css'
];

const JAVASCRIPTS_URIS = [
  'assets/dropzone.min.js',
  'assets/highlight.pack.js'
]

module.exports = {
  name: 'ember-ecusson',

  contentFor: function(type, config) {
    if (type == 'head') {
      let data = "";

      STYLESHEETS_URIS.forEach((uri) => {
        data += `<link rel="stylesheet" href="${uri}">\n`
      });

      return data;
    } else if (type === 'body-footer') {
      let data = "";

      JAVASCRIPTS_URIS.forEach((uri) => {
        data += `<script type="application/javascript" src="${uri}" defer></script>\n`
      });

      return data;
    }
  },

  treeForPublic: function(tree) {
    let assetsTree = new Funnel('public');
    return mergeTrees([tree, assetsTree], {
      overwrite: true
    });
  }
};
