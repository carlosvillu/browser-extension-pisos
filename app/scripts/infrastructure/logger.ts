export class Logger {
  constructor(private context: string) {}

  log(message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}][${this.context}]`;

    if (data) {
      console.log(`${prefix} ${message}`, data);
    } else {
      console.log(`${prefix} ${message}`);
    }
  }

  error(message: string, error?: any): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}][${this.context}][ERROR]`;

    if (error) {
      console.error(`${prefix} ${message}`, error);
    } else {
      console.error(`${prefix} ${message}`);
    }
  }
}
