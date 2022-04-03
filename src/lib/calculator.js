export function sum(x, y) {
  const numberOne = parseInt(x, 10);
  const numberTwo = parseInt(y, 10);

  if (Number.isNaN(numberOne) || Number.isNaN(numberTwo)) {
    throw new Error('Invalid input');
  }

  return parseInt(x, 10) + parseInt(y, 10);
}
