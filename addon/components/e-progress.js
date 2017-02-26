import Ember from 'ember';
import layout from '../templates/components/e-progress';

export default Ember.Component.extend({
  layout,

  tagName: '',

  maxValue: 100,
  value: 0,
  completed: false,
  indeterminate: false,

  color: '',
  completedColor: 'green',

  text: 'Loading',
  indeterminateText: 'Waiting for server response...',
  completedText: 'Done',
  showLabel: true,

  _destroyed: false,

  bindDataSource: null,

  _checkDataIntegrity: Ember.on('didInsertElement', function() {
    const value = this.get('value');
    const maxValue = this.get('maxValue');
    const indeterminate = this.get('indeterminate');

    if (value < 0) {
      this.set('value', 0);
    }
    if (value > maxValue) {
      this.set('value', maxValue);
    }

    if (!indeterminate) {
      this.setProgress(this.get('value'));
    }
  }),

  didInsertElement: function() {
    const dataSourceCallback = this.get('bindDataSource');
    if (dataSourceCallback) {
      dataSourceCallback(this);
    }
  },

  willDestroyElement: function() {
    this.set('_destroyed', true);
  },

  indeterminateClass: Ember.computed('indeterminate', function() {
    const state = this.get('indeterminate');
    if (state) {
      return 'indeterminate';
    }
    return '';
  }),

  currentColor: Ember.computed('completed', 'indeterminate', 'color', 'completedColor',
    function() {
      if (this.get('completed') && !this.get('indeterminate')) {
        return this.get('completedColor');
      }
      return this.get('color');
    }
  ),

  completedClass: Ember.computed('completed', 'indeterminate', function() {
    if (this.get('completed') && !this.get('indeterminate')) {
      return 'completed';
    }
    return '';
  }),

  currentText: Ember.computed('completed', 'indeterminate', function() {
    if (this.get('indeterminate')) {
      return this.get('indeterminateText');
    }
    if (this.get('completed')) {
      return this.get('completedText');
    }
    return this.get('text');
  }),

  widthStyle: Ember.computed('min-width', 'value', function() {
    const value = this.get('value');
    const width = (value / this.get('maxValue')) * 100;

    return Ember.String.htmlSafe(`min-width: ${width}%`);
  }),

  percent: function() {
    const value = this.get('value');
    const maxValue = this.get('maxValue');

    return ~~((value / maxValue) * 100);
  },

  percentString: Ember.computed('value', function() {
    const percent = this.percent();

    return `${percent}%`;
  }),

  stepsString: Ember.computed('value', function() {
    const step = this.get('value');
    const total = this.get('maxValue');

    return `${step}/${total}`;
  }),

  setProgress: function(newVal) {
    if (this.get('_destroyed')) {
      return;
    }

    const state = this.get('indeterminate');
    if (state) {
      this.set('indeterminate', !state);
    }

    let sanitized = Math.max(Math.min(newVal, this.get('maxValue')), 0);
    if (isNaN(sanitized)) {
      sanitized = 0;
    }

    this.set('value', sanitized);
    this.set('completed', sanitized >= this.get('maxValue'));
  },

  increment: function(amount) {
    this.setProgress(this.get('value') + amount);
  },

  decrement: function(amount) {
    this.setProgress(this.get('value') - amount);
  },
});
