require('@testing-library/jest-dom');

if (typeof window !== 'undefined') {
  window.scrollTo = jest.fn();
}
