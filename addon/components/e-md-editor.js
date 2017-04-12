import Ember from 'ember';
import layout from '../templates/components/e-md-editor';

const KEYCODE_SHIFT = 16;
const KEYCODE_TAB   = 9;

export default Ember.Component.extend({
  layout,
  tagName: 'div',
  classNames: ['markdown', 'editor'],

  value: '',
  name: Ember.computed(function() {
    return this.get('elementId') + '-markdown';
  }),
  showPreview: false,

  isShiftDown: false,

  _areaScrollCallback: null,

  _isFocused: Ember.computed('document.activeElement', function() {
    const root = this.get('element');
    const area = root.getElementsByTagName('textarea')[0];

    return area === document.activeElement;
  }),

  lineNumbers: Ember.computed(function() {
    return [...Array(999).keys()].map((n) => n + 1);
  }),

  didInsertElement() {
    const root = this.get('element');
    const area = root.getElementsByTagName('textarea')[0];
    const lines = root.querySelector('.container.line-numbers');

    const areaScrollCallback = () => {
      const scrollTop = area.scrollTop;

      lines.scrollTop = scrollTop;
    };

    this.set('_areaScrollCallback', areaScrollCallback);
    area.addEventListener('scroll', areaScrollCallback);
    area.addEventListener('touchmove', areaScrollCallback);
  },

  willDestroyElement() {
    const root = this.get('element');
    const area = root.getElementsByTagName('textarea')[0];
    const areaScrollCallback = this.get('_areaScrollCallback');

    area.removeEventListener('scroll', areaScrollCallback);
    area.removeEventListener('touchmove', areaScrollCallback);
  },

  _highlightCode: Ember.observer('value', function() {
    if (window.hljs) {
      Ember.run.next(() => {
        const root = this.get('element');
        const result = root.querySelector('.result-container .result');
        if (!result) {
          return;
        }
        const codeBlocks = result.querySelectorAll('pre > code');

        [].slice.call(codeBlocks).forEach((block) => {
          window.hljs.highlightBlock(block);
        });
      });
    }
  }),

  keyDown(e) {
    if (!this.get('_isFocused')) {
      return;
    }

    const key   = e.keyCode || e.which;
    const root  = this.get('element');
    const area  = root.getElementsByTagName('textarea')[0];

    if (key === KEYCODE_SHIFT) {
      e.preventDefault();
      area.focus();
      this.set('isShiftDown', true);
    } else if (key === KEYCODE_TAB) {
      e.preventDefault();
      area.focus();

      Ember.run.throttle(this, function() {
        let start = area.selectionStart;
        let end   = area.selectionEnd;

        if (start !== end) {
          this._extendSelectionToFullLines();
          start = area.selectionStart;
          end   = area.selectionEnd;
        }

        if (this.get('isShiftDown')) {
          this.send('outdent');
          Ember.run.next(() => {
            if (start !== end) {
              this._extendSelectionToFullLines();
            } else {
              this._refreshRange(start - 2);
            }
          });
        } else {
          this.send('indent');
          Ember.run.next(() => {
            if (start !== end) {
              this._extendSelectionToFullLines();
            } else {
              this._refreshRange(start + 2);
            }
          });
        }
      }, 750);

    }
  },

  keyUp(e) {
    if (!this.get('_isFocused')) {
      return;
    }

    const key  = e.keyCode || e.which;
    const root = this.get('element');
    const area = root.getElementsByTagName('textarea')[0];

    if (key === KEYCODE_SHIFT) {
      e.preventDefault();
      area.focus();
      this.set('isShiftDown', false);
    }
  },

  _supportsRangeSelection: function() {
    const root = this.get('element');
    const area = root.getElementsByTagName('textarea')[0];

    return (area.selectionStart || area.selectionStart === 0);
  },

  _extendSelectionToFullLines: function() {
    const root = this.get('element');
    const area = root.getElementsByTagName('textarea')[0];

    if (area.selectionStart || area.selectionStart === 0) {
      let start = area.selectionStart;
      let end = area.selectionEnd;

      while (start > 0 && area.value[start] !== "\n") {
        start -= 1;
      }
      if (start !== 0) {
        start += 1;
      }

      while (end < area.value.length && area.value[end] !== "\n") {
        end += 1;
      }

      area.selectionStart = start;
      area.selectionEnd = end;
    }
  },

  _fallbackInsert: function(text) {
    const root = this.get('element');
    const area = root.getElementsByTagName('textarea')[0];

    if (document.selection) {
      area.focus();
      let selection = document.selection.createRange();
      selection.text = text;
    } else {
      this.set('value', this.get('value') + text);
    }
  },

  _replaceRange: function(src, start, end, text) {
    const result = src.substring(0, start) + text + src.substring(end, src.length);
    this.set('value', result);
  },

  _refreshRange: function(start, end) {
    const root = this.get('element');
    const area = root.getElementsByTagName('textarea')[0];

    end = end || start;

    Ember.run.next(() => {
      area.focus();
      area.selectionStart = start;
      area.selectionEnd = end;
    });
  },

  _replaceSelection: function(text) {
    const root = this.get('element');
    const area = root.getElementsByTagName('textarea')[0];

    if (this._supportsRangeSelection()) {
      this._replaceRange(area.value, area.selectionStart, area.selectionEnd, text);
      this._refreshRange(area.selectionStart, area.selectionStart + text.length);
    } else {
      this._fallbackInsert(text);
    }
  },

  _insertAtCaret: function(text) {
    const root = this.get('element');
    const area = root.getElementsByTagName('textarea')[0];

    if (area.selectionStart || area.selectionStart === 0) {
      this._replaceRange(area.value, area.selectionStart, area.selectionStart, text);
      this._refreshRange(area.selectionStart, area.selectionStart + text.length);
    } else {
      this._fallbackInsert(text);
    }
  },

  _insertAtLineStart: function(text, newline) {
    const root = this.get('element');
    const area = root.getElementsByTagName('textarea')[0];

    if (area.selectionStart || area.selectionStart === 0) {
      this._extendSelectionToFullLines();

      let start = area.selectionStart;
      let end = area.selectionEnd;

      let selection = area.value.substring(start, end);
      let lines = selection.replace(/\r\n|\n\r|\n|\r/g,"\n").split("\n");
      let index = 0;

      let result = lines.map((line) => {
        index += 1;
        return text.replace(/{index}/g, index) + line;
      }).join("\n");

      if (newline) {
        result = result + "\n";
      }

      this._replaceRange(area.value, start, end, result);
      this._refreshRange(start + 1, start + result.length);
    } else {
      this._fallbackInsert(text);
    }
  },

  _deleteFromLineStart: function(char, length) {
    const root = this.get('element');
    const area = root.getElementsByTagName('textarea')[0];

    if (area.selectionStart || area.selectionStart === 0) {
      this._extendSelectionToFullLines();

      const start = area.selectionStart;
      const end = area.selectionEnd;

      let selection = area.value.substring(start, end);
      let lines = selection.replace(/\r\n|\n\r|\n|\r/g,"\n").split("\n");
      const reg = new RegExp(`^\\s{1,${length}}`, 'g');

      let result = lines.map((line) => {
        return line.replace(reg, "");
      }).join("\n");

      this._replaceRange(area.value, start, end, result);
      this._refreshRange(start + 1, start + result.length);
    }
  },

  _surroundWith: function(leftText, rightText) {
    const root = this.get('element');
    const area = root.getElementsByTagName('textarea')[0];
    rightText = rightText || leftText;

    if (area.selectionStart || area.selectionStart === 0) {
      const start = area.selectionStart;
      const end = area.selectionEnd + leftText.length;

      this._replaceRange(area.value, start, start, leftText);
      Ember.run.next(() => {
        this._replaceRange(area.value, end, end, rightText);
        this._refreshRange(start + leftText.length, end);
      });
    } else {
      this._fallbackInsert(leftText);
    }
  },

  _surroundOrInsert: function(surround, insert) {
    const root = this.get('element');
    const area = root.getElementsByTagName('textarea')[0];

    if (area.selectionStart || area.selectionStart === 0) {
      const start = area.selectionStart;
      const end = area.selectionEnd;

      if (start === end) {
        this._insertAtCaret(insert);
      } else {
        this._surroundWith(surround);
      }
    } else {
      this._fallbackInsert(insert);
    }
  },

  actions: {
    insertAtCaret: function(text) {
      text = text.replace(/\\n/g, "\n");
      this._insertAtCaret(text);
    },

    surroundWith: function(left, right) {
      left = left.replace(/\\n/g, "\n");
      right = (right || left).replace(/\\n/g, "\n");
      this._surroundWith(left, right);
    },

    surroundOrInsert: function(surround, insert) {
      surround = surround.replace(/\\n/g, "\n");
      insert = insert.replace(/\\n/g, "\n");
      this._surroundOrInsert(surround, insert);
    },

    insertAtLineStart: function(text, newline) {
      text = text.replace(/\\n/g, "\n");
      this._insertAtLineStart(text, newline);
    },

    deleteFromLineStart: function(char, length) {
      length = length || 2;
      this._deleteFromLineStart(char, length);
    },

    togglePreview: function() {
      this.set('showPreview', !this.get('showPreview'));
    },

    indent: function() {
      this._insertAtLineStart("  ", false);
    },

    outdent: function() {
      this._deleteFromLineStart(' ', 2);
    },
  },
});
