import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('e-checkbox', 'Integration | Component | e checkbox', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{e-checkbox}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#e-checkbox}}
      template block text
    {{/e-checkbox}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
