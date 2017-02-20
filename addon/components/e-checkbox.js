import Ember from 'ember';
import layout from '../templates/components/e-checkbox';

export default Ember.Component.extend({
  layout,

  tagName: 'label',
  classNames: ['checkbox'],

  checked: false,
  disabled: false,

  icon: 'fa-check',

  disabledClass: Ember.computed('disabled', function() {
    const state = this.get('disabled');
    if (state) {
      return "disabled";
    }
    return "";
  }),

  click: Ember.computed('checked', function() {
    const state = this.get('checked');
    this.set('checked', !state);
  })
});
