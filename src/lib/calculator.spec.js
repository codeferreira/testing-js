const {sum} = require('./calculator');

it('should some 2 and 2 and the result should be 4', () => {
  expect(sum(2, 2)).toBe(4);
})

it('should sum 2 and 2 even if one of them is a string and the result must be 4', () => {
  expect(sum('2', 2)).toBe(4);
});

it('should throw an error if what is provided is not a number', () => {
  expect(() => {
    sum('aa', 2)
  }).toThrowError();
  
  expect(() => {
    sum([2, 2])
  }).toThrowError();
  
  expect(() => {
    sum()
  }).toThrowError();
});