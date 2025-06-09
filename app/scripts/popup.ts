import { UserConfig, ConfigService } from './domain/services/config-service';

class PopupController {
  private configService: ConfigService;
  private form: HTMLFormElement;
  private statusMessage: HTMLElement;

  constructor() {
    this.configService = new ConfigService();
    this.form = document.getElementById('configForm') as HTMLFormElement;
    this.statusMessage = document.getElementById('statusMessage') as HTMLElement;
    
    this.initialize();
  }

  private async initialize(): Promise<void> {
    await this.loadConfig();
    this.attachEventListeners();
  }

  private async loadConfig(): Promise<void> {
    try {
      const config = await this.configService.getConfig();
      this.populateForm(config);
    } catch (error) {
      this.showStatus('Error al cargar la configuración', 'error');
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
  }

  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    
    try {
      const formData = new FormData(this.form);
      const config = this.extractConfigFromForm();
      
      await this.configService.updateConfig(config);
      this.showStatus('Configuración guardada correctamente', 'success');
      
      setTimeout(() => {
        this.hideStatus();
      }, 3000);
      
    } catch (error) {
      this.showStatus('Error al guardar la configuración', 'error');
    }
  }

  private async handleReset(): Promise<void> {
    try {
      await this.configService.resetToDefaults();
      await this.loadConfig();
      this.showStatus('Configuración restaurada a valores por defecto', 'success');
      
      setTimeout(() => {
        this.hideStatus();
      }, 3000);
      
    } catch (error) {
      this.showStatus('Error al restaurar la configuración', 'error');
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
        propertyManagementMonthly: parseInt(getInputValue('propertyManagement')),
        insuranceMonthly: parseInt(getInputValue('insurance')),
        propertyTaxMonthly: parseInt(getInputValue('propertyTax')),
        communityFees: parseInt(getInputValue('communityFees')),
        vacancyMaintenanceRate: parseFloat(getInputValue('vacancyMaintenance')) / 100,
        maintenanceContingencyRate: parseFloat(getInputValue('maintenanceContingency')) / 100,
      },
      mortgageConfig: {
        loanToValueRatio: parseFloat(getInputValue('loanToValue')) / 100,
        interestRate: parseFloat(getInputValue('interestRate')),
        managementFeesRate: parseFloat(getInputValue('managementFees')) / 100,
      },
      profitabilityThresholds: {
        excellent: parseFloat(getInputValue('excellentThreshold')),
        good: parseFloat(getInputValue('goodThreshold')),
        fair: parseFloat(getInputValue('fairThreshold')),
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
}

document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});