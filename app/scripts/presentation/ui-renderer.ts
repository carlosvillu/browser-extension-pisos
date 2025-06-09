import { PropertyData, ProfitabilityAnalysis } from '../domain/interfaces';
import { Logger } from '../infrastructure/logger';
import { ConfigService, UserConfig } from '../domain/services/config-service';

export interface IUIRenderer {
  renderBadge(property: PropertyData, analysis: ProfitabilityAnalysis): Promise<void>;
  renderLoadingBadge(property: PropertyData): Promise<void>;
  renderNoDataBadge(property: PropertyData): void;
  renderErrorBadge(property: PropertyData): void;
  removeBadge(property: PropertyData): void;
}

export class InvestmentUIRenderer implements IUIRenderer {
  private configService: ConfigService;
  private userConfig?: UserConfig;

  constructor(private logger: Logger) {
    this.configService = new ConfigService();
  }

  async renderBadge(property: PropertyData, analysis: ProfitabilityAnalysis): Promise<void> {
    if (!this.userConfig) {
      this.userConfig = await this.configService.getConfig();
    }

    if (!this.userConfig.displayOptions.showBadges) {
      return;
    }
    const propertyElement = this.findPropertyElement(property.id);
    if (!propertyElement) {
      this.logger.error(`Property element not found for ID: ${property.id}`);
      return;
    }

    this.removeBadge(property);

    const analysisButton = this.createAnalysisButton(property, analysis);
    
    const descriptionContainer = propertyElement.querySelector('.item-description');
    if (descriptionContainer) {
      descriptionContainer.parentNode?.insertBefore(analysisButton, descriptionContainer.nextSibling);
      this.logger.log(`Investment analysis button rendered for property ${property.id}: ${analysis.recommendation}`);
    } else {
      this.logger.error(`Description container not found for property ${property.id}`);
    }
  }

  async renderLoadingBadge(property: PropertyData): Promise<void> {
    if (!this.userConfig) {
      this.userConfig = await this.configService.getConfig();
    }

    if (!this.userConfig.displayOptions.showLoadingStates) {
      return;
    }

    const propertyElement = this.findPropertyElement(property.id);
    if (!propertyElement) return;

    this.removeBadge(property);

    const badge = document.createElement('div');
    badge.className = 'investment-badge investment-badge--loading';
    badge.setAttribute('data-property-id', property.id);
    badge.textContent = 'Analyzing...';

    const multimediaContainer = propertyElement.querySelector('.item-multimedia');
    if (multimediaContainer) {
      multimediaContainer.appendChild(badge);
      this.logger.log(`Loading badge rendered for property ${property.id}`);
    }
  }

  renderNoDataBadge(property: PropertyData): void {
    const propertyElement = this.findPropertyElement(property.id);
    if (!propertyElement) return;

    this.removeBadge(property);

    const badge = document.createElement('div');
    badge.className = 'investment-badge investment-badge--no-data';
    badge.setAttribute('data-property-id', property.id);
    badge.innerHTML = `
      <div class="investment-badge__content">
        <div class="investment-badge__icon">📊</div>
        <div class="investment-badge__text">Sin datos de alquiler</div>
      </div>
    `;

    const multimediaContainer = propertyElement.querySelector('.item-multimedia');
    if (multimediaContainer) {
      multimediaContainer.appendChild(badge);
      this.logger.log(`No data badge rendered for property ${property.id}`);
    }
  }

  renderErrorBadge(property: PropertyData): void {
    const propertyElement = this.findPropertyElement(property.id);
    if (!propertyElement) return;

    this.removeBadge(property);

    const badge = document.createElement('div');
    badge.className = 'investment-badge investment-badge--error';
    badge.setAttribute('data-property-id', property.id);
    badge.innerHTML = `
      <div class="investment-badge__content">
        <div class="investment-badge__icon">⚠️</div>
        <div class="investment-badge__text">Error en análisis</div>
      </div>
    `;

    const multimediaContainer = propertyElement.querySelector('.item-multimedia');
    if (multimediaContainer) {
      multimediaContainer.appendChild(badge);
      this.logger.log(`Error badge rendered for property ${property.id}`);
    }
  }

  removeBadge(property: PropertyData): void {
    const existingElements = document.querySelectorAll(`[data-property-id="${property.id}"]`);
    existingElements.forEach(element => element.remove());
  }

  private findPropertyElement(propertyId: string): HTMLElement | null {
    return document.querySelector(`article.item[data-element-id="${propertyId}"]`) as HTMLElement;
  }

