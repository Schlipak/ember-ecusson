import Ember from 'ember';
import layout from '../templates/components/e-dropdown';

export default Ember.Component.extend({
  layout,

  sort: true,
  options: [],
  selectedOption: null,

  open: false,
  top: false,

  actions: {
    toggle: function() {
      const state = this.get('open');

      this.set('open', !state);
      this.send('_updatePosition');
    },

    close: function() {
      this.set('open', false);
      this.send('_updatePosition');
    },

    onOptionSelected: function(opt) {
      this.set('selectedOption', opt);
      this.send('close');
    },

    _sortOptions: function() {
      if (!this.get('sort')) {
        return;
      }

      let options = this.get('options');
      options = JSON.parse(JSON.stringify(options));

      options.sort((a, b) => {
        if (a.label < b.label) {
          return -1;
        }
        if (a.label > b.label) {
          return 1;
        }
        return 0;
      });

      this.set('options', options);
    },

    _updatePosition: function() {
      const open = this.get('open');

      const root = this.get('element');
      const rect = root.getBoundingClientRect();

      const height = window.innerHeight;

      const spaceUp = rect.top;
      const spaceDown = height - (rect.top + rect.height);

      if (open) {
        this.set('top', spaceUp > spaceDown);
      }
    },
  },

  selectedOptionLabel: Ember.computed('selectedOption', function() {
    const opt = this.get('selectedOption');

    if (!opt) {
      return '';
    }
    return opt.label;
  }),

  selectedOptionValue: Ember.computed('selectedOption', function() {
    const opt = this.get('selectedOption');

    if (!opt) {
      return '';
    }
    return opt.value;
  }),

  didInsertElement: function() {
    this.send('_sortOptions');

    const root = this.get('element');

    document.addEventListener('click', (e) => {
      const target = e.target;
      let currentNode = target;

      while (!!currentNode && currentNode !== root) {
        currentNode = currentNode.parentNode;
      }

      if (currentNode !== root) {
        this.send('close');
      }
    });
  },

  openClass: Ember.computed('open', function() {
    const state = this.get('open');

    if (state) {
      return 'open';
    }
    return '';
  }),

  topClass: Ember.computed('top', function() {
    const state = this.get('top');

    if (state) {
      return 'top';
    }
    return '';
  }),

  caretClass: Ember.computed('top', function() {
    const state = this.get('top');

    if (state) {
      return 'fa-caret-up';
    }
    return 'fa-caret-down';
  })
});
