import Dinero from 'dinero.js';

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

export const calculateDiscount = (amount, quantity, condition) => {
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
