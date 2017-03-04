import Ember from 'ember';

export default Ember.Controller.extend({
  _modalRef: null,
  _modalBasicRef: null,
  _greetings: {
    'en': 'Hi there!',
    'fr': 'Salut!',
    'es': '¡Hola!',
    'ru': 'Всем привет!',
    'cn': '你好！',
    'ja': 'こんにちは！'
  },

  alerts: new Ember.A(),

  init() {
    Ember.run.schedule('afterRender', this, () => {
      const nodes = document.querySelectorAll('a');
      const links = [].slice.call(nodes);

      console.info(`Muting ${links.length} anchor links`);

      links.forEach((link) => {
        if (link.getAttribute('href') === '#') {
          link.onclick = (e) => e.preventDefault();
        }
      });
    });
  },

  actions: {

    createRandomNotification: function() {
      const types = ['', 'info', 'warning', 'error', 'success'];
      const icons = ['', 'info', 'warning', 'times', 'check'];
      const messages  = [
        'This is a test notification',
        'Hello there!',
        '*ding* You have a notification',
        'This is a very long notification with a lot of content that shows how the notifications adapt their width'
      ];

      let notification = {
        type: types[~~(Math.random() * types.length)],
        icon: icons[~~(Math.random() * icons.length)],
        message: messages[~~(Math.random() * messages.length)],
        dismissed: false
      };

      let filtered = new Ember.A(this.get('alerts').rejectBy('dismissed', true));
      this.set('alerts', filtered);

      this.get('alerts').pushObject(notification);
    },

    updateProgressExample: function(obj) {
      const progress = obj;
      if (progress) {
        this._demoProgressAnimation(progress);
      }
    },

    progressHoursExample: function(obj) {
      const progress = obj;
      if (progress) {
        setInterval(() => this._demoProgressHours(progress), 1000);
      }
    },

    progressMinutesExample: function(obj) {
      const progress = obj;
      if (progress) {
        setInterval(() => this._demoProgressMinutes(progress), 1000);
      }
    },

    progressSecondsExample: function(obj) {
      const progress = obj;
      if (progress) {
        setInterval(() => this._demoProgressSeconds(progress), 1000);
      }
    },

    modalExampleBind: function(obj) {
      const modal = obj;
      if (modal) {
        this.set('_modalRef', modal);
      }
    },

    modalBasicExampleBind: function(obj) {
      const modal = obj;
      if (modal) {
        this.set('_modalBasicRef', modal);
      }
    },

    modalExampleOpen: function() {
      const modal = this.get('_modalRef');
      if (modal) {
        let promise = modal.open();

        promise.then((o) => {
          console.log(o);
          this._modalExampleUpdateMessage("modalExampleMessage", o);
        }, (o) => {
          console.log(o);
          this._modalExampleUpdateMessage("modalExampleMessage", o);
        });
      }
    },

    modalBasicExampleOpen: function() {
      const modal = this.get('_modalBasicRef');
      if (modal) {
        let promise = modal.open();

        promise.then((o) => {
          console.log(o);
          this._modalExampleUpdateMessage("modalBasicExampleMessage", o);
        }, (o) => {
          console.log(o);
          this._modalExampleUpdateMessage("modalBasicExampleMessage", o);
        });
      }
    },

    exampleDropdownCallback: function(opt) {
      const msgContainer = document.getElementById('dropdownExampleMessage');
      const greetings = this.get('_greetings');
      const greeting = greetings[opt.value] || "I don't speak this language :(";

      let msg = `${greeting}<code>{label: "${opt.label}", value: "${opt.value}"}</code>`;

      msgContainer.innerHTML = msg;
    }

  },

  _modalExampleUpdateMessage: function(target, obj) {
    const msgContainer = document.getElementById(target);

    let successState = obj.success ? 'succeeded' : 'failed';
    let msg = `Promise ${successState} with message "${obj.message}"`;

    if (obj.success) {
      msg += " and data:<br/><ul>";

      if (obj.data.length === 0) {
        msg += "(nodata)";
      } else {
        obj.data.forEach((data) => {
          if (typeof data === 'string') { data = `"${data}"`; }
          msg += `<li>${data}</li>`;
        });
      }

      msg += '</ul>';
    }

    msgContainer.innerHTML = msg;
  },

  _demoProgressHours: function(progress) {
    const date = new Date();
    const second = date.getSeconds();
    const minute = date.getMinutes();
    let hour = date.getHours();

    if (second === 0 && minute === 0 && hour === 0) {
      hour = 24;
    }

    progress.setProgress(hour);
  },

  _demoProgressMinutes: function(progress) {
    const date = new Date();
    const second = date.getSeconds();
    let minute = date.getMinutes();

    if (second === 0 && minute === 0) {
      minute = 60;
    }

    progress.setProgress(minute);
  },

  _demoProgressSeconds: function(progress) {
    const date = new Date();
    let second = date.getSeconds();

    if (second === 0) {
      second = 60;
    }

    progress.setProgress(second);
  },

  _demoProgressAnimation: function(progress) {
    if (!progress.get('completed')) {
      setTimeout(() => {
        let newVal = progress.get('value');
        newVal += ~~(Math.random() * progress.get('maxValue') / 10) + 1;
        if (newVal > 100) {
          newVal = 100;
        }
        progress.setProgress(newVal);

        requestAnimationFrame(() => this._demoProgressAnimation(progress));
      }, ~~(Math.random() * 500) + 800);
    } else {
      setTimeout(() => {
        progress.setProgress(0);

        requestAnimationFrame(() => this._demoProgressAnimation(progress));
      }, 3000);
    }
  }
});
