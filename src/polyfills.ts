/**
 * This file contains polyfills for Node.js modules that might not be available
 * in all Node.js versions or environments.
 */

// Ensure crypto is available globally
try {
  if (typeof global.crypto === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const crypto = require('crypto');
    global.crypto = crypto.webcrypto;
  }
} catch (error) {
  console.warn('Failed to polyfill crypto:', error);
}
