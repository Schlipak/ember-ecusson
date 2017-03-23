import Ember from 'ember';
import layout from '../templates/components/e-tags-input';

export default Ember.Component.extend({
  layout,

  tagName: 'label',
  classNames: ['input', 'tags'],

  tags: Ember.A(),
  value: "",
  name: 'tagsValue',

  tagSeparator: ',',

  _backspaceCallback: null,

  didInsertElement() {
    const root = this.get('element');
    const input = root.querySelector('input[name="tagsInput"]');

    const backspaceCallback = (e) => {
      const key = e.keyCode || e.which;
      const input = root.querySelector('input[name="tagsInput"]');

      const tags = this.get('tags');
      const lastTag = tags.objectAt(tags.length - 1);

      if (key === 8 && input.value.length === 0) {
        if (lastTag) {
          if (lastTag.state === '') {
            Ember.set(lastTag, 'state', 'selected');
          } else if (lastTag.state !== 'dismissing') {
            Ember.set(lastTag, 'state', 'dismissing');
            setTimeout(() => {
              tags.removeAt(tags.length - 1);
            }, 250);
          }
        }
      } else {
        if (lastTag) {
          Ember.set(lastTag, 'state', '');
        }
      }
    };

    input.addEventListener('keydown', backspaceCallback);
    this.set('_backspaceCallback', backspaceCallback);
  },

  willDestroyElement() {
    const root = this.get('element');
    const input = root.querySelector('input[name="tagsInput"]');
    const backspaceCallback = this.get('_backspaceCallback');

    if (backspaceCallback) {
      input.removeEventListener('keydown', backspaceCallback);
    }
  },

  _setupTagsFromValue: Ember.on('init', function() {
    const tags = this.get('tags');
    const value = this.get('value');
    
    if (value) {
      const tagList = value.split(',');
      (tagList || []).forEach((tag) => {
        tags.pushObject({
          label: tag.trim(),
          state: ''
        });
      });
    }
  }),

  actions: {
    checkNewTag: function() {
      const root = this.get('element');
      const input = root.querySelector('input[name="tagsInput"]');
      const tagSeparator = this.get('tagSeparator');
      let tags = this.get('tags');

      let text = input.value;
      let reg = new RegExp(`^.+${tagSeparator}$`);

      if (text.match(reg) && tags) {
        text = text.slice(0, -1);
        tags.pushObject({
          label: text,
          state: ''
        });
        input.value = '';
      }
    },

    remove: function(index) {
      let tags = this.get('tags');

      if (tags) {
        Ember.set(tags[index], 'state', 'dismissing');
        setTimeout(() => {
          tags.removeAt(index);
        }, 400);
      }
    }
  },

  concatTags: Ember.computed('tags.[]', function() {
    let tags = this.get('tags');
    let labels = [];

    if (tags) {
      tags.forEach((tag) => {
        labels.push(tag.label);
      });
    }

    return (labels || []).join(', ');
  })
});
