import Ember from 'ember';
import layout from '../templates/components/e-modal';

export default Ember.Component.extend({
  layout,

  tagName: 'div',
  classNames: ['modal'],
  classNameBindings: ['off', 'opened', 'basic'],

  off: true,
  opened: false,
  basic: false,
  dimmerDismiss: true,

  bind: null,

  _resolve: null,
  _reject: null,

  actions: {
    close: function(succeeded) {
      if (succeeded) {
        const resolve = this.get('_resolve');
        if (resolve) {
          const queryResults = this.get('element').querySelectorAll('.data');
          const dataNodes = Array.prototype.slice.call(queryResults);
          let dataArr = [];

          dataNodes.forEach((node) => {
            const attribute = node.getAttribute('data-attr');
            if (attribute) {
              dataArr.push(node[attribute]);
            } else {
              dataArr.push(node);
            }
          });

          resolve({
            success: true,
            message: 'Success',
            data: dataArr
          });
        }
      } else {
        const reject = this.get('_reject');
        if (reject) {
          reject({
            success: false,
            message: 'User dismissed the modal',
            data: []
          });
        }
      }

      this.set('opened', false);
      setTimeout(() => {
        this.set('off', true);
        document.documentElement.classList.remove('noscroll');
      }, 450);
    },

    open: function() {
      this.set('off', false);
      document.documentElement.classList.add('noscroll');
      setTimeout(() => {
        this.set('opened', true);
        this.get('element').focus();
      }, 10);
    }
  },

  keyDown(e) {
    const key = e.keyCode || e.which;
    if (key === 27) {
      this.send('close', false);
    }
  },

  open: function() {
    this.send('open');
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.set('_resolve', resolve);
      this.set('_reject', reject);
    });
  },

  didInsertElement: function() {
    const bindCallback = this.get('bind');

    this.get('element').setAttribute('tabindex', 1);
    if (bindCallback) {
      bindCallback(this);
    }
  },

  cancelClass: Ember.computed('basic', function() {
    const isBasic = this.get('basic');

    if (isBasic) {
      return 'white';
    }
    return 'black';
  }),

  basicClass: Ember.computed('basic', function() {
    const isBasic = this.get('basic');

    if (isBasic) {
      return 'basic';
    }
    return '';
  })
});
