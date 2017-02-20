import Ember from 'ember';
import layout from '../templates/components/e-alert';

export default Ember.Component.extend({
  layout,

  tagName: 'div',
  classNames: ['alert'],
  classNameBindings: [
    'dismissing',
    'dismissed'
  ],

  destroyOnDismiss: true,

  didInsertElement: function() {
    // Set auto dismiss timeout
  },

  willDestroyElement: function() {
    this._super(...arguments);

    console.log("Delete me here");
  },

  actions: {
    dismiss: function() {
      if (this.get('dismissing') || this.get('dismissed')) {
        return;
      }

      this.set('dismissing', true);
      setTimeout(() => {
        this.set('dismissing', false);
        this.set('dismissed', true);
        if (this.get('destroyOnDismiss')) {
          this.destroy();
          this.send('destroy');
        }
      }, 350);
    },

    destroy: function() {
      const id = this.get('elementId');
      const root = document.getElementById(id);

      root.parentNode.removeChild(root);
    }
  }
});
