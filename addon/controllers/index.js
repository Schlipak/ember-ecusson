import Ember from 'ember';

export default Ember.Controller.extend({
  _modalRef: null,

  actions: {

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

    modalExampleOpen: function() {
      const modal = this.get('_modalRef');
      if (modal) {
        let promise = modal.open();

        promise.then((o) => {
          console.log(o);
          this._modalExampleUpdateMessage(o);
        }, (o) => {
          console.log(o);
          this._modalExampleUpdateMessage(o);
        });
      }
    }

  },

  _modalExampleUpdateMessage: function(obj) {
    const msgContainer = document.getElementById("modalExampleMessage");

    let successState = obj.success ? 'succeeded' : 'failed';
    let msg = `Promise ${successState} with message "${obj.message}"`;

    if (obj.success) {
      msg += " and data:<br/><ul>";

      obj.data.forEach((data) => {
        if (typeof data === 'string') {
          data = `"${data}"`;
        }
        msg += `<li>${data}</li>`;
      });
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
