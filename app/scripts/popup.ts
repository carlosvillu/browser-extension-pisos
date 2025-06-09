import { ConfigService, type UserConfig } from './domain/services/config-service';
import { LanguageService } from './domain/services/language-service';

class PopupController {
  private configService: ConfigService;
  private languageService: LanguageService;
  private form: HTMLFormElement;
  private statusMessage: HTMLElement;

  constructor() {
    this.configService = new ConfigService();
    this.languageService = new LanguageService();
    this.form = document.getElementById('configForm') as HTMLFormElement;
    this.statusMessage = document.getElementById('statusMessage') as HTMLElement;

    this.initialize();
  }

  private async initialize(): Promise<void> {
    await this.languageService.initialize();
    await this.setupLanguage();
    this.localizeUI();
    await this.loadConfig();
    this.attachEventListeners();
  }

  private async setupLanguage(): Promise<void> {
    const currentLang = this.languageService.getLanguage();
    const languageSelector = document.getElementById('languageSelector') as HTMLSelectElement;
    if (languageSelector) {
      languageSelector.value = currentLang;
    }
  }

  private async loadConfig(): Promise<void> {
    try {
      const config = await this.configService.getConfig();
      this.populateForm(config);
    } catch (error) {
      this.showStatus(this.languageService.getMessage('errorLoadingConfig'), 'error');
    }
  }

  private populateForm(config: UserConfig): void {
    const elements = {
      propertyManagement: document.getElementById('propertyManagement') as HTMLInputElement,
      insurance: document.getElementById('insurance') as HTMLInputElement,
      propertyTax: document.getElementById('propertyTax') as HTMLInputElement,
      communityFees: document.getElementById('communityFees') as HTMLInputElement,
      vacancyMaintenance: document.getElementById('vacancyMaintenance') as HTMLInputElement,
      maintenanceContingency: document.getElementById('maintenanceContingency') as HTMLInputElement,
      loanToValue: document.getElementById('loanToValue') as HTMLInputElement,
      interestRate: document.getElementById('interestRate') as HTMLInputElement,
      managementFees: document.getElementById('managementFees') as HTMLInputElement,
      excellentThreshold: document.getElementById('excellentThreshold') as HTMLInputElement,
      goodThreshold: document.getElementById('goodThreshold') as HTMLInputElement,
      fairThreshold: document.getElementById('fairThreshold') as HTMLInputElement,
      showBadges: document.getElementById('showBadges') as HTMLInputElement,
      showModal: document.getElementById('showModal') as HTMLInputElement,
      showLoadingStates: document.getElementById('showLoadingStates') as HTMLInputElement,
    };

    elements.propertyManagement.value = config.expenseConfig.propertyManagementMonthly.toString();
    elements.insurance.value = config.expenseConfig.insuranceMonthly.toString();
    elements.propertyTax.value = config.expenseConfig.propertyTaxMonthly.toString();
    elements.communityFees.value = config.expenseConfig.communityFees.toString();
    elements.vacancyMaintenance.value = (config.expenseConfig.vacancyMaintenanceRate * 100).toString();
    elements.maintenanceContingency.value = (config.expenseConfig.maintenanceContingencyRate * 100).toString();

    elements.loanToValue.value = (config.mortgageConfig.loanToValueRatio * 100).toString();
    elements.interestRate.value = config.mortgageConfig.interestRate.toString();
    elements.managementFees.value = (config.mortgageConfig.managementFeesRate * 100).toString();

    elements.excellentThreshold.value = config.profitabilityThresholds.excellent.toString();
    elements.goodThreshold.value = config.profitabilityThresholds.good.toString();
    elements.fairThreshold.value = config.profitabilityThresholds.fair.toString();

    elements.showBadges.checked = config.displayOptions.showBadges;
    elements.showModal.checked = config.displayOptions.showModal;
    elements.showLoadingStates.checked = config.displayOptions.showLoadingStates;
  }

