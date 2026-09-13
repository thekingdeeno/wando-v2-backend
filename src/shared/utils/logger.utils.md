# Logger Utility

A simple but effective logging utility for the entire codebase.

## Usage

```typescript
import { Logger } from './logger.utils';

// Log information
Logger.info('Application started successfully');
Logger.info('User logged in', { userId: 123 });

// Log warnings
Logger.warn('This is a warning message');

// Log errors
Logger.error(new Error('Something went wrong'));
Logger.error('Database connection failed', { retryCount: 3 });

// Log debug information
Logger.debug('Processing user data');

// Log any value with optional label
Logger.log({ name: 'John', age: 30 }, 'User object');
Logger.log([1, 2, 3], 'Array data');
```

## Features

- Timestamped logs with ISO format
- Color-coded console output (when supported)
- Error logging with stack traces
- Support for metadata objects
- Simple and lightweight implementation
- Easy to use across the entire codebase