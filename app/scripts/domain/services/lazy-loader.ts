import { Logger } from '../../infrastructure/logger';

export interface LazyLoadOptions {
  rootMargin?: string;
  threshold?: number;
  delay?: number;
}

export interface ILazyLoader {
  observeElements(elements: Element[], callback: (element: Element) => void, options?: LazyLoadOptions): void;
  unobserve(element: Element): void;
  disconnect(): void;
}

export class IntersectionLazyLoader implements ILazyLoader {
  private observer: IntersectionObserver | null = null;
  private callbacks = new Map<Element, () => void>();
  private processedElements = new Set<Element>();

  constructor(private logger: Logger) {}

  observeElements(elements: Element[], callback: (element: Element) => void, options: LazyLoadOptions = {}): void {
    if (!this.observer) {
      this.createObserver(options);
    }

    elements.forEach(element => {
      if (!this.processedElements.has(element)) {
        this.callbacks.set(element, () => callback(element));
        this.observer!.observe(element);
        this.logger.log(`Started observing element for lazy loading: ${element.tagName}`);
      }
    });
  }

  unobserve(element: Element): void {
    if (this.observer) {
      this.observer.unobserve(element);
      this.callbacks.delete(element);
      this.processedElements.delete(element);
    }
  }

  disconnect(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.callbacks.clear();
      this.processedElements.clear();
      this.observer = null;
      this.logger.log('Lazy loader disconnected');
    }
  }

  private createObserver(options: LazyLoadOptions): void {
    const config = {
      rootMargin: options.rootMargin || '50px',
      threshold: options.threshold || 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.processedElements.has(entry.target)) {
          this.processedElements.add(entry.target);
          
          const callback = this.callbacks.get(entry.target);
          if (callback) {
            // Add small delay to avoid overwhelming the system
            const delay = options.delay || 100;
            setTimeout(() => {
              callback();
              this.unobserve(entry.target);
            }, delay);
          }
        }
      });
    }, config);

    this.logger.log('Intersection observer created for lazy loading', config);
  }
}