/**
 * Safe logger that won't crash in production builds
 * Wraps console methods with try-catch for safety
 */

const safeLog = (method: 'log' | 'warn' | 'error', ...args: any[]) => {
  try {
    if (__DEV__) {
      console[method](...args);
    } else {
      // In production, only log errors
      if (method === 'error') {
        console.error(...args);
      }
    }
  } catch (error) {
    // Silently fail if console is not available
  }
};

export const logger = {
  log: (...args: any[]) => safeLog('log', ...args),
  warn: (...args: any[]) => safeLog('warn', ...args),
  error: (...args: any[]) => safeLog('error', ...args),
};

export default logger;
