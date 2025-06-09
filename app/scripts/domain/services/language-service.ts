export class LanguageService {
  private currentLanguage: string = 'en'; // Default to English
  private messages: Record<string, Record<string, string>> = {};
  private initialized: boolean = false;

  constructor() {
    this.loadMessages();
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // Try to get saved language from storage
      const result = await chrome.storage.local.get(['language']);
      if (result.language && (result.language === 'es' || result.language === 'en')) {
        this.currentLanguage = result.language;
      } else {
        // If no saved language, check browser language
        const browserLang = this.getBrowserLanguage();
        this.currentLanguage = (browserLang === 'es') ? 'es' : 'en';
        // Save the determined language
        await chrome.storage.local.set({ language: this.currentLanguage });
      }
    } catch (error) {
      console.warn('Error initializing language:', error);
      this.currentLanguage = 'en'; // Fallback to English
    }
    
    this.initialized = true;
  }

  private getBrowserLanguage(): string {
    if (typeof chrome !== 'undefined' && chrome.i18n && chrome.i18n.getUILanguage) {
      return chrome.i18n.getUILanguage().split('-')[0];
    }
    return navigator.language?.split('-')[0] || 'en';
  }

  private loadMessages(): void {
    // Spanish messages
    this.messages['es'] = {
      appName: 'Análisis de Inversión Inmobiliaria',
      popupTitle: 'Configuración - Análisis de Inversión',
      configurationTitle: 'Configuración de Análisis',
      languageSelector: 'Idioma',
      languageSpanish: 'Español',
      languageEnglish: 'Inglés',
      estimatedExpensesTitle: 'Gastos Estimados',
      propertyManagementLabel: 'Gestión inmobiliaria (€)',
      monthlyFixedCost: 'Coste mensual fijo',
      insuranceLabel: 'Seguro (€)',
      ibiLabel: 'IBI (€)',
      vacancyLabel: 'Vacancia (%)',
      rentalPercentage: '% del alquiler',
      repairsLabel: 'Reparaciones y contingencias (%)',
      repairsHelp: '% del alquiler para calentadores, averías, mejoras, etc.',
      communityLabel: 'Comunidad (€)',
      communityHelp: 'Gastos de comunidad mensual',
      mortgageConfigTitle: 'Configuración de Hipoteca',
      financingLabel: 'Financiación (%)',
      priceFinnancedPercentage: '% del precio financiado',
      interestLabel: 'Interés (%)',
      annualTinHelp: 'TIN anual de la hipoteca',
      managementFeesLabel: 'Gastos de gestión (%)',
      managementFeesHelp: '% del precio de compra (notaría, registro, tasación, etc.)',
      profitabilityThresholdsTitle: 'Umbrales de Rentabilidad',
      excellentLabel: 'Excelente (%)',
      goodLabel: 'Buena (%)',
      regularLabel: 'Regular (%)',
      displayOptionsTitle: 'Opciones de Visualización',
      showProfitabilityIndicators: 'Mostrar indicadores de rentabilidad',
      allowDetailsModal: 'Permitir modal de detalles',
      showLoadingStates: 'Mostrar estados de carga',
      restoreButton: 'Restaurar',
      saveButton: 'Guardar',
      errorLoadingConfig: 'Error al cargar la configuración',
      configSavedSuccessfully: 'Configuración guardada correctamente',
      errorSavingConfig: 'Error al guardar la configuración',
      configRestoredSuccessfully: 'Configuración restaurada a valores por defecto',
      errorRestoringConfig: 'Error al restaurar la configuración',
      analyzing: 'Analizando...',
      noRentalData: 'Sin datos de alquiler',
      analysisError: 'Error en análisis',
      netProfitability: 'Rentabilidad Neta:',
      excellentInvestment: 'EXCELENTE INVERSIÓN',
      goodInvestment: 'BUENA INVERSIÓN',
      regularInvestment: 'INVERSIÓN REGULAR',
      badInvestment: 'MALA INVERSIÓN',
      unknownInvestment: 'DESCONOCIDO',
      investmentAnalysisTitle: 'Análisis de Inversión',
      roomsSuffix: ' hab.',
      sizeSuffix: 'm²',
      purchasePrice: 'Precio de compra',
      monthlyRentalEstimate: 'Alquiler estimado mensual',
      monthlyExpensesEstimate: 'Gastos mensuales estimados',
      grossAnnualProfitability: 'Rentabilidad bruta anual',
      netAnnualProfitability: 'Rentabilidad neta anual',
      riskLevel: 'Nivel de riesgo: '
    };

    // English messages
    this.messages['en'] = {
      appName: 'Real Estate Investment Analysis',
      popupTitle: 'Configuration - Investment Analysis',
      configurationTitle: 'Analysis Configuration',
      languageSelector: 'Language',
      languageSpanish: 'Spanish',
      languageEnglish: 'English',
      estimatedExpensesTitle: 'Estimated Expenses',
      propertyManagementLabel: 'Property management (€)',
      monthlyFixedCost: 'Monthly fixed cost',
      insuranceLabel: 'Insurance (€)',
      ibiLabel: 'Property tax (€)',
      vacancyLabel: 'Vacancy (%)',
      rentalPercentage: '% of rental income',
      repairsLabel: 'Repairs and contingencies (%)',
      repairsHelp: '% of rental for heating, breakdowns, improvements, etc.',
      communityLabel: 'Community fees (€)',
      communityHelp: 'Monthly community expenses',
      mortgageConfigTitle: 'Mortgage Configuration',
      financingLabel: 'Financing (%)',
      priceFinnancedPercentage: '% of price financed',
      interestLabel: 'Interest (%)',
      annualTinHelp: 'Annual mortgage interest rate',
      managementFeesLabel: 'Management fees (%)',
      managementFeesHelp: '% of purchase price (notary, registry, appraisal, etc.)',
      profitabilityThresholdsTitle: 'Profitability Thresholds',
      excellentLabel: 'Excellent (%)',
      goodLabel: 'Good (%)',
      regularLabel: 'Regular (%)',
      displayOptionsTitle: 'Display Options',
      showProfitabilityIndicators: 'Show profitability indicators',
      allowDetailsModal: 'Allow details modal',
      showLoadingStates: 'Show loading states',
      restoreButton: 'Restore',
      saveButton: 'Save',
      errorLoadingConfig: 'Error loading configuration',
      configSavedSuccessfully: 'Configuration saved successfully',
      errorSavingConfig: 'Error saving configuration',
      configRestoredSuccessfully: 'Configuration restored to default values',
      errorRestoringConfig: 'Error restoring configuration',
      analyzing: 'Analyzing...',
      noRentalData: 'No rental data',
      analysisError: 'Analysis error',
      netProfitability: 'Net Profitability:',
      excellentInvestment: 'EXCELLENT INVESTMENT',
      goodInvestment: 'GOOD INVESTMENT',
      regularInvestment: 'REGULAR INVESTMENT',
      badInvestment: 'BAD INVESTMENT',
      unknownInvestment: 'UNKNOWN',
      investmentAnalysisTitle: 'Investment Analysis',
      roomsSuffix: ' rooms',
      sizeSuffix: 'm²',
      purchasePrice: 'Purchase price',
      monthlyRentalEstimate: 'Monthly rental estimate',
      monthlyExpensesEstimate: 'Monthly expenses estimate',
      grossAnnualProfitability: 'Gross annual profitability',
      netAnnualProfitability: 'Net annual profitability',
      riskLevel: 'Risk level: '
    };
  }

  public async setLanguage(language: string): Promise<void> {
    if (language === 'es' || language === 'en') {
      this.currentLanguage = language;
      try {
        await chrome.storage.local.set({ language: language });
        // Send simple message to content scripts
        this.notifyLanguageChange(language);
      } catch (error) {
        console.warn('Error saving language preference:', error);
      }
    }
  }

  private notifyLanguageChange(language: string): void {
    // Send message to active tab only
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id && tabs[0].url?.includes('idealista.com')) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'LANGUAGE_CHANGED',
          language: language
        }).catch(() => {
          // Ignore errors if content script is not loaded
        });
      }
    });
  }

  public getLanguage(): string {
    return this.currentLanguage;
  }

  public async loadLanguageFromStorage(): Promise<void> {
    try {
      const result = await chrome.storage.local.get(['language']);
      if (result.language && (result.language === 'es' || result.language === 'en')) {
        this.currentLanguage = result.language;
      }
    } catch (error) {
      console.warn('Error loading language from storage:', error);
    }
  }

  public getMessage(key: string): string {
    return this.messages[this.currentLanguage]?.[key] || key;
  }

  public formatCurrency(amount: number, currency: string = 'EUR'): string {
    try {
      const locale = this.currentLanguage === 'es' ? 'es-ES' : 'en-US';
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (error) {
      console.warn('Error formatting currency:', error);
      return `${amount.toLocaleString()}€`;
    }
  }

  public formatPercentage(value: number, decimals: number = 2): string {
    try {
      const locale = this.currentLanguage === 'es' ? 'es-ES' : 'en-US';
      return new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(value / 100);
    } catch (error) {
      console.warn('Error formatting percentage:', error);
      return `${value.toFixed(decimals)}%`;
    }
  }
}