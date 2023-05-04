import CustomError from './CustomError.js';
export function paginationUrl(currentPage, options, categoryValue) {
  let url = `/products?page=${currentPage}`;

  if (options.sort) url += `&sort=${options.sort.price}`;
  if (options.limit) url += `&limit=${options.limit}`;
  if (categoryValue) url += `&category=${categoryValue}`;
  else if (options.category) url += `&category=${options.category}`;

  return url;
}

export function compare(lvalue, operator, rvalue) {
  if (arguments.length < 3) {
    throw new CustomError(
      'SERVER_ERROR',
      "Handlerbars Helper 'compare' needs 3 parameters"
    );
  }

  let operators = {
    '==': function (l, r) {
      return l == r;
    },
    '===': function (l, r) {
      return l === r;
    },
    '!=': function (l, r) {
      return l != r;
    },
    '!==': function (l, r) {
      return l !== r;
    },
    '<': function (l, r) {
      return l < r;
    },
    '>': function (l, r) {
      return l > r;
    },
    '<=': function (l, r) {
      return l <= r;
    },
    '>=': function (l, r) {
      return l >= r;
    },
    typeof: function (l, r) {
      return typeof l == r;
    },
  };

  if (!operators[operator]) {
    throw new CustomError(
      'SERVER_ERROR',
      "Handlerbars Helper 'compare' doesn't know the operator " + operator
    );
  }

  let result = operators[operator](lvalue, rvalue);

  return result;
}

export function docsIncludes(array, value) {
  if (!array.length > 1) return false;
  return array.some((doc) => doc.name === value);
}
