if (typeof globalThis.DOMException === 'function') {
  module.exports = globalThis.DOMException;
} else {
  // Fallback for older JS runtimes where DOMException is not built-in
  class DOMException extends Error {
    constructor(message, name) {
      super(message);
      this.name = name || 'DOMException';
    }
  }
  module.exports = DOMException;
}
