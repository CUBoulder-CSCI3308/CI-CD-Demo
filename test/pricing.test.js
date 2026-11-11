import assert from 'node:assert/strict';
import { test } from 'node:test';
import { pizzaTotalCents } from '../site/pricing.js';

test('a plain pizza costs $8.00', () => {
  assert.equal(pizzaTotalCents(0), 800);
});

test('one topping adds $1.50', () => {
  assert.equal(pizzaTotalCents(1), 950);
});

test('two toppings each add $1.50', () => {
  assert.equal(pizzaTotalCents(2), 1100);
});

test('a $10.00 pizza with one extra topping costs $11.50', () => {
  assert.equal(pizzaTotalCents(1, 1000), 1150);
});
