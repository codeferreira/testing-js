import Dinero from 'dinero.js';
import find from 'lodash/find';
import remove from 'lodash/remove';

const Money = Dinero;

Money.defaultCurrency = 'BRL';
Money.defaultPrecision = 2;

const calculatePercentageDiscount = (amount, { quantity, condition }) => {
  if (quantity > condition.minimum) {
    return amount.percentage(condition.percentage);
  }

  return Money({ amount: 0 });
};

const calculateQuantityDiscount = (amount, { quantity, condition }) => {
  const isEven = quantity % 2 === 0;

  if (quantity >= condition.quantity) {
    return amount.percentage(isEven ? 50 : 40);
  }

  return Money({ amount: 0 });
};

const calculateDiscount = (amount, quantity, condition) => {
  const conditionsList = Array.isArray(condition) ? condition : [condition];

  const [higherDiscount] = conditionsList
    .map((discountCondition) => {
      if (discountCondition.percentage) {
        return calculatePercentageDiscount(amount, {
          quantity,
          condition: discountCondition,
        }).getAmount();
      }

      if (discountCondition.quantity) {
        return calculateQuantityDiscount(amount, {
          quantity,
          condition: discountCondition,
        }).getAmount();
      }
    })
    .sort((a, b) => b - a);

  return Money({ amount: higherDiscount });
};

class Cart {
  items = [];

  getTotal() {
    return this.items
      .reduce((total, item) => {
        const amount = Money({ amount: item.quantity * item.product.price });

        let discount = Money({ amount: 0 });

        if (item.condition) {
          discount = calculateDiscount(amount, item.quantity, item.condition);
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

  sumary() {
    return {
      total: this.getTotal(),
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
