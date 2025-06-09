export class LanguageService {
  // Supported languages - ADD NEW LANGUAGES HERE
  // When adding a new language:
  // 1. Add language code to SUPPORTED_LANGUAGES array
  // 2. Add locale mapping to LOCALE_MAP object  
  // 3. Add translations dictionary in loadMessages() method
  // 4. Create _locales/{lang}/ directory with messages.json and detailed-description.txt
  // 5. Add option to popup.html language selector
  private static readonly SUPPORTED_LANGUAGES = ['es', 'en', 'fr'];
  private static readonly DEFAULT_LANGUAGE = 'en';
  
  // Locale mapping for formatting - ADD NEW LOCALES HERE
  private static readonly LOCALE_MAP: Record<string, string> = {
    'es': 'es-ES',
    'en': 'en-US', 
    'fr': 'fr-FR'
  };

  private currentLanguage: string = LanguageService.DEFAULT_LANGUAGE;
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
      if (result.language && this.isValidLanguage(result.language)) {
        this.currentLanguage = result.language;
      } else {
        // If no saved language, check browser language
        const browserLang = this.getBrowserLanguage();
        this.currentLanguage = this.isValidLanguage(browserLang) ? browserLang : LanguageService.DEFAULT_LANGUAGE;
        // Save the determined language
        await chrome.storage.local.set({ language: this.currentLanguage });
      }
    } catch (error) {
      console.warn('Error initializing language:', error);
      this.currentLanguage = LanguageService.DEFAULT_LANGUAGE; // Fallback to default
    }
    
    this.initialized = true;
  }

  /**
   * Check if a language is supported by the service
   * @param language Language code to validate
   * @returns true if language is supported
   */
  private isValidLanguage(language: string): boolean {
    return LanguageService.SUPPORTED_LANGUAGES.includes(language);
  }

  /**
   * Get the list of supported languages
   * @returns Array of supported language codes
   */
  public static getSupportedLanguages(): string[] {
    return [...LanguageService.SUPPORTED_LANGUAGES];
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
      languageFrench: 'Francés',
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
      languageFrench: 'French',
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

    // French messages
    this.messages['fr'] = {
      appName: 'Analyse d\'Investissement Immobilier',
      popupTitle: 'Configuration - Analyse d\'Investissement',
      configurationTitle: 'Configuration de l\'Analyse',
      languageSelector: 'Langue',
      languageSpanish: 'Espagnol',
      languageEnglish: 'Anglais',
      languageFrench: 'Français',
      estimatedExpensesTitle: 'Dépenses Estimées',
      propertyManagementLabel: 'Gestion immobilière (€)',
      monthlyFixedCost: 'Coût mensuel fixe',
      insuranceLabel: 'Assurance (€)',
      ibiLabel: 'Taxe foncière (€)',
      vacancyLabel: 'Vacance (%)',
      rentalPercentage: '% du revenu locatif',
      repairsLabel: 'Réparations et contingences (%)',
      repairsHelp: '% du loyer pour chauffage, pannes, améliorations, etc.',
      communityLabel: 'Charges de copropriété (€)',
      communityHelp: 'Charges mensuelles de copropriété',
      mortgageConfigTitle: 'Configuration Hypothécaire',
      financingLabel: 'Financement (%)',
      priceFinnancedPercentage: '% du prix financé',
      interestLabel: 'Intérêt (%)',
      annualTinHelp: 'Taux d\'intérêt annuel de l\'hypothèque',
      managementFeesLabel: 'Frais de gestion (%)',
      managementFeesHelp: '% du prix d\'achat (notaire, registre, évaluation, etc.)',
      profitabilityThresholdsTitle: 'Seuils de Rentabilité',
      excellentLabel: 'Excellent (%)',
      goodLabel: 'Bon (%)',
      regularLabel: 'Régulier (%)',
      displayOptionsTitle: 'Options d\'Affichage',
      showProfitabilityIndicators: 'Afficher les indicateurs de rentabilité',
      allowDetailsModal: 'Permettre le modal de détails',
      showLoadingStates: 'Afficher les états de chargement',
      restoreButton: 'Restaurer',
      saveButton: 'Sauvegarder',
      errorLoadingConfig: 'Erreur lors du chargement de la configuration',
      configSavedSuccessfully: 'Configuration sauvegardée avec succès',
      errorSavingConfig: 'Erreur lors de la sauvegarde de la configuration',
      configRestoredSuccessfully: 'Configuration restaurée aux valeurs par défaut',
      errorRestoringConfig: 'Erreur lors de la restauration de la configuration',
      analyzing: 'Analyse en cours...',
      noRentalData: 'Aucune donnée locative',
      analysisError: 'Erreur d\'analyse',
      netProfitability: 'Rentabilité Nette:',
      excellentInvestment: 'EXCELLENT INVESTISSEMENT',
      goodInvestment: 'BON INVESTISSEMENT',
      regularInvestment: 'INVESTISSEMENT RÉGULIER',
      badInvestment: 'MAUVAIS INVESTISSEMENT',
      unknownInvestment: 'INCONNU',
      investmentAnalysisTitle: 'Analyse d\'Investissement',
      roomsSuffix: ' pièces',
      sizeSuffix: 'm²',
      purchasePrice: 'Prix d\'achat',
      monthlyRentalEstimate: 'Estimation du loyer mensuel',
      monthlyExpensesEstimate: 'Estimation des dépenses mensuelles',
      grossAnnualProfitability: 'Rentabilité annuelle brute',
      netAnnualProfitability: 'Rentabilité annuelle nette',
      riskLevel: 'Niveau de risque: '
    };
  }

  public async setLanguage(language: string): Promise<void> {
    if (this.isValidLanguage(language)) {
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
      const tab = tabs[0];
      if (tab?.id && tab.url) {
        console.log('Current tab URL:', tab.url);
        if (tab.url.includes('idealista.com')) {
          console.log('Sending language change message to Idealista tab. Language:', language);
          chrome.tabs.sendMessage(tab.id, {
            type: 'LANGUAGE_CHANGED',
            language: language
          }).then(() => {
            console.log('Language change message sent successfully');
          }).catch((error) => {
            console.warn('Error sending language change message:', error);
          });
        } else {
          console.log('Not an Idealista tab, skipping message send');
        }
      } else {
        console.warn('No active tab found or tab has no URL');
      }
    });
  }

  public getLanguage(): string {
    return this.currentLanguage;
  }

  public async loadLanguageFromStorage(): Promise<void> {
    try {
      const result = await chrome.storage.local.get(['language']);
      if (result.language && this.isValidLanguage(result.language)) {
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
      const locale = LanguageService.LOCALE_MAP[this.currentLanguage] || LanguageService.LOCALE_MAP[LanguageService.DEFAULT_LANGUAGE];
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
      const locale = LanguageService.LOCALE_MAP[this.currentLanguage] || LanguageService.LOCALE_MAP[LanguageService.DEFAULT_LANGUAGE];
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