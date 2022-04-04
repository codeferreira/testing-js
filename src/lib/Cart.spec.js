import { Cart } from './Cart';

describe('Cart', () => {
  let cart;
  let product = {
    name: 'Product 1',
    price: 10000,
  };

  let product2 = {
    name: 'Product 2',
    price: 20000,
  };

  beforeEach(() => {
    cart = new Cart();
  });

  describe('getTotal', () => {
    it('should have 0 as total for a newly created cart', () => {
      const cart = new Cart();

      expect(cart.getTotal()).toEqual(0);
    });

    it('should multiply quantity and price and receive the total amount', () => {
      const item = {
        product,
        quantity: 2,
      };

      cart.add(item);

      expect(cart.getTotal()).toEqual(20000);
    });

    it('should update total when removing a product', () => {
      cart.add({
        product,
        quantity: 2,
      });

      expect(cart.getTotal()).toBe(20000);

      cart.remove(product);

      expect(cart.getTotal()).toEqual(0);
    });
  });

  describe('add', () => {
    it('should add a new product', () => {
      cart.add({
        product,
        quantity: 2,
      });

      expect(cart.list()).toEqual([
        {
          product,
          quantity: 2,
        },
      ]);
    });

    it('should some quantity for equal products', () => {
      cart.add({
        product,
        quantity: 2,
      });

      cart.add({
        product,
        quantity: 1,
      });

      expect(cart.list()).toEqual([
        {
          product,
          quantity: 3,
        },
      ]);
    });
  });

  describe('checkout', () => {
    it('should return an object with the total and the list of items', () => {
      cart.add({
        product,
        quantity: 2,
      });

      cart.add({
        product: product2,
        quantity: 1,
      });

      expect(cart.checkout()).toMatchSnapshot();
    });

    it('should reset the cart when checkout is called', () => {
      cart.add({
        product,
        quantity: 2,
      });

      cart.add({
        product: product2,
        quantity: 1,
      });

      cart.checkout();

      expect(cart.list()).toEqual([]);
    });
  });

  describe('sumary', () => {
    it('should return an object with the total, the list of items and formatted total', () => {
      cart.add({
        product,
        quantity: 2,
      });

      cart.add({
        product: product2,
        quantity: 1,
      });

      expect(cart.summary()).toMatchSnapshot();
    });
  });

  describe('special conditions', () => {
    it('should apply percentage discount above a minimum amount', () => {
      const condition = {
        percentage: 30,
        minimum: 2,
      };

      cart.add({
        product,
        quantity: 3,
        condition,
      });

      expect(cart.getTotal()).toEqual(21000);
    });

    it('should not apply percentage discount when below minimum amount', () => {
      const condition = {
        percentage: 30,
        minimum: 2,
      };

      cart.add({
        product,
        quantity: 2,
        condition,
      });

      expect(cart.getTotal()).toEqual(20000);
    });

    it('should apply quantity discount for even quantities', () => {
      const condition = {
        quantity: 2,
      };

      cart.add({
        product,
        quantity: 4,
        condition,
      });

      expect(cart.getTotal()).toEqual(20000);
    });

    it('should apply quantity discount only for pairs when has a odd quantity', () => {
      const condition = {
        quantity: 2,
      };

      cart.add({
        product,
        quantity: 5,
        condition,
      });

      expect(cart.getTotal()).toEqual(30000);
    });

    it('should not apply quantity discount when quantity is below minimum', () => {
      const condition = {
        quantity: 2,
      };

      cart.add({
        product,
        quantity: 1,
        condition,
      });

      expect(cart.getTotal()).toEqual(10000);
    });

    it('should receive two or more conditions and determine/apply the best discount. First Case.', () => {
      const condition1 = {
        percentage: 30,
        minimum: 2,
      };

      const condition2 = {
        quantity: 2,
      };

      cart.add({
        product,
        quantity: 5,
        condition: [condition1, condition2],
      });

      expect(cart.getTotal()).toEqual(30000);
    });

    it('should receive two or more conditions and determine/apply the best discount. Second Case.', () => {
      const condition1 = {
        percentage: 80,
        minimum: 2,
      };

      const condition2 = {
        quantity: 2,
      };

      cart.add({
        product,
        quantity: 5,
        condition: [condition1, condition2],
      });

      expect(cart.getTotal()).toEqual(10000);
    });
  });
});
