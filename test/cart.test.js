import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createCart } from '../site/cart.js';

test('the same pizza and toppings merge even when topping order differs', () => {
  const cart = createCart();
  cart.add('classic', ['olives', 'mushrooms']);
  cart.add('classic', ['mushrooms', 'olives']);
  assert.equal(cart.getLines().length, 1);
  assert.equal(cart.getLines()[0].quantity, 2);
  assert.equal(cart.getLines()[0].unitPrice, 1100);
});

test('different toppings make separate cart lines', () => {
  const cart = createCart();
  cart.add('classic', ['olives']);
  cart.add('classic', ['mushrooms']);
  assert.equal(cart.getLines().length, 2);
});

test('duplicate toppings are only charged once', () => {
  const cart = createCart();
  cart.add('classic', ['olives', 'olives']);
  assert.equal(cart.getLines()[0].unitPrice, 950);
});

test('removing one pizza decrements quantity and removes the final item', () => {
  const cart = createCart();
  cart.add('garden');
  cart.add('garden');
  const [{ key }] = cart.getLines();
  cart.removeOne(key);
  assert.equal(cart.getLines()[0].quantity, 1);
  cart.removeOne(key);
  assert.deepEqual(cart.getLines(), []);
});

test('unknown menu items and toppings are rejected without changing the cart', () => {
  const cart = createCart();
  assert.throws(() => cart.add('unknown'), /Unknown pizza/);
  assert.throws(() => cart.add('classic', ['unknown']), /Unknown topping/);
  assert.deepEqual(cart.getLines(), []);
});

test('a customized mixed order flows through pricing, promo, delivery, and removal', () => {
  const cart = createCart();
  cart.add('classic', ['olives']); // $9.50
  cart.add('pepperoni');         // $10.00
  assert.deepEqual(cart.totals('delivery', 'PIZZA10'), {
    subtotal: 1950, discount: 195, delivery: 350, total: 2105,
  });

  const [{ key }] = cart.getLines();
  cart.removeOne(key);
  assert.deepEqual(cart.totals('pickup', 'PIZZA10'), {
    subtotal: 1000, discount: 100, delivery: 0, total: 900,
  });
});
