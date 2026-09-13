// Simple, effective logger utility for the entire codebase
export class Logger {
  private static formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const formattedMessage = `${timestamp} [${level}] ${message}`;
    
    if (meta) {
      return `${formattedMessage} - ${JSON.stringify(meta)}`;
    }
    
    return formattedMessage;
  }

  static info(message: string, meta?: any): void {
    console.log(this.formatMessage('INFO', message, meta));
    console.log(); // Add spacing after info logs
  }

  static error(error: Error | string, meta?: any): void {
    const message = typeof error === 'string' ? error : error.message;
    const formattedMessage = this.formatMessage('ERROR', message, meta);
    
    if (typeof error !== 'string' && error.stack) {
      console.error(formattedMessage);
      console.error(`Stack: ${error.stack}`);
    } else {
      console.error(formattedMessage);
    }
    console.log(); // Add spacing after error logs
  }

  static warn(message: string, meta?: any): void {
    console.warn(this.formatMessage('WARN', message, meta));
    console.log(); // Add spacing after warn logs
  }

  static debug(message: string, meta?: any): void {
    console.debug(this.formatMessage('DEBUG', message, meta));
    console.log(); // Add spacing after debug logs
  }

  // Log any value (object, array, primitive) with proper formatting
  static log(value: any, label?: string): void {
    if (label) {
      console.log(`${new Date().toISOString()} [LOG] ${label}:`, value);
    } else {
      console.log(`${new Date().toISOString()} [LOG]:`, value);
    }
    console.log(); // Add spacing after log statements
  }

  // Add a specific spacing method for custom control
  static space(): void {
    console.log();
  }
}