export interface UserConfig {
  expenseConfig: ExpenseConfig;
  mortgageConfig: MortgageConfig;
  profitabilityThresholds: ProfitabilityThresholds;
  displayOptions: DisplayOptions;
}

export interface ExpenseConfig {
  propertyManagementMonthly: number;
  insuranceMonthly: number;
  propertyTaxMonthly: number;
  communityFees: number;
  vacancyMaintenanceRate: number;
  maintenanceContingencyRate: number;
}

export interface MortgageConfig {
  loanToValueRatio: number;
  managementFeesRate: number;
  interestRate: number;
}

export interface ProfitabilityThresholds {
  excellent: number;
  good: number;
  fair: number;
}

export interface DisplayOptions {
  showBadges: boolean;
  showModal: boolean;
  showLoadingStates: boolean;
}

export class ConfigService {
  private static readonly STORAGE_KEY = 'investmentAnalysisConfig';

  private static readonly DEFAULT_CONFIG: UserConfig = {
    expenseConfig: {
      propertyManagementMonthly: 150,
      insuranceMonthly: 50,
      propertyTaxMonthly: 100,
      communityFees: 60,
      vacancyMaintenanceRate: 0.05,
      maintenanceContingencyRate: 0.01,
    },
    mortgageConfig: {
      loanToValueRatio: 0.8,
      managementFeesRate: 0.1,
      interestRate: 2.45,
    },
    profitabilityThresholds: {
      excellent: 6,
      good: 4,
      fair: 2,
    },
    displayOptions: {
      showBadges: true,
      showModal: true,
      showLoadingStates: true,
    },
  };

  async getConfig(): Promise<UserConfig> {
    try {
      const result = await chrome.storage.sync.get(ConfigService.STORAGE_KEY);
      const storedConfig = result[ConfigService.STORAGE_KEY];

      if (!storedConfig) {
        return ConfigService.DEFAULT_CONFIG;
      }

      // Migrar configuraciones antiguas
      const migratedConfig = this.migrateOldConfig(storedConfig);

      return { ...ConfigService.DEFAULT_CONFIG, ...migratedConfig };
    } catch (error) {
      console.error('Error loading config:', error);
      return ConfigService.DEFAULT_CONFIG;
    }
  }

  private migrateOldConfig(config: any): any {
    // Migrar de communityFeesWithGarage/communityFeesWithoutGarage a communityFees
    if (config.expenseConfig) {
      if (config.expenseConfig.communityFeesWithGarage && !config.expenseConfig.communityFees) {
        // Usar el valor promedio de los dos campos antiguos
        const avgCommunity = Math.round(
          ((config.expenseConfig.communityFeesWithGarage || 80) +
            (config.expenseConfig.communityFeesWithoutGarage || 40)) /
            2,
        );

        config.expenseConfig.communityFees = avgCommunity;

        // Limpiar campos antiguos
        delete config.expenseConfig.communityFeesWithGarage;
        delete config.expenseConfig.communityFeesWithoutGarage;
      }
    }

    return config;
  }

  async updateConfig(partialConfig: Partial<UserConfig>): Promise<void> {
    try {
      const currentConfig = await this.getConfig();
      const newConfig = { ...currentConfig, ...partialConfig };

      await chrome.storage.sync.set({
        [ConfigService.STORAGE_KEY]: newConfig,
      });
    } catch (error) {
      console.error('Error saving config:', error);
      throw error;
    }
  }

  async resetToDefaults(): Promise<void> {
    try {
      await chrome.storage.sync.set({
        [ConfigService.STORAGE_KEY]: ConfigService.DEFAULT_CONFIG,
      });
    } catch (error) {
      console.error('Error resetting config:', error);
      throw error;
    }
  }
}