  private attachEventListeners(): void {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));

    const resetButton = document.getElementById('resetButton');
    resetButton?.addEventListener('click', this.handleReset.bind(this));

    const languageSelector = document.getElementById('languageSelector') as HTMLSelectElement;
    languageSelector?.addEventListener('change', this.handleLanguageChange.bind(this));
  }

  private async handleLanguageChange(event: Event): Promise<void> {
    const target = event.target as HTMLSelectElement;
    const newLanguage = target.value;
    
    await this.languageService.setLanguage(newLanguage);
    this.localizeUI();
  }

  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();

    try {
      const formData = new FormData(this.form);
      const config = this.extractConfigFromForm();

      await this.configService.updateConfig(config);
      this.showStatus(this.languageService.getMessage('configSavedSuccessfully'), 'success');

      setTimeout(() => {
        this.hideStatus();
      }, 3000);
    } catch (error) {
      this.showStatus(this.languageService.getMessage('errorSavingConfig'), 'error');
    }
  }

  private async handleReset(): Promise<void> {
    try {
      await this.configService.resetToDefaults();
      await this.loadConfig();
      this.showStatus(this.languageService.getMessage('configRestoredSuccessfully'), 'success');

      setTimeout(() => {
        this.hideStatus();
      }, 3000);
    } catch (error) {
      this.showStatus(this.languageService.getMessage('errorRestoringConfig'), 'error');
    }
  }

  private extractConfigFromForm(): Partial<UserConfig> {
    const getInputValue = (id: string): string => {
      const element = document.getElementById(id) as HTMLInputElement;
      return element?.value || '';
    };

    const getCheckboxValue = (id: string): boolean => {
      const element = document.getElementById(id) as HTMLInputElement;
      return element?.checked || false;
    };

    return {
      expenseConfig: {
        propertyManagementMonthly: Number.parseInt(getInputValue('propertyManagement')),
        insuranceMonthly: Number.parseInt(getInputValue('insurance')),
        propertyTaxMonthly: Number.parseInt(getInputValue('propertyTax')),
        communityFees: Number.parseInt(getInputValue('communityFees')),
        vacancyMaintenanceRate: Number.parseFloat(getInputValue('vacancyMaintenance')) / 100,
        maintenanceContingencyRate: Number.parseFloat(getInputValue('maintenanceContingency')) / 100,
      },
      mortgageConfig: {
        loanToValueRatio: Number.parseFloat(getInputValue('loanToValue')) / 100,
        interestRate: Number.parseFloat(getInputValue('interestRate')),
        managementFeesRate: Number.parseFloat(getInputValue('managementFees')) / 100,
      },
      profitabilityThresholds: {
        excellent: Number.parseFloat(getInputValue('excellentThreshold')),
        good: Number.parseFloat(getInputValue('goodThreshold')),
        fair: Number.parseFloat(getInputValue('fairThreshold')),
      },
      displayOptions: {
        showBadges: getCheckboxValue('showBadges'),
        showModal: getCheckboxValue('showModal'),
        showLoadingStates: getCheckboxValue('showLoadingStates'),
      },
    };
  }

  private showStatus(message: string, type: 'success' | 'error'): void {
    this.statusMessage.textContent = message;
    this.statusMessage.className = `status-message status-${type}`;
    this.statusMessage.style.display = 'block';
  }

  private hideStatus(): void {
    this.statusMessage.style.display = 'none';
  }

  private localizeUI(): void {
    // Update page title
    const titleElement = document.getElementById('popup-title');
    if (titleElement) {
      titleElement.textContent = this.languageService.getMessage('popupTitle');
    }

    // Update all elements with data-i18n attributes
    const elementsToLocalize = document.querySelectorAll('[data-i18n]');
    elementsToLocalize.forEach((element) => {
      const key = element.getAttribute('data-i18n');
      if (key) {
        element.textContent = this.languageService.getMessage(key);
      }
    });

    // Update elements by ID
    const elementMappings = {
      'config-header-title': 'configurationTitle',
      'language-selector-label': 'languageSelector',
      'language-option-es': 'languageSpanish',
      'language-option-en': 'languageEnglish',
      'expenses-title': 'estimatedExpensesTitle',
      'property-management-label': 'propertyManagementLabel',
      'property-management-help': 'monthlyFixedCost',
      'insurance-label': 'insuranceLabel',
      'insurance-help': 'monthlyFixedCost',
      'property-tax-label': 'ibiLabel',
      'property-tax-help': 'monthlyFixedCost',
      'vacancy-label': 'vacancyLabel',
      'vacancy-help': 'rentalPercentage',
      'maintenance-contingency-label': 'repairsLabel',
      'maintenance-contingency-help': 'repairsHelp',
      'community-fees-label': 'communityLabel',
      'community-fees-help': 'communityHelp',
      'mortgage-title': 'mortgageConfigTitle',
      'loan-to-value-label': 'financingLabel',
      'loan-to-value-help': 'priceFinnancedPercentage',
      'interest-rate-label': 'interestLabel',
      'interest-rate-help': 'annualTinHelp',
      'management-fees-label': 'managementFeesLabel',
      'management-fees-help': 'managementFeesHelp',
      'profitability-thresholds-title': 'profitabilityThresholdsTitle',
      'excellent-threshold-label': 'excellentLabel',
      'good-threshold-label': 'goodLabel',
      'fair-threshold-label': 'regularLabel',
      'display-options-title': 'displayOptionsTitle',
      'show-badges-label': 'showProfitabilityIndicators',
      'show-modal-label': 'allowDetailsModal',
      'show-loading-states-label': 'showLoadingStates',
      'save-button': 'saveButton',
    };

    Object.entries(elementMappings).forEach(([elementId, messageKey]) => {
      const element = document.getElementById(elementId);
      if (element) {
        element.textContent = this.languageService.getMessage(messageKey);
      }
    });

    // Update reset button
    const resetButton = document.getElementById('resetButton');
    if (resetButton) {
      resetButton.textContent = this.languageService.getMessage('restoreButton');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});
