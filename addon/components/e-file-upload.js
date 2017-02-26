import Ember from 'ember';
import layout from '../templates/components/e-file-upload';

export default Ember.Component.extend({
  layout,

  id: '',
  target: null,

  _drop: null,

  actions: {
    _initDropzone: function() {
      const id = this.get('id');
      const button = this.get('element').querySelector('button.button');

      if (document.getElementById(id)) {
        let drop = new window.Dropzone(`form#${id}`, {
          url: this.get('target'),
          maxFilesize: 200,
          clickable: button,
          createImageThumbnails: true,
          thumbnailHeight: 120,
          thumbnailWidth: 120,
          acceptedFiles: "image/*,application/pdf"
        });
        this.set('_drop', drop);
      }

    }
  },

  didInsertElement: function() {
    this.send('_initDropzone');
  }
});
