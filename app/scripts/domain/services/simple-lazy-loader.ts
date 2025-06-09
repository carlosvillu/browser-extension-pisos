import { Logger } from '../../infrastructure/logger';

export interface SimpleLazyLoader {
  observeElements(elements: Element[], callback: (element: Element) => void): void;
  disconnect(): void;
}

export class IntersectionSimpleLazyLoader implements SimpleLazyLoader {
  private observer: IntersectionObserver | null = null;
  private processedElements = new Set<Element>();

  constructor(private logger: Logger) {}

  observeElements(elements: Element[], callback: (element: Element) => void): void {
    if (!this.observer) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.processedElements.has(entry.target)) {
            this.processedElements.add(entry.target);
            callback(entry.target);
            this.observer!.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '100px',
        threshold: 0.1
      });
    }

    elements.forEach(element => {
      if (!this.processedElements.has(element)) {
        this.observer!.observe(element);
      }
    });
  }

  disconnect(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.processedElements.clear();
      this.observer = null;
    }
  }
}