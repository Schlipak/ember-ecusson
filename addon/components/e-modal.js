import Ember from 'ember';
import layout from '../templates/components/e-modal';

export default Ember.Component.extend({
  layout,

  tagName: 'div',
  classNames: ['modal'],
  classNameBindings: ['off', 'opened'],

  off: true,
  opened: false,

  bind: null,

  _resolve: null,
  _reject: null,

  actions: {
    close: function(succeeded) {
      if (succeeded) {
        const resolve = this.get('_resolve');
        if (resolve) {
          const dataNodes = this.get('element').querySelectorAll('.data');
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
      }, 450);
    },

    open: function() {
      this.set('off', false);
      setTimeout(() => {
        this.set('opened', true);
      }, 10);
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
    if (bindCallback) {
      bindCallback(this);
    }
  }
});
