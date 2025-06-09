import { RentalDataCacheService } from './domain/services/cache-service';
import { Logger } from './infrastructure/logger';

const logger = new Logger('Background');
const cacheService = new RentalDataCacheService(logger);

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'CACHE_GET') {
    cacheService
      .get(request.key)
      .then((result) => sendResponse({ success: true, data: result }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  }

  if (request.type === 'CACHE_SET') {
    cacheService
      .set(request.key, request.data, request.ttl)
      .then(() => sendResponse({ success: true }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  }

  if (request.type === 'CACHE_CLEAR') {
    cacheService
      .clear()
      .then(() => sendResponse({ success: true }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  }

  if (request.type === 'CACHE_CLEANUP') {
    cacheService
      .cleanup()
      .then(() => sendResponse({ success: true }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  }
});
