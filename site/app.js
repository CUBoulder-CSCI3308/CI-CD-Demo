import { MENU, TOPPINGS, PROMO_CODE, pizzaTotalCents } from './pricing.js';
import { createCart } from './cart.js';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const format = cents => money.format(cents / 100);
const cart = createCart();
const menu = document.querySelector('#menu');
const list = document.querySelector('#cart');
const cartFeedback = document.querySelector('#cart-feedback');
let promoCode = '';

for (const pizza of MENU) {
  const card = document.createElement('form');
  card.className = 'card';
  card.innerHTML = `
    <div class="card-title"><h3>${pizza.name}</h3><strong>${format(pizza.price)}</strong></div>
    <p class="muted">${pizza.description}</p>
    <fieldset>
      <legend>Extra toppings</legend>
      ${TOPPINGS.map(topping => `
        <label><input type="checkbox" name="topping" value="${topping.id}"> ${topping.name}</label>
      `).join('')}
    </fieldset>
    <button type="submit" aria-label="Add ${pizza.name} to order">Add to order · ${format(pizza.price)}</button>
  `;

  const button = card.querySelector('button');
  const selectedToppings = () => new FormData(card).getAll('topping');
  card.addEventListener('change', () => {
    button.textContent = `Add to order · ${format(pizzaTotalCents(selectedToppings().length, pizza.price))}`;
  });
  card.addEventListener('submit', event => {
    event.preventDefault();
    cart.add(pizza.id, selectedToppings());
    renderCart();
    cartFeedback.textContent = `${pizza.name} added. ${document.querySelector('#count').textContent} pizzas in your order.`;
  });
  menu.append(card);
}

function renderCart(focusKey) {
  const lines = cart.getLines();
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const countBadge = document.querySelector('#count');
  countBadge.textContent = count;
  countBadge.setAttribute('aria-label', `${count} ${count === 1 ? 'pizza' : 'pizzas'}`);
  document.querySelector('#empty').hidden = count > 0;
  list.replaceChildren();

  let nextFocus;
  for (const line of lines) {
    const item = document.createElement('li');
    item.innerHTML = `
      <div><strong>${line.quantity} × ${line.name}</strong>
        <small>${line.toppings || 'No extra toppings'}</small></div>
      <div class="line-actions">
        <span>${format(line.unitPrice * line.quantity)}</span>
        <button type="button" class="secondary remove" aria-label="Remove one ${line.name}${line.toppings ? ` with ${line.toppings}` : ''}">−</button>
      </div>
    `;
    const remove = item.querySelector('button');
    if (line.key === focusKey) nextFocus = remove;
    remove.addEventListener('click', () => {
      cart.removeOne(line.key);
      renderCart(line.key);
      cartFeedback.textContent = `One ${line.name} removed. ${count - 1} pizzas in your order.`;
    });
    list.append(item);
  }

  if (focusKey) {
    (nextFocus || list.querySelector('button') || menu.querySelector('button')).focus();
  }

  const fulfillment = document.querySelector('input[name="fulfillment"]:checked').value;
  const totals = cart.totals(fulfillment, promoCode);
  for (const [id, amount] of Object.entries(totals)) {
    document.getElementById(id).textContent = format(id === 'discount' && amount ? -amount : amount);
  }
}

document.querySelectorAll('input[name="fulfillment"]').forEach(input => {
  input.addEventListener('change', () => renderCart());
});

document.querySelector('#promo-form').addEventListener('submit', event => {
  event.preventDefault();
  promoCode = document.querySelector('#promo').value.trim().toUpperCase();
  document.querySelector('#promo-feedback').textContent =
    promoCode === PROMO_CODE ? '10% off pizzas applied.' : promoCode ? 'That promo code is unavailable.' : 'Promo code cleared.';
  renderCart();
});

renderCart();
