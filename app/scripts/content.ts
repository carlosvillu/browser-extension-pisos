import { IdealistaInvestmentAnalyzer } from './application/investment-analyzer';

// Initialize the analyzer when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const analyzer = new IdealistaInvestmentAnalyzer();
    analyzer.initialize();
  });
} else {
  const analyzer = new IdealistaInvestmentAnalyzer();
  analyzer.initialize();
}
