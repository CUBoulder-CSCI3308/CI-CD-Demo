export const MENU = [
  { id: 'classic', name: 'Margherita', description: 'Tomato, fresh mozzarella, and basil', price: 800 },
  { id: 'pepperoni', name: 'Pepperoni', description: 'Tomato, mozzarella, and crisp pepperoni', price: 1000 },
  { id: 'garden', name: 'Garden', description: 'Peppers, red onion, olives, and mozzarella', price: 950 },
];

export const TOPPINGS = [
  { id: 'mushrooms', name: 'Mushrooms' },
  { id: 'olives', name: 'Black olives' },
  { id: 'jalapenos', name: 'Jalapeños' },
];

export const TOPPING_PRICE_CENTS = 100;
export const PROMO_CODE = 'PIZZA10';
export const DELIVERY_FEE_CENTS = 350;

export function pizzaTotalCents(toppingCount, basePrice = MENU[0].price) {
  return basePrice + toppingCount * TOPPING_PRICE_CENTS;
}

export function calculateTotals(lines, fulfillment, promoCode) {
  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  const discount = promoCode.trim().toUpperCase() === PROMO_CODE
    ? Math.round(subtotal * 0.10)
    : 0;
  const delivery = lines.length > 0 && fulfillment === 'delivery' ? DELIVERY_FEE_CENTS : 0;

  return { subtotal, discount, delivery, total: subtotal - discount + delivery };
}
