export class I18nService {
  private static instance: I18nService;
  private currentLanguage: string = 'en'; // Default to English

  private constructor() {
    this.initializeLanguage();
  }

  public static getInstance(): I18nService {
    if (!I18nService.instance) {
      I18nService.instance = new I18nService();
    }
    return I18nService.instance;
  }

  private async initializeLanguage(): Promise<void> {
    try {
      // Try to get saved language from storage
      const result = await chrome.storage.local.get(['userLanguage']);
      if (result.userLanguage && (result.userLanguage === 'es' || result.userLanguage === 'en')) {
        this.currentLanguage = result.userLanguage;
      } else {
        // If no saved language, check browser language
        const browserLang = this.getBrowserLanguage();
        this.currentLanguage = (browserLang === 'es') ? 'es' : 'en';
        // Save the determined language
        await chrome.storage.local.set({ userLanguage: this.currentLanguage });
      }
    } catch (error) {
      console.warn('Error initializing language:', error);
      this.currentLanguage = 'en'; // Fallback to English
    }
  }

  private getBrowserLanguage(): string {
    if (typeof chrome !== 'undefined' && chrome.i18n && chrome.i18n.getUILanguage) {
      return chrome.i18n.getUILanguage().split('-')[0];
    }
    return navigator.language?.split('-')[0] || 'en';
  }

  public async setLanguage(language: string): Promise<void> {
    if (language === 'es' || language === 'en') {
      this.currentLanguage = language;
      try {
        await chrome.storage.local.set({ userLanguage: language });
      } catch (error) {
        console.warn('Error saving language preference:', error);
      }
    }
  }

  public async getLanguage(): Promise<string> {
    if (!this.currentLanguage) {
      await this.initializeLanguage();
    }
    return this.currentLanguage;
  }

  /**
   * Get internationalized message
   * @param key Message key
   * @param substitutions Optional substitutions for placeholders
   * @returns Translated message
   */
  getMessage(key: string, substitutions?: string | string[]): string {
    if (typeof chrome !== 'undefined' && chrome.i18n && chrome.i18n.getMessage) {
      return chrome.i18n.getMessage(key, substitutions) || key;
    }

    // Fallback for environments where chrome.i18n is not available
    return key;
  }

  /**
   * Format currency amount based on locale
   * @param amount Amount to format
   * @param currency Currency code (default: EUR)
   * @returns Formatted currency string
   */
  formatCurrency(amount: number, currency = 'EUR'): string {
    try {
      if (typeof chrome !== 'undefined' && chrome.i18n && chrome.i18n.getUILanguage) {
        const locale = chrome.i18n.getUILanguage();
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(amount);
      }
    } catch (error) {
      console.warn('Error formatting currency:', error);
    }

    // Fallback formatting
    return `${amount.toLocaleString()}€`;
  }

  /**
   * Format percentage based on locale
   * @param value Percentage value (0-100)
   * @param decimals Number of decimal places
   * @returns Formatted percentage string
   */
  formatPercentage(value: number, decimals = 2): string {
    try {
      if (typeof chrome !== 'undefined' && chrome.i18n && chrome.i18n.getUILanguage) {
        const locale = chrome.i18n.getUILanguage();
        return new Intl.NumberFormat(locale, {
          style: 'percent',
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(value / 100);
      }
    } catch (error) {
      console.warn('Error formatting percentage:', error);
    }

    // Fallback formatting
    return `${value.toFixed(decimals)}%`;
  }

  /**
   * Get current UI language
   * @returns Language code (e.g., 'en', 'es')
   */
  getCurrentLanguage(): string {
    if (typeof chrome !== 'undefined' && chrome.i18n && chrome.i18n.getUILanguage) {
      return chrome.i18n.getUILanguage().split('-')[0];
    }
    return 'es'; // Default fallback
  }
}
