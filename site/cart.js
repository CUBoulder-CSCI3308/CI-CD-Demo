import { MENU, TOPPINGS, calculateTotals, pizzaTotalCents } from './pricing.js';

export function createCart() {
  const lines = new Map();

  return {
    add(pizzaId, toppings = []) {
      const pizza = MENU.find(({ id }) => id === pizzaId);
      if (!pizza) throw new RangeError('Unknown pizza');
      if (toppings.some(id => !TOPPINGS.some(topping => topping.id === id))) {
        throw new RangeError('Unknown topping');
      }

      const selected = TOPPINGS.filter(({ id }) => toppings.includes(id));
      const key = [pizzaId, ...selected.map(({ id }) => id)].join(':');
      const existing = lines.get(key);
      if (existing) {
        existing.quantity += 1;
      } else {
        lines.set(key, {
          key,
          name: pizza.name,
          toppings: selected.map(({ name }) => name).join(', '),
          unitPrice: pizzaTotalCents(selected.length, pizza.price),
          quantity: 1,
        });
      }
    },

    removeOne(key) {
      const line = lines.get(key);
      if (!line) return;
      line.quantity -= 1;
      if (line.quantity === 0) lines.delete(key);
    },

    getLines() {
      return Array.from(lines.values(), line => ({ ...line }));
    },

    totals(fulfillment = 'pickup', promoCode = '') {
      return calculateTotals(this.getLines(), fulfillment, promoCode);
    },
  };
}
