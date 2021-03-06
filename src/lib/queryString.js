const keyValueToString = ([key, value]) => {
  if (typeof value === 'object' && !Array.isArray(value)) {
    throw new Error('Objects are not allowed as values');
  }

  return `${key}=${value}`;
};

export const queryString = (object) =>
  Object.entries(object).map(keyValueToString).join('&');

export const parse = (queryString) =>
  Object.fromEntries(
    queryString.split('&').map((item) => {
      let [key, value] = item.split('=');

      if (value.includes(',')) {
        value = value.split(',');
      }

      return [key, value];
    }),
  );
