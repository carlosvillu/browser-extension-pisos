import { Logger } from '../../infrastructure/logger';

export interface IDOMOptimizer {
  batchDOMUpdates(updates: (() => void)[]): void;
  measureElement(element: Element): DOMRect;
  scheduleUpdate(callback: () => void): void;
}

export class DOMOptimizer implements IDOMOptimizer {
  private updateQueue: (() => void)[] = [];
  private isScheduled = false;

  constructor(private logger: Logger) {}

  batchDOMUpdates(updates: (() => void)[]): void {
    // Batch all DOM modifications together to minimize reflows
    requestAnimationFrame(() => {
      // Read phase - measure all elements first
      const measurements: any[] = [];
      
      updates.forEach((update, index) => {
        try {
          // If the update function has a read phase, execute it first
          if (update.name === 'readMeasurements') {
            measurements[index] = update();
          }
        } catch (error) {
          this.logger.error('Error in DOM read phase', error);
        }
      });

      // Write phase - apply all modifications
      updates.forEach((update, index) => {
        try {
          if (update.name !== 'readMeasurements') {
            update();
          }
        } catch (error) {
          this.logger.error('Error in DOM write phase', error);
        }
      });

      this.logger.log(`Batched ${updates.length} DOM updates`);
    });
  }

  measureElement(element: Element): DOMRect {
    // Force layout and return measurements
    return element.getBoundingClientRect();
  }

  scheduleUpdate(callback: () => void): void {
    this.updateQueue.push(callback);
    
    if (!this.isScheduled) {
      this.isScheduled = true;
      
      requestAnimationFrame(() => {
        const updates = [...this.updateQueue];
        this.updateQueue.length = 0;
        this.isScheduled = false;
        
        this.batchDOMUpdates(updates);
      });
    }
  }
}

export class DocumentFragmentOptimizer {
  constructor(private logger: Logger) {}

  createOptimizedElement(tagName: string, setup: (element: HTMLElement) => void): HTMLElement {
    // Create element in a document fragment to avoid triggering reflows
    const fragment = document.createDocumentFragment();
    const element = document.createElement(tagName);
    
    fragment.appendChild(element);
    
    // Configure the element while it's detached from the DOM
    setup(element);
    
    return element;
  }

  insertMultipleElements(container: Element, elements: HTMLElement[]): void {
    // Use document fragment to insert multiple elements efficiently
    const fragment = document.createDocumentFragment();
    
    elements.forEach(element => {
      fragment.appendChild(element);
    });
    
    container.appendChild(fragment);
    this.logger.log(`Inserted ${elements.length} elements using document fragment`);
  }
}