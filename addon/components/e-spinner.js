import Ember from 'ember';
import layout from '../templates/components/e-spinner';

export default Ember.Component.extend({
  layout,

  tagName: 'div',
  classNames: ['spinner vertical inline container main-center cross-center'],
  classNameBindings: ['done'],

  showLabel: true,
  label: "Loading",
  doneLabel: "Done",

  done: false,

  actions: {
    finish: function() {
      const root = this.get('element');
      const circle = root.getElementsByTagName('circle')[0];

      const style = window.getComputedStyle(circle);

      const currentOffset = parseFloat(style.getPropertyValue('stroke-dashoffset'));
      const transform = style.getPropertyValue("-webkit-transform") ||
                        style.getPropertyValue("-moz-transform") ||
                        style.getPropertyValue("-ms-transform") ||
                        style.getPropertyValue("-o-transform") ||
                        style.getPropertyValue("transform");

      const matrixValues = transform.split('(')[1].split(')')[0].split(',');
      const a = matrixValues[0];
      const b = matrixValues[1];

      const angle = Math.round(Math.atan2(b, a) * (180/Math.PI));

      circle.style.strokeDashoffset = currentOffset;
      circle.style.transform = `rotate(${angle}deg)`;

      setTimeout(() => {
        circle.style.strokeDashoffset = 0;
      }, 10);

      this.set('done', true);
    },

    start: function() {
      const root = this.get('element');
      const circle = root.getElementsByTagName('circle')[0];

      circle.style.strokeDashoffset = "";
      circle.style.transform = "";
      this.set('done', false);
    }
  },

  _currentLabel: Ember.computed('done', function() {
    if (this.get('done')) {
      return this.get('doneLabel');
    }
    return this.get('label');
  }),

  click() {
    if (this.get('done')) {
      this.send('start');
    } else {
      this.send('finish');
    }
  }
});
