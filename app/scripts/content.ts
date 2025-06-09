import { IdealistaInvestmentAnalyzer } from "./application/investment-analyzer";
import { LanguageService } from "./domain/services/language-service";

let analyzer: IdealistaInvestmentAnalyzer;
let languageService: LanguageService;

// Initialize the analyzer and language service when the page loads
async function initializeAnalyzer() {
  languageService = new LanguageService();
  await languageService.initialize();

  analyzer = new IdealistaInvestmentAnalyzer(languageService);
  analyzer.initialize();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeAnalyzer);
} else {
  initializeAnalyzer();
}

// Simple language change listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script received message:', message);
  debugger;
  if (message.type === "LANGUAGE_CHANGED") {
    console.log('Processing language change to:', message.language);
    // Update language service
    languageService.loadLanguageFromStorage().then(() => {
      console.log('Language service updated, current language:', languageService.getLanguage());
      // Clear existing badges
      const existingBadges = document.querySelectorAll("[data-property-id]");
      console.log('Removing existing badges:', existingBadges.length);
      existingBadges.forEach((badge) => badge.remove());

      // Re-initialize analyzer with updated language service
      if (analyzer) {
        console.log('Re-initializing analyzer with new language');
        // Create new analyzer instance with updated language service
        analyzer = new IdealistaInvestmentAnalyzer(languageService);
        analyzer.initialize();
      }
    });
  }
});
