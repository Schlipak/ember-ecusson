import Ember from 'ember';
import layout from '../templates/components/e-checkbox';

export default Ember.Component.extend({
  layout,
  
  tagName: 'label',
  classNames: ['checkbox'],

  checked: false,
  disabled: false,

  icon: 'fa-check',

  disabledClass: function() {
    const state = this.get('disabled');
    if (state) {
      return "disabled";
    }
    return "";
  }.property('disabled'),

  click: function() {
    const state = this.get('checked');
    this.set('checked', !state);
  }.property('checked')
});