  private createAnalysisButton(property: PropertyData, analysis: ProfitabilityAnalysis): HTMLElement {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'investment-analysis-container';
    buttonContainer.setAttribute('data-property-id', analysis.propertyId);
    
    const button = document.createElement('button');
    button.className = `investment-analysis-button investment-analysis-button--${analysis.recommendation}`;
    button.innerHTML = `
      <div class="investment-analysis-button__content">
        <div class="investment-analysis-button__yield">
          <span class="investment-analysis-button__yield-label">Rentabilidad Neta:</span>
          <span class="investment-analysis-button__yield-value">${analysis.netYield}%</span>
        </div>
        <div class="investment-analysis-button__recommendation">
          ${this.getRecommendationText(analysis.recommendation)}
        </div>
        <div class="investment-analysis-button__icon">📊</div>
      </div>
    `;
    
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (!this.userConfig) {
        this.userConfig = await this.configService.getConfig();
      }
      
      if (this.userConfig.displayOptions.showModal) {
        this.openAnalysisModal(property, analysis);
        this.logger.log(`Investment modal opened for property ${property.id}`);
      }
    });
    
    buttonContainer.appendChild(button);
    
    return buttonContainer;
  }

  private openAnalysisModal(property: PropertyData, analysis: ProfitabilityAnalysis): void {
    const modalRenderer = new ModalRenderer(this.logger);
    modalRenderer.openModal(property, analysis);
  }

  private getRecommendationText(recommendation: string): string {
    switch (recommendation) {
      case 'excellent': return 'EXCELENTE INVERSIÓN';
      case 'good': return 'BUENA INVERSIÓN';
      case 'fair': return 'INVERSIÓN REGULAR';
      case 'poor': return 'MALA INVERSIÓN';
      default: return 'DESCONOCIDO';
    }
  }
}

class ModalRenderer {
  constructor(private logger: Logger) {}

  openModal(property: PropertyData, analysis: ProfitabilityAnalysis): void {
    const existingModal = document.querySelector('.investment-modal-overlay');
    if (existingModal) {
      existingModal.remove();
    }

    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'investment-modal-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'investment-modal';
    
    modal.innerHTML = this.createModalContent(property, analysis);
    
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);
    
    this.addEventListeners(modal, modalOverlay);
  }

  private createModalContent(property: PropertyData, analysis: ProfitabilityAnalysis): string {
    return `
      <div class="investment-modal__header">
        <h3 class="investment-modal__title">Análisis de Inversión</h3>
        <button class="investment-modal__close">×</button>
      </div>
      
      <div class="investment-modal__content">
        <div class="investment-modal__property-info">
          <h4>${property.title}</h4>
          <p class="investment-modal__property-details">
            ${property.rooms ? property.rooms + ' hab.' : ''} 
            ${property.size ? property.size + 'm²' : ''}
            ${property.floor ? ' • ' + property.floor : ''}
          </p>
        </div>

        <div class="investment-modal__analysis">
          <div class="investment-modal__recommendation investment-modal__recommendation--${analysis.recommendation}">
            <div class="investment-modal__recommendation-text">
              ${this.getRecommendationText(analysis.recommendation)}
            </div>
            <div class="investment-modal__recommendation-yield">
              Rentabilidad Neta: ${analysis.netYield}%
            </div>
          </div>

          <div class="investment-modal__details-grid">
            <div class="investment-modal__detail-item">
              <span class="investment-modal__label">Precio de compra</span>
              <span class="investment-modal__value">${analysis.purchasePrice.toLocaleString()}€</span>
            </div>
            
            <div class="investment-modal__detail-item">
              <span class="investment-modal__label">Alquiler estimado mensual</span>
              <span class="investment-modal__value">${analysis.estimatedRent.toLocaleString()}€</span>
            </div>
            
            <div class="investment-modal__detail-item">
              <span class="investment-modal__label">Gastos mensuales estimados</span>
              <span class="investment-modal__value">${analysis.monthlyExpenses.toLocaleString()}€</span>
            </div>
            
            <div class="investment-modal__divider"></div>
            
            <div class="investment-modal__detail-item">
              <span class="investment-modal__label">Rentabilidad bruta anual</span>
              <span class="investment-modal__value">${analysis.grossYield}%</span>
            </div>
            
            <div class="investment-modal__detail-item investment-modal__detail-item--highlight">
              <span class="investment-modal__label">Rentabilidad neta anual</span>
              <span class="investment-modal__value">${analysis.netYield}%</span>
            </div>
            
            <div class="investment-modal__risk investment-modal__risk--${analysis.riskLevel}">
              <div class="investment-modal__risk-dot"></div>
              <span>Nivel de riesgo: ${analysis.riskLevel.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private addEventListeners(modal: HTMLElement, modalOverlay: HTMLElement): void {
    const closeButton = modal.querySelector('.investment-modal__close');
    closeButton?.addEventListener('click', () => {
      modalOverlay.remove();
    });
    
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.remove();
      }
    });
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        modalOverlay.remove();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  private getRecommendationText(recommendation: string): string {
    switch (recommendation) {
      case 'excellent': return 'EXCELENTE INVERSIÓN';
      case 'good': return 'BUENA INVERSIÓN';
      case 'fair': return 'INVERSIÓN REGULAR';
      case 'poor': return 'MALA INVERSIÓN';
      default: return 'DESCONOCIDO';
    }
  }
}