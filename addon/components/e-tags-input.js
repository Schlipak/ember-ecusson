import Ember from 'ember';
import layout from '../templates/components/e-tags-input';

export default Ember.Component.extend({
  layout,

  tagName: 'label',
  classNames: ['input', 'tags'],

  tags: Ember.A(),

  actions: {
    checkNewTag: function() {
      const root = this.get('element');
      const input = root.querySelector('input[type="text"]');
      let tags = this.get('tags');

      let text = input.value;

      if (text.match(/^.+,$/) && tags) {
        text = text.slice(0, -1);
        tags.pushObject(text);
        input.value = '';
      }
    },

    remove: function(index) {
      let tags = this.get('tags');

      if (tags) {
        tags.removeAt(index);
      }
    }
  }
});
