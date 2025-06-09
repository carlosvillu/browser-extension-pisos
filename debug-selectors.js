// Debug script to test selectors on Idealista
// Run this in the browser console on https://www.idealista.com/venta-viviendas/madrid/

console.log('=== DEBUGGING IDEALISTA SELECTORS ===');

// Test property container selector
const propertyElements = document.querySelectorAll('article.item');
console.log(`Found ${propertyElements.length} property articles`);

if (propertyElements.length > 0) {
  console.log('First property element:', propertyElements[0]);
  
  // Check data-element-id
  const firstId = propertyElements[0].getAttribute('data-element-id');
  console.log('First property ID:', firstId);
  
  // Test price selector
  const priceElement = propertyElements[0].querySelector('.item-price');
  console.log('Price element:', priceElement);
  console.log('Price text:', priceElement?.textContent);
  
  // Test description selector for button placement
  const descriptionElement = propertyElements[0].querySelector('.item-description');
  console.log('Description element:', descriptionElement);
  
  // Test multimedia for badge placement
  const multimediaElement = propertyElements[0].querySelector('.item-multimedia');
  console.log('Multimedia element:', multimediaElement);
} else {
  console.log('❌ No property elements found. Page might not be a property listing.');
}

// Test URL analysis
console.log('Current URL:', window.location.href);
console.log('Pathname:', window.location.pathname);
console.log('Is sale page:', window.location.pathname.includes('/venta-viviendas/'));
console.log('Is rental page:', window.location.pathname.includes('/alquiler-viviendas/'));