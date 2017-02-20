import Ember from 'ember';
import layout from '../templates/components/e-toggle';

export default Ember.Component.extend({
  layout,

  tagName: 'div',
  classNames: ['toggle'],

  disabled: false,
  active: false,

  click: Ember.computed('active', function() {
    const disabled = this.get('disabled');
    const state = this.get('active');

    if (!disabled) {
      this.set('active', !state);
    }
  }),

  disabledClass: Ember.computed('disabled', function() {
    const state = this.get('disabled');
    if (state) {
      return "disabled";
    }
    return "";
  }),

  actions: {
    toggleClass: (params, e) => {
      let targetSelector = params.split(' ')[0];
      let className = params.split(' ')[1];

      let checked = e.target.checked;
      let target = document.querySelector(targetSelector);
      if (checked) {
        target.classList.add(className);
      } else {
        target.classList.remove(className);
      }
    }
  }
});
