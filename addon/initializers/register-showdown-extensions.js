// Showdown Markdown extentions

export function initialize() {
  const Showdown = window.showdown;
  if (!Showdown) {
    return;
  }

  Showdown.extension('fontAwesomeIcons', function() {
    return [{
      type: 'html',
      regex: /:([\w-]+):/g,
      replace: '<i class="icon fa fa-$1"></i>',
    }];
  });

  Showdown.extension('buttonLink', function() {
    return [{
      type: 'html',
      regex: /\{(.*)\}\(([\w\d\.\-\_\S]*)(?:\scolor=([\w-]*))?\)/g,
      replace: '<a href="$2" class="button $3">$1</a>',
    }];
  });

  Showdown.extension('outgoingButtonLink', function() {
    return [{
      type: 'html',
      regex: /\{(.*)\}\!\(([\w\d\.\-\_\S]*)(?:\scolor=([\w-]*))?\)/g,
      replace: '<a href="$2" class="button $3" target="_blank" rel="noopener noreferrer">$1</a>',
    }];
  });

  Showdown.extension('outgoingLink', function() {
    return [{
      type: 'html',
      regex: /\[(.*)\]\!\((.*)\)/g,
      replace: '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    }];
  });
}

export default {
  name: 'register-showdown-extensions',
  initialize
};
