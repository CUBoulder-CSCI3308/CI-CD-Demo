import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calculateTotals } from '../site/pricing.js';

test('subtotal accounts for quantity and different unit prices', () => {
  const lines = [{ unitPrice: 800, quantity: 2 }, { unitPrice: 950, quantity: 1 }];
  assert.deepEqual(calculateTotals(lines, 'pickup', ''), {
    subtotal: 2550, discount: 0, delivery: 0, total: 2550,
  });
});

test('delivery adds a flat fee to a nonempty order', () => {
  assert.equal(calculateTotals([{ unitPrice: 800, quantity: 2 }], 'delivery', '').total, 1950);
});

test('delivery and promo leave an empty order at zero', () => {
  assert.deepEqual(calculateTotals([], 'delivery', 'PIZZA10'), {
    subtotal: 0, discount: 0, delivery: 0, total: 0,
  });
});

test('promo code ignores case and surrounding spaces and applies only to food', () => {
  assert.deepEqual(calculateTotals([{ unitPrice: 1000, quantity: 1 }], 'delivery', ' pizza10 '), {
    subtotal: 1000, discount: 100, delivery: 350, total: 1250,
  });
});

test('an unknown promo code leaves the subtotal undiscounted', () => {
  assert.equal(calculateTotals([{ unitPrice: 950, quantity: 1 }], 'pickup', 'PIZZA99').total, 950);
});

test('discount is rounded to the nearest cent', () => {
  assert.equal(calculateTotals([{ unitPrice: 955, quantity: 1 }], 'pickup', 'PIZZA10').discount, 96);
});
