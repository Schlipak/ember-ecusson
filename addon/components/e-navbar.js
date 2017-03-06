import Ember from 'ember';
import layout from '../templates/components/e-navbar';

const NAVBAR_DEFAULT_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cg fill='none' stroke-miterlimit='10' font-family='sans-serif' font-size='12'%3E%3Cpath d='M-2.4 50.4V-2.4h52.8v52.8z'/%3E%3Cpath d='M24 2s-8.8 8.8-17.6 8.8c0 0-1.1 25.3 17.8 35.2 18.5-9.9 17.4-35.2 17.4-35.2C31.7 10.8 24 2 24 2z' fill='%23795548'/%3E%3Cpath d='M37.06 14.72c-5.64-1.2-10.3-4.35-13.18-6.77-2.97 2.35-7.66 5.46-12.94 6.7.5 6.36 2.84 19.4 13.23 26.24 10.1-6.86 12.4-19.8 12.9-26.2z' fill='%23ffc107'/%3E%3Cpath d='M23.88 7.95c-2.97 2.35-7.66 5.46-12.94 6.7.07.93.2 2.02.37 3.2 5.18-1.3 9.7-4.3 12.6-6.6 2.8 2.36 7.36 5.43 12.8 6.67.2-1.17.3-2.26.4-3.2-5.64-1.2-10.3-4.35-13.2-6.77z' fill='%23d39305'/%3E%3Cg fill='%23ffeb3b' transform='matrix(1.1 0 0 1.1 -2.4 -2.4)'%3E%3Ccircle cx='24' cy='7' r='1'/%3E%3Ccircle cx='38' cy='14' r='1'/%3E%3Ccircle cx='24' cy='41' r='1'/%3E%3Ccircle cx='10' cy='14' r='1'/%3E%3Ccircle cx='13' cy='29' r='1'/%3E%3Ccircle cx='35' cy='29' r='1'/%3E%3C/g%3E%3Cg transform='matrix(1.1 0 0 1.1 -2.4 -2.4)'%3E%3Cpath d='M23.76 17.5c-5.5 0-12 5-12 5s6.5 5 12 5 12-5 12-5-6.5-5-12-5z' fill='%23fff'/%3E%3Cpath d='M23.76 17.5c-1.3 0-2.5.2-3.6.5-.9.9-1.4 2.2-1.4 3.5 0 2.8 2.2 5 5 5s5-2.2 5-5c0-1.3-.5-2.6-1.4-3.5-1.1-.3-2.3-.5-3.6-.5z' fill='%23009688'/%3E%3Ccircle cx='23.76' cy='21.5' r='2' fill='%23263238'/%3E%3Cpath d='M23.76 19.5c0-.6.4-1 1-1s1 .4 1 1-.4 1-1 1-1-.4-1-1' fill='%23fff'/%3E%3Cpath d='M11.76 22.5s5-8 12-8 12 8 12 8-7-5-12-5-12 5-12 5zm12 7c7 0 12-7 12-7s-7 5-12 5-12-5-12-5 5 7 12 7z' fill='%23ffa726'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

export default Ember.Component.extend({
  layout,

  tagName: 'nav',
  classNames: ['navbar'],
  classNameBindings: ['scrolled'],

  title: 'MyEcussonApp',
  titleLink: "/",

  logo: NAVBAR_DEFAULT_IMAGE,
  scrolledLogo: Ember.computed(function() {
    return this.get('logo');
  }),

  scrolled: false,
  triggerOffset: 80,

  didInsertElement: function() {
    document.addEventListener('scroll', this, false);
  },

  willDestroyElement: function() {
    document.removeEventListener('scroll', this, false);
  },

  handleEvent: function(evt) {
    if (evt.type === 'scroll') {
      Ember.run(this, function() {
        const offset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const state = offset >= this.get('triggerOffset');
        const svgLogoOverlay = document.getElementById('#' + this.get('overlay'));

        this.set('scrolled', state);
        if (!svgLogoOverlay) {
          return;
        }
        if (state) {
          svgLogoOverlay.style.opacity = 0.8;
        } else {
          svgLogoOverlay.style.opacity = 0;
        }
      });
    }
  },

  scrolledClass: Ember.computed('scrolled', function() {
    if (this.get('scrolled')) {
      return 'scrolled';
    }
    return '';
  }),
});
