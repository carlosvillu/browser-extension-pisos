import { IdealistaInvestmentAnalyzer } from './application/investment-analyzer';
import { LanguageService } from './domain/services/language-service';

let analyzer: IdealistaInvestmentAnalyzer;
let languageService: LanguageService;

// Initialize the analyzer and language service when the page loads
async function initializeAnalyzer() {
  languageService = new LanguageService();
  await languageService.initialize();
  
  analyzer = new IdealistaInvestmentAnalyzer();
  analyzer.initialize();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAnalyzer);
} else {
  initializeAnalyzer();
}

// Simple language change listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'LANGUAGE_CHANGED') {
    // Update language service
    languageService.loadLanguageFromStorage().then(() => {
      // Clear existing badges
      const existingBadges = document.querySelectorAll('[data-property-id]');
      existingBadges.forEach(badge => badge.remove());
      
      // Re-initialize analyzer with new language
      if (analyzer) {
        analyzer.initialize();
      }
    });
  }
});
