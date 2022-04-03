import { parse, queryString } from './queryString';

describe('Object to query string', () => {
  it('should create a valid query string when an object is passed', () => {
    const obj = {
      name: 'Jose',
      profession: 'developer',
    };

    expect(queryString(obj)).toBe('name=Jose&profession=developer');
  });

  it('should create a valid query string when an array is passed as value', () => {
    const obj = {
      name: 'Jose',
      profession: ['developer', 'lead'],
    };

    expect(queryString(obj)).toBe('name=Jose&profession=developer,lead');
  });

  it('should throw an error when an object is passes as value', () => {
    const obj = {
      name: 'Jose',
      abilities: {
        first: 'JS',
        second: 'TDD',
      },
    };

    expect(() => queryString(obj)).toThrowError();
  });
});

describe('Query string to Object', () => {
  it('should convert a query string to object', () => {
    const qs = 'name=Jose&profession=developer';

    expect(parse(qs)).toEqual({
      name: 'Jose',
      profession: 'developer',
    });
  });

  it('should convert a query string with single key-value to object', () => {
    const qs = 'name=Jose';

    expect(parse(qs)).toEqual({
      name: 'Jose',
    });
  });

  it('should convert query string to an object and convert to array if has a value with comma', () => {
    const qs = 'name=Jose&profession=developer,lead';

    expect(parse(qs)).toEqual({
      name: 'Jose',
      profession: ['developer', 'lead'],
    });
  });
});
