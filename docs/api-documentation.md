# API Documentation - Extensión de Análisis de Inversión Inmobiliaria

## Tabla de Contenidos

1. [Interfaces Principales](#interfaces-principales)
2. [Servicios del Dominio](#servicios-del-dominio)
3. [Eventos y Callbacks](#eventos-y-callbacks)
4. [Configuración](#configuración)
5. [Cache y Storage](#cache-y-storage)
6. [Internacionalización](#internacionalización)
7. [Manejo de Errores](#manejo-de-errores)

---

## Interfaces Principales

### UrlAnalysisResult

```typescript
interface UrlAnalysisResult {
  isIdealista: boolean;           // Si la URL es de Idealista
  searchType: 'venta' | 'alquiler' | null;  // Tipo de búsqueda detectada
  location: string | null;        // Ubicación extraída de la URL
  hasFilters: boolean;           // Si la búsqueda tiene filtros aplicados
}
```

**Uso**: Resultado del análisis de URL para determinar contexto de página.

### PropertyData

```typescript
interface PropertyData {
  id: string;                    // Identificador único de la propiedad
  title: string;                 // Título de la propiedad
  price: number;                 // Precio en euros
  rooms: number | null;          // Número de habitaciones
  size: number | null;           // Superficie en m²
  floor: string | null;          // Planta (ej: "3º", "Bajo")
  hasGarage: boolean;           // Si incluye garaje
  description: string;          // Descripción completa
  url: string;                  // URL de la propiedad
  tags: string[];               // Etiquetas (ej: ["reformado", "exterior"])
  location: string;             // Ubicación textual
}
```

**Uso**: Datos estructurados de una propiedad extraída del DOM.

### RentalData

```typescript
interface RentalData {
  averagePrice: number;         // Precio medio de alquiler
  minPrice: number;             // Precio mínimo encontrado
  maxPrice: number;             // Precio máximo encontrado
  sampleSize: number;           // Número de propiedades analizadas
  properties: PropertyData[];   // Propiedades de alquiler encontradas
}
```

**Uso**: Datos agregados de alquiler para análisis de rentabilidad.

### ProfitabilityAnalysis

```typescript
interface ProfitabilityAnalysis {
  propertyId: string;           // ID de la propiedad analizada
  purchasePrice: number;        // Precio de compra
  estimatedRent: number;        // Alquiler estimado mensual
  grossYield: number;           // Rentabilidad bruta anual (%)
  netYield: number;             // Rentabilidad neta anual (%)
  monthlyExpenses: number;      // Gastos mensuales estimados
  monthlyMortgage: number;      // Cuota hipotecaria mensual
  recommendation: 'excellent' | 'good' | 'fair' | 'poor';  // Recomendación
  riskLevel: 'low' | 'medium' | 'high';  // Nivel de riesgo
}
```

**Uso**: Resultado completo del análisis de rentabilidad.

### UserConfig

```typescript
interface UserConfig {
  expenses: {
    managementFee: number;      // Comisión de gestión mensual (%)
    insurance: number;          // Seguro mensual (€)
    ibi: number;               // IBI anual (€)
    communityFees: number;     // Gastos de comunidad mensual (€)
    vacancy: number;           // Vacancia anual (%)
    maintenance: number;       // Mantenimiento anual (€)
  };
  mortgage: {
    percentage: number;        // Porcentaje financiado (%)
    interestRate: number;      // Tipo de interés anual (%)
    years: number;            // Años de financiación
    managementFee: number;    // Gastos de gestión (€)
  };
  thresholds: {
    excellent: number;        // Umbral para "excelente" (%)
    good: number;            // Umbral para "bueno" (%)
    fair: number;            // Umbral para "regular" (%)
  };
  ui: {
    showBadges: boolean;     // Mostrar badges en resultados
    showModal: boolean;      // Mostrar modal con detalles
    language: string;        // Idioma de la interfaz
  };
}
```

**Uso**: Configuración completa del usuario para cálculos y visualización.

---

## Servicios del Dominio

### IUrlAnalyzer

```typescript
interface IUrlAnalyzer {
  analyzeCurrentPage(): UrlAnalysisResult;
  isIdealistaPropertyPage(url?: string): boolean;
  extractLocationFromUrl(url: string): string | null;
}
```

**Implementación**: `UrlAnalyzer`

#### Métodos

##### `analyzeCurrentPage(): UrlAnalysisResult`
Analiza la URL actual del navegador.

**Retorna**: Objeto con análisis completo de la página.

##### `isIdealistaPropertyPage(url?: string): boolean`
Verifica si una URL es de búsqueda de propiedades en Idealista.

**Parámetros**:
- `url` (opcional): URL a analizar. Si no se proporciona, usa la URL actual.

**Retorna**: `true` si es una página válida de Idealista.

##### `extractLocationFromUrl(url: string): string | null`
Extrae la ubicación de una URL de Idealista.

**Parámetros**:
- `url`: URL de Idealista

**Retorna**: Ubicación extraída o `null` si no se encuentra.

**Ejemplo**:
```typescript
const analyzer = new UrlAnalyzer();
const result = analyzer.analyzeCurrentPage();
console.log(result.location); // "madrid/centro"
```

### IPropertyExtractor

```typescript
interface IPropertyExtractor {
  extractPropertiesFromPage(): PropertyData[];
  extractPropertiesFromDocument(document: Document): PropertyData[];
}
```

**Implementación**: `PropertyExtractor`

#### Métodos

##### `extractPropertiesFromPage(): PropertyData[]`
Extrae todas las propiedades de la página actual.

**Retorna**: Array de propiedades encontradas.

##### `extractPropertiesFromDocument(document: Document): PropertyData[]`
Extrae propiedades de un documento específico.

**Parámetros**:
- `document`: Documento DOM a analizar

**Retorna**: Array de propiedades encontradas.

**Ejemplo**:
```typescript
const extractor = new PropertyExtractor();
const properties = extractor.extractPropertiesFromPage();
console.log(`Encontradas ${properties.length} propiedades`);
```

### IRentalDataAnalyzer

```typescript
interface IRentalDataAnalyzer {
  analyzeRentalData(location: string, filters?: any): Promise<RentalData>;
}
```

**Implementación**: `RentalDataAnalyzer`

#### Métodos

##### `analyzeRentalData(location: string, filters?: any): Promise<RentalData>`
Obtiene y analiza datos de alquiler para una ubicación.

**Parámetros**:
- `location`: Ubicación a analizar
- `filters` (opcional): Filtros de búsqueda

**Retorna**: Promise con datos agregados de alquiler.

**Ejemplo**:
```typescript
const analyzer = new RentalDataAnalyzer(extractor, cache, errorHandler);
const rentalData = await analyzer.analyzeRentalData('madrid/centro');
console.log(`Precio medio: ${rentalData.averagePrice}€`);
```

### IProfitabilityCalculator

```typescript
interface IProfitabilityCalculator {
  calculateProfitability(property: PropertyData, rentalData: RentalData): ProfitabilityAnalysis;
}
```

**Implementación**: `ProfitabilityCalculator`

#### Métodos

##### `calculateProfitability(property: PropertyData, rentalData: RentalData): ProfitabilityAnalysis`
Calcula el análisis completo de rentabilidad.

**Parámetros**:
- `property`: Datos de la propiedad
- `rentalData`: Datos de alquiler del área

**Retorna**: Análisis completo de rentabilidad.

**Ejemplo**:
```typescript
const calculator = new ProfitabilityCalculator(configService);
const analysis = calculator.calculateProfitability(property, rentalData);
console.log(`Rentabilidad neta: ${analysis.netYield.toFixed(2)}%`);
```

### ICacheService

```typescript
interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlMinutes?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}
```

**Implementación**: `CacheService`

#### Métodos

##### `get<T>(key: string): Promise<T | null>`
Recupera un valor del caché.

**Parámetros**:
- `key`: Clave del valor a recuperar

**Retorna**: Promise con el valor o `null` si no existe o expiró.

##### `set<T>(key: string, value: T, ttlMinutes?: number): Promise<void>`
Almacena un valor en el caché.

**Parámetros**:
- `key`: Clave para el valor
- `value`: Valor a almacenar
- `ttlMinutes` (opcional): Tiempo de vida en minutos (por defecto 10)

##### `delete(key: string): Promise<void>`
Elimina un valor del caché.

##### `clear(): Promise<void>`
Limpia todo el caché.

**Ejemplo**:
```typescript
const cache = new CacheService();
await cache.set('rental-data-madrid', rentalData, 15);
const cached = await cache.get<RentalData>('rental-data-madrid');
```

### IConfigService

```typescript
interface IConfigService {
  getConfig(): Promise<UserConfig>;
  updateConfig(config: Partial<UserConfig>): Promise<void>;
  resetToDefaults(): Promise<void>;
}
```

**Implementación**: `ConfigService`

#### Métodos

##### `getConfig(): Promise<UserConfig>`
Obtiene la configuración actual del usuario.

**Retorna**: Promise con la configuración completa.

##### `updateConfig(config: Partial<UserConfig>): Promise<void>`
Actualiza la configuración del usuario.

**Parámetros**:
- `config`: Configuración parcial a actualizar

##### `resetToDefaults(): Promise<void>`
Restaura la configuración a valores por defecto.

**Ejemplo**:
```typescript
const configService = new ConfigService();
const config = await configService.getConfig();
await configService.updateConfig({
  expenses: { managementFee: 8 }
});
```

---

## Eventos y Callbacks

### SimpleLazyLoader

```typescript
interface LazyLoadCallback {
  (element: Element): void;
}

class SimpleLazyLoader {
  constructor(callback: LazyLoadCallback, options?: IntersectionObserverInit);
  observe(element: Element): void;
  unobserve(element: Element): void;
  disconnect(): void;
}
```

**Uso**: Para lazy loading de análisis de propiedades.

**Ejemplo**:
```typescript
const lazyLoader = new SimpleLazyLoader((element) => {
  const propertyId = element.getAttribute('data-property-id');
  // Realizar análisis de la propiedad
}, {
  threshold: 0.1,
  rootMargin: '50px'
});

// Observar elementos
propertyElements.forEach(el => lazyLoader.observe(el));
```

### Error Handler Callbacks

```typescript
interface ErrorCallback {
  (error: Error, context: string): void;
}

interface RetryOptions {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}
```

**Ejemplo**:
```typescript
const errorHandler = new ErrorHandler();
errorHandler.onError((error, context) => {
  console.error(`Error en ${context}:`, error);
});
```

---

## Configuración

### Configuración por Defecto

```typescript
const DEFAULT_CONFIG: UserConfig = {
  expenses: {
    managementFee: 10,      // 10% de comisión
    insurance: 20,          // 20€ mensuales
    ibi: 300,              // 300€ anuales
    communityFees: 50,     // 50€ mensuales
    vacancy: 5,            // 5% de vacancia
    maintenance: 200       // 200€ anuales
  },
  mortgage: {
    percentage: 80,        // 80% financiado
    interestRate: 3.5,     // 3.5% anual
    years: 30,             // 30 años
    managementFee: 1000    // 1000€ de gastos
  },
  thresholds: {
    excellent: 8,          // >= 8% excelente
    good: 6,              // >= 6% bueno
    fair: 4               // >= 4% regular
  },
  ui: {
    showBadges: true,
    showModal: true,
    language: 'es'
  }
};
```

### Actualización de Configuración

```typescript
// Actualizar solo gastos
await configService.updateConfig({
  expenses: {
    managementFee: 8,
    insurance: 25
  }
});

// Actualizar umbrales
await configService.updateConfig({
  thresholds: {
    excellent: 10,
    good: 7,
    fair: 5
  }
});
```

---

## Cache y Storage

### Claves de Caché

| Clave | Formato | TTL | Descripción |
|-------|---------|-----|-------------|
| `rental-data-{location}` | `RentalData` | 10 min | Datos de alquiler por ubicación |
| `property-analysis-{id}` | `ProfitabilityAnalysis` | 30 min | Análisis de propiedad |

### Gestión de Caché

```typescript
// Generar clave de caché
const cacheKey = `rental-data-${location.replace(/\//g, '-')}`;

// Verificar si existe en caché
const cached = await cache.get<RentalData>(cacheKey);
if (cached) {
  return cached;
}

// Almacenar en caché con TTL personalizado
await cache.set(cacheKey, newData, 15); // 15 minutos
```

### Storage Sync

```typescript
// Configuración sincronizada entre dispositivos
chrome.storage.sync.set({ userConfig: config });
chrome.storage.sync.get(['userConfig'], (result) => {
  const config = result.userConfig || DEFAULT_CONFIG;
});
```

---

## Internacionalización

### LanguageService API

```typescript
interface ILanguageService {
  getCurrentLanguage(): string;
  setLanguage(language: string): Promise<void>;
  formatCurrency(amount: number, currency?: string): string;
  formatPercentage(value: number, decimals?: number): string;
  getMessage(key: string, substitutions?: string[]): string;
}
```

### Mensajes Disponibles

```json
{
  "extensionName": "Análisis de Inversión Inmobiliaria",
  "analyzing": "Analizando...",
  "noData": "Sin datos",
  "error": "Error",
  "excellent": "Excelente",
  "good": "Bueno",
  "fair": "Regular",
  "poor": "Malo",
  "grossYield": "Rentabilidad bruta",
  "netYield": "Rentabilidad neta",
  "monthlyRent": "Alquiler mensual",
  "monthlyExpenses": "Gastos mensuales",
  "recommendation": "Recomendación",
  "riskLevel": "Nivel de riesgo"
}
```

### Uso del Servicio

```typescript
const languageService = new LanguageService();

// Formatear moneda
const formattedPrice = languageService.formatCurrency(1500); // "1.500 €"

// Formatear porcentaje
const formattedYield = languageService.formatPercentage(6.5, 1); // "6,5%"

// Obtener mensaje traducido
const message = languageService.getMessage('analyzing'); // "Analizando..."
```

---

## Manejo de Errores

### Tipos de Error

```typescript
enum ErrorType {
  NETWORK = 'network',
  PARSING = 'parsing',
  CACHE = 'cache',
  CONFIG = 'config',
  DOM = 'dom'
}

interface ExtensionError {
  type: ErrorType;
  message: string;
  context: string;
  timestamp: number;
  stack?: string;
}
```

### Estrategias de Reintento

```typescript
interface RetryStrategy {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  jitter: boolean;
}

const DEFAULT_RETRY_STRATEGY: RetryStrategy = {
  maxRetries: 3,
  baseDelay: 1000,     // 1 segundo
  maxDelay: 10000,     // 10 segundos
  backoffMultiplier: 2,
  jitter: true
};
```

### Manejo de Errores Específicos

```typescript
// Error de red con reintento
try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
} catch (error) {
  await errorHandler.handleError(error, 'rental-data-fetch', {
    maxRetries: 2,
    baseDelay: 2000
  });
}

// Error de parsing con fallback
try {
  const properties = extractor.extractPropertiesFromPage();
} catch (error) {
  errorHandler.logError(error, 'property-extraction');
  // Continuar con array vacío
  return [];
}
```

### Logs de Error

```typescript
// Logging estructurado
errorHandler.logError(new Error('Timeout'), 'api-call', {
  url: 'https://example.com',
  timeout: 5000,
  attempt: 2
});

// Estadísticas de errores
const stats = errorHandler.getErrorStats();
console.log(`Errores de red: ${stats.network}`);
console.log(`Errores de parsing: ${stats.parsing}`);
```

---

## Ejemplos de Uso Completo

### Análisis de Inversión Básico

```typescript
// Inicializar servicios
const urlAnalyzer = new UrlAnalyzer();
const propertyExtractor = new PropertyExtractor();
const cache = new CacheService();
const errorHandler = new ErrorHandler();
const configService = new ConfigService();
const rentalAnalyzer = new RentalDataAnalyzer(propertyExtractor, cache, errorHandler);
const calculator = new ProfitabilityCalculator(configService);

// Analizar página actual
const analysis = urlAnalyzer.analyzeCurrentPage();
if (analysis.isIdealista && analysis.searchType === 'venta') {
  const properties = propertyExtractor.extractPropertiesFromPage();
  
  for (const property of properties) {
    try {
      const rentalData = await rentalAnalyzer.analyzeRentalData(analysis.location);
      const profitability = calculator.calculateProfitability(property, rentalData);
      
      console.log(`${property.title}: ${profitability.netYield.toFixed(2)}%`);
    } catch (error) {
      errorHandler.logError(error, `analysis-${property.id}`);
    }
  }
}
```

### Configuración Personalizada

```typescript
// Obtener configuración actual
const config = await configService.getConfig();

// Modificar para inversor conservador
const conservativeConfig = {
  ...config,
  expenses: {
    ...config.expenses,
    managementFee: 12,    // Mayor comisión
    vacancy: 8,           // Mayor vacancia
    maintenance: 500      // Mayor mantenimiento
  },
  thresholds: {
    excellent: 10,        // Umbrales más altos
    good: 8,
    fair: 6
  }
};

await configService.updateConfig(conservativeConfig);
```

### Manejo de Idiomas

```typescript
const languageService = new LanguageService();

// Cambiar idioma
await languageService.setLanguage('en');

// Formatear valores según idioma
const price = languageService.formatCurrency(150000);      // "$150,000"
const yield = languageService.formatPercentage(7.5);       // "7.5%"
const message = languageService.getMessage('excellent');   // "Excellent"
```

Esta documentación proporciona una referencia completa de la API interna de la extensión, facilitando el mantenimiento y la extensión del código por parte de futuros desarrolladores.