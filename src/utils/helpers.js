import CustomError from './CustomError.js';

// Pagination helper for handlebars to check to make sure the pagination buttons changes the url as expected
export function paginationUrl(currentPage, options, categoryValue) {
  let url = `/products?page=${currentPage}`;

  if (options.sort) url += `&sort=${options.sort.price}`;
  if (options.limit) url += `&limit=${options.limit}`;
  if (categoryValue) url += `&category=${categoryValue}`;
  else if (options.category) url += `&category=${options.category}`;

  return url;
}

// Generic helper to compare values in handlebars with different operators
export function compare(lvalue, operator, rvalue) {
  if (arguments.length < 3) {
    throw new CustomError(
      'SERVER_ERROR',
      "Handlerbars Helper 'compare' needs 3 parameters"
    );
  }

  // l and r stands for left and right values respectively
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

  // Check's if the operator is supported by the helper
  if (!operators[operator]) {
    throw new CustomError(
      'SERVER_ERROR',
      "Handlerbars Helper 'compare' doesn't know the operator " + operator
    );
  }

  // Checks the operation truth value
  let result = operators[operator](lvalue, rvalue);

  return result;
}

// Helper to check if the user has already uploaded a particular document
export function docsIncludes(array, value) {
  if (!array.length > 1) return false;
  return array.some((doc) => doc.name === value);
}
