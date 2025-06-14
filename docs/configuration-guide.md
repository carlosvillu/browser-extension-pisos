# Guía de Configuración - Extensión de Análisis de Inversión Inmobiliaria

## Tabla de Contenidos

1. [Instalación y Configuración Inicial](#instalación-y-configuración-inicial)
2. [Configuración de Gastos](#configuración-de-gastos)
3. [Configuración de Hipoteca](#configuración-de-hipoteca)
4. [Umbrales de Rentabilidad](#umbrales-de-rentabilidad)
5. [Opciones de Interfaz](#opciones-de-interfaz)
6. [Configuración de Idiomas](#configuración-de-idiomas)
7. [Configuración Avanzada](#configuración-avanzada)
8. [Perfiles de Configuración](#perfiles-de-configuración)
9. [Exportar/Importar Configuración](#exportarimportar-configuración)
10. [Solución de Problemas](#solución-de-problemas)

---

## Instalación y Configuración Inicial

### Instalación desde Chrome Web Store

1. Visita la Chrome Web Store
2. Busca "Análisis de Inversión Inmobiliaria"
3. Haz clic en "Añadir a Chrome"
4. Confirma la instalación en el diálogo que aparece

### Instalación Manual (Desarrolladores)

1. Descarga el código fuente del proyecto
2. Abre Chrome y navega a `chrome://extensions/`
3. Activa el "Modo de desarrollador" en la esquina superior derecha
4. Haz clic en "Cargar extensión sin empaquetar"
5. Selecciona la carpeta `dist/chrome` del proyecto

### Primera Configuración

Al instalar la extensión por primera vez:

1. Haz clic en el icono de la extensión en la barra de herramientas
2. Se abrirá el panel de configuración con valores por defecto
3. Ajusta los parámetros según tu perfil de inversor
4. Guarda la configuración

**Valores por defecto**:
- Comisión de gestión: 10%
- Seguro: 20€/mes
- IBI: 300€/año
- Gastos de comunidad: 50€/mes
- Vacancia: 5%/año
- Mantenimiento: 200€/año

---

## Configuración de Gastos

### Panel de Gastos

Accede al panel de configuración y navega a la sección "Gastos de Inversión":

![Configuración de Gastos](./images/gastos-config.png)

### Gastos Mensuales

#### Comisión de Gestión
- **Rango**: 0% - 20%
- **Por defecto**: 10%
- **Descripción**: Porcentaje del alquiler cobrado por la gestión inmobiliaria
- **Consejo**: 
  - **Gestión propia**: 0-2%
  - **Inmobiliaria local**: 8-12%
  - **Inmobiliaria premium**: 12-15%

```json
{
  "expenses": {
    "managementFee": 10
  }
}
```

#### Seguro de Hogar
- **Rango**: 10€ - 100€/mes
- **Por defecto**: 20€/mes
- **Descripción**: Seguro multirriesgo del hogar
- **Consejo**: Ajustar según el valor de la vivienda y cobertura

#### Gastos de Comunidad
- **Rango**: 0€ - 200€/mes
- **Por defecto**: 50€/mes
- **Descripción**: Gastos comunitarios mensuales
- **Consejo**: Verificar en el anuncio o preguntar al vendedor

### Gastos Anuales

#### IBI (Impuesto de Bienes Inmuebles)
- **Rango**: 100€ - 2000€/año
- **Por defecto**: 300€/año
- **Descripción**: Impuesto municipal anual
- **Cálculo**: Aproximadamente 0.4-1.1% del valor catastral

#### Vacancia
- **Rango**: 0% - 15%/año
- **Por defecto**: 5%/año
- **Descripción**: Porcentaje del año sin inquilino
- **Consejo**:
  - **Zona prime**: 2-5%
  - **Zona normal**: 5-8%
  - **Zona problemática**: 8-15%

#### Mantenimiento y Reparaciones
- **Rango**: 100€ - 1000€/año
- **Por defecto**: 200€/año
- **Descripción**: Gastos de mantenimiento y pequeñas reparaciones
- **Consejo**: 1-2% del valor de la propiedad anualmente

### Ejemplo de Configuración Conservadora

```json
{
  "expenses": {
    "managementFee": 12,
    "insurance": 30,
    "ibi": 400,
    "communityFees": 60,
    "vacancy": 8,
    "maintenance": 300
  }
}
```

---

## Configuración de Hipoteca

### Panel de Hipoteca

La configuración de hipoteca afecta directamente al cálculo de la rentabilidad neta:

### Porcentaje Financiado
- **Rango**: 0% - 95%
- **Por defecto**: 80%
- **Descripción**: Porcentaje del precio de compra financiado
- **Consejo**:
  - **Primera vivienda**: Hasta 80%
  - **Segunda vivienda**: Hasta 70%
  - **Inversión**: Hasta 60-70%

### Tipo de Interés
- **Rango**: 1% - 10%
- **Por defecto**: 3.5%
- **Descripción**: Tipo de interés anual de la hipoteca
- **Actualización**: Revisar periódicamente según mercado

### Años de Financiación
- **Opciones**: 10, 15, 20, 25, 30, 35, 40 años
- **Por defecto**: 30 años
- **Impacto**: A más años, menor cuota mensual pero mayor coste total

### Gastos de Gestión
- **Rango**: 500€ - 3000€
- **Por defecto**: 1000€
- **Incluye**:
  - Comisión de apertura
  - Tasación
  - Notaría
  - Registro
  - Gestión bancaria

### Cálculo de Cuota Hipotecaria

La extensión calcula automáticamente la cuota mensual usando la fórmula:

```
Cuota = Capital × (i × (1+i)^n) / ((1+i)^n - 1)
```

Donde:
- Capital = Precio × (Porcentaje financiado / 100)
- i = Tipo de interés mensual (anual / 12 / 100)
- n = Número total de pagos (años × 12)

### Ejemplo de Configuración

```json
{
  "mortgage": {
    "percentage": 75,
    "interestRate": 3.2,
    "years": 25,
    "managementFee": 1200
  }
}
```

---

## Umbrales de Rentabilidad

### Clasificación de Inversiones

La extensión clasifica las inversiones en cuatro categorías basadas en la rentabilidad neta:

#### Excelente
- **Por defecto**: ≥ 8%
- **Color**: Verde oscuro
- **Descripción**: Inversión muy atractiva

#### Bueno
- **Por defecto**: 6% - 7.99%
- **Color**: Verde claro
- **Descripción**: Inversión atractiva

#### Regular
- **Por defecto**: 4% - 5.99%
- **Color**: Amarillo/Naranja
- **Descripción**: Inversión aceptable

#### Malo
- **Por defecto**: < 4%
- **Color**: Rojo
- **Descripción**: Inversión poco atractiva

### Personalización de Umbrales

```json
{
  "thresholds": {
    "excellent": 10,  // Inversor conservador
    "good": 8,
    "fair": 6
  }
}
```

### Recomendaciones por Perfil

#### Perfil Conservador
```json
{
  "thresholds": {
    "excellent": 12,
    "good": 10,
    "fair": 8
  }
}
```

#### Perfil Moderado
```json
{
  "thresholds": {
    "excellent": 8,
    "good": 6,
    "fair": 4
  }
}
```

#### Perfil Agresivo
```json
{
  "thresholds": {
    "excellent": 6,
    "good": 4,
    "fair": 2
  }
}
```

---

## Opciones de Interfaz

### Panel de Visualización

#### Mostrar Badges
- **Por defecto**: Activado
- **Descripción**: Muestra indicadores de rentabilidad junto a cada propiedad
- **Ubicación**: Esquina superior derecha de cada anuncio

#### Mostrar Modal
- **Por defecto**: Activado
- **Descripción**: Permite abrir ventana con detalles completos del análisis
- **Acceso**: Clic en el badge de rentabilidad

#### Tema Visual
- **Opciones**: Claro, Oscuro, Auto
- **Por defecto**: Auto (sigue el tema del navegador)

### Configuración de Colores

```json
{
  "ui": {
    "showBadges": true,
    "showModal": true,
    "theme": "auto",
    "colors": {
      "excellent": "#2d7d32",
      "good": "#66bb6a",
      "fair": "#ffa726",
      "poor": "#f44336"
    }
  }
}
```

---

## Configuración de Idiomas

### Idiomas Soportados

- **Español (es)**: Por defecto
- **Inglés (en)**
- **Francés (fr)**
- **Alemán (de)**
- **Italiano (it)**
- **Portugués (pt)**
- **Japonés (ja)**
- **Coreano (ko)**
- **Chino Simplificado (zh_CN)**
- **Chino Tradicional (zh_TW)**
- **Holandés (nl)**
- **Ruso (ru)**
- **Griego (el)**

### Cambio de Idioma

1. Abre el panel de configuración
2. Selecciona el idioma deseado en el dropdown
3. La interfaz se actualiza automáticamente
4. Los formatos de moneda y fecha se adaptan al idioma

### Formatos Locales

#### Español
- Moneda: "1.500 €"
- Porcentaje: "6,5%"
- Separadores: "." miles, "," decimales

#### Inglés
- Moneda: "$1,500"
- Porcentaje: "6.5%"
- Separadores: "," miles, "." decimales

### Configuración Manual

```json
{
  "ui": {
    "language": "en",
    "dateFormat": "MM/DD/YYYY",
    "currency": "USD",
    "currencySymbol": "$"
  }
}
```

---

## Configuración Avanzada

### Variables de Entorno

Para desarrolladores, se pueden configurar variables de entorno:

```bash
# .env
DEBUG_MODE=true
CACHE_TTL_MINUTES=15
MAX_CONCURRENT_REQUESTS=3
REQUEST_DELAY_MS=1000
```

### Configuración de Cache

```json
{
  "cache": {
    "ttlMinutes": 10,
    "maxEntries": 100,
    "compression": true
  }
}
```

### Configuración de Red

```json
{
  "network": {
    "timeout": 10000,
    "retries": 3,
    "backoffMultiplier": 2,
    "maxDelay": 30000
  }
}
```

### Configuración de Logging

```json
{
  "logging": {
    "level": "info",
    "contexts": ["analysis", "network", "ui"],
    "maxLogEntries": 1000
  }
}
```

---

## Perfiles de Configuración

### Perfil: Inversor Principiante

```json
{
  "name": "Inversor Principiante",
  "expenses": {
    "managementFee": 12,
    "insurance": 25,
    "ibi": 350,
    "communityFees": 55,
    "vacancy": 8,
    "maintenance": 300
  },
  "mortgage": {
    "percentage": 70,
    "interestRate": 3.8,
    "years": 30,
    "managementFee": 1200
  },
  "thresholds": {
    "excellent": 10,
    "good": 8,
    "fair": 6
  }
}
```

### Perfil: Inversor Experimentado

```json
{
  "name": "Inversor Experimentado",
  "expenses": {
    "managementFee": 8,
    "insurance": 20,
    "ibi": 300,
    "communityFees": 45,
    "vacancy": 5,
    "maintenance": 250
  },
  "mortgage": {
    "percentage": 80,
    "interestRate": 3.2,
    "years": 25,
    "managementFee": 1000
  },
  "thresholds": {
    "excellent": 8,
    "good": 6,
    "fair": 4
  }
}
```

### Perfil: Cash Buyer

```json
{
  "name": "Comprador Cash",
  "expenses": {
    "managementFee": 0,
    "insurance": 20,
    "ibi": 300,
    "communityFees": 50,
    "vacancy": 3,
    "maintenance": 200
  },
  "mortgage": {
    "percentage": 0,
    "interestRate": 0,
    "years": 0,
    "managementFee": 0
  },
  "thresholds": {
    "excellent": 6,
    "good": 4,
    "fair": 3
  }
}
```

---

## Exportar/Importar Configuración

### Exportar Configuración

1. Abre el panel de configuración
2. Haz clic en el botón "Exportar Configuración"
3. Se descarga un archivo JSON con tu configuración actual
4. Guarda el archivo para respaldo o compartir

### Importar Configuración

1. Abre el panel de configuración
2. Haz clic en el botón "Importar Configuración"
3. Selecciona el archivo JSON de configuración
4. La configuración se aplica automáticamente

### Formato de Archivo de Configuración

```json
{
  "version": "1.0",
  "exportDate": "2024-01-15T10:30:00Z",
  "config": {
    "expenses": { ... },
    "mortgage": { ... },
    "thresholds": { ... },
    "ui": { ... }
  }
}
```

### Validación de Configuración

La extensión valida automáticamente la configuración importada:

- Verifica que todos los campos requeridos estén presentes
- Valida que los valores estén dentro de rangos permitidos
- Aplica valores por defecto para campos faltantes
- Muestra advertencias para valores fuera de rango

---

## Solución de Problemas

### Problemas Comunes

#### La extensión no se activa en Idealista

**Posibles causas**:
- Extensión deshabilitada
- Permisos insuficientes
- Conflicto con otras extensiones

**Soluciones**:
1. Verificar que la extensión esté habilitada en `chrome://extensions/`
2. Recargar la página de Idealista
3. Deshabilitar temporalmente otras extensiones
4. Reinstalar la extensión

#### Los análisis no aparecen

**Posibles causas**:
- Configuración incorrecta
- Problemas de red
- Cache corrupto

**Soluciones**:
1. Verificar configuración en el popup
2. Limpiar cache de la extensión
3. Comprobar conexión a internet
4. Revisar consola de desarrollador

#### Resultados incorrectos

**Posibles causas**:
- Configuración no actualizada
- Datos de alquiler obsoletos
- Cambios en la estructura de Idealista

**Soluciones**:
1. Revisar y actualizar configuración
2. Limpiar cache para obtener datos frescos
3. Reportar el problema si persiste

### Logs de Depuración

Para acceder a los logs de depuración:

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Console"
3. Filtra por "Investment Extension" o "Pisos Analyzer"
4. Los logs muestran el proceso de análisis paso a paso

### Limpiar Cache y Datos

```javascript
// En la consola del navegador
chrome.storage.session.clear();
chrome.storage.sync.clear();
```

### Restaurar Configuración por Defecto

1. Abre el panel de configuración
2. Haz clic en "Restaurar Valores por Defecto"
3. Confirma la acción
4. La configuración se resetea automáticamente

### Reportar Problemas

Si experimentas problemas persistentes:

1. Anota los pasos que llevaron al problema
2. Toma una captura de pantalla si es visual
3. Copia los logs de la consola
4. Envía un reporte detallado con:
   - Versión de la extensión
   - Versión del navegador
   - URL específica donde ocurre
   - Configuración actual (si es relevante)

### Contacto y Soporte

- **GitHub Issues**: [Enlace al repositorio]
- **Email**: [Email de soporte]
- **Documentación**: [Enlace a documentación completa]

---

## Actualizaciones de Configuración

### Migración Automática

La extensión migra automáticamente configuraciones antiguas:

```javascript
// Ejemplo de migración de v1.0 a v1.1
if (config.version === '1.0') {
  config.expenses.maintenance = config.expenses.repairs || 200;
  delete config.expenses.repairs;
  config.version = '1.1';
}
```

### Notificaciones de Cambios

La extensión notifica cuando hay cambios importantes en:
- Nuevas opciones de configuración
- Cambios en valores por defecto
- Mejoras en cálculos

### Backup Automático

La extensión realiza backup automático de configuración:
- Antes de cada actualización
- Una vez por semana
- Antes de importar nueva configuración

Los backups se almacenan en Chrome Storage y pueden recuperarse si es necesario.

---

Esta guía proporciona toda la información necesaria para configurar y personalizar la extensión según las necesidades específicas de cada inversor inmobiliario.