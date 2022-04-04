import Dinero from 'dinero.js';
import find from 'lodash/find';
import remove from 'lodash/remove';
import { calculateDiscount } from './discount.utils';

const Money = Dinero;

Money.defaultCurrency = 'BRL';
Money.defaultPrecision = 2;

class Cart {
  items = [];

  getTotal() {
    return this.items
      .reduce((total, { quantity, product, condition }) => {
        const amount = Money({ amount: quantity * product.price });

        let discount = Money({ amount: 0 });

        if (condition) {
          discount = calculateDiscount(amount, quantity, condition);
        }

        return total.add(amount).subtract(discount);
      }, Money({ amount: 0 }))
      .getAmount();
  }

  add(item) {
    const existingItem = find(this.items, { product: item.product });

    if (existingItem) {
      existingItem.quantity += item.quantity;
      return;
    }

    this.items.push(item);
  }

  list() {
    return this.items;
  }

  summary() {
    const total = this.getTotal();
    const formattedTotal = Money({ amount: total }).toFormat('$0,0.00');

    return {
      total,
      formattedTotal,
      items: this.list(),
    };
  }

  remove(product) {
    remove(this.items, { product });
  }

  checkout() {
    const checkout = {
      total: this.getTotal(),
      items: this.list(),
    };

    this.items = [];

    return checkout;
  }
}

export { Cart };
