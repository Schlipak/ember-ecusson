import Ember from 'ember';
import layout from '../templates/components/e-radio';

export default Ember.Component.extend({
  layout,

  tagName: 'label',
  classNames: ['radio'],

  checked: false,
  disabled: false,

  name: 'ecusson-radio-default',
  icon: 'fa-circle',

  disabledClass: function() {
    const state = this.get('disabled');
    if (state) {
      return "disabled";
    }
    return "";
  }.property('disabled')
});
