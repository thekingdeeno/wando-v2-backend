// Example usage of the logger utility

import { Logger } from './logger.utils';

// Basic logging
Logger.info('Application started successfully');
Logger.warn('This is a warning message');
Logger.debug('Debug information');

// Logging errors
try {
  throw new Error('Something went wrong');
} catch (error) {
  Logger.error(error, { userId: 123, action: 'user_login' });
}

// Logging objects and values
Logger.log({ name: 'John', age: 30 }, 'User data');
Logger.log([1, 2, 3, 4], 'Array data');

// Simple string logging
Logger.info('User authenticated successfully', { userId: 123 });