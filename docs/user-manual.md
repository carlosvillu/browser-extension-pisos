# Manual de Usuario - Extensión de Análisis de Inversión Inmobiliaria

## Introducción

La **Extensión de Análisis de Inversión Inmobiliaria** es una herramienta diseñada para ayudar a inversores inmobiliarios a evaluar rápidamente la rentabilidad de propiedades en Idealista.com. La extensión analiza automáticamente las propiedades en venta y calcula su potencial de rentabilidad comparándolas con datos de alquiler de la misma zona.

## Tabla de Contenidos

1. [Instalación](#instalación)
2. [Primeros Pasos](#primeros-pasos)
3. [Uso Básico](#uso-básico)
4. [Interpretación de Resultados](#interpretación-de-resultados)
5. [Configuración Personalizada](#configuración-personalizada)
6. [Características Avanzadas](#características-avanzadas)
7. [Casos de Uso Prácticos](#casos-de-uso-prácticos)
8. [Preguntas Frecuentes](#preguntas-frecuentes)
9. [Solución de Problemas](#solución-de-problemas)
10. [Actualizaciones](#actualizaciones)

---

## Instalación

### Desde Chrome Web Store

1. **Abre Chrome Web Store**
   - Ve a [chrome.google.com/webstore](https://chrome.google.com/webstore)
   - O escribe `chrome://extensions/` en la barra de direcciones y haz clic en "Abrir Chrome Web Store"

2. **Busca la extensión**
   - Busca "Análisis de Inversión Inmobiliaria"
   - Localiza la extensión oficial

3. **Instala la extensión**
   - Haz clic en "Añadir a Chrome"
   - Confirma haciendo clic en "Añadir extensión" en el diálogo

4. **Verifica la instalación**
   - Deberías ver el icono de la extensión en la barra de herramientas
   - Si no lo ves, haz clic en el icono de puzle (extensiones) y fija la extensión

### Permisos Requeridos

La extensión requiere los siguientes permisos:

- **Acceso a idealista.com**: Para analizar las páginas de propiedades
- **Almacenamiento**: Para guardar tu configuración y cache de datos
- **Solicitudes de red**: Para obtener datos de alquiler de propiedades similares

---

## Primeros Pasos

### Configuración Inicial

1. **Accede a la configuración**
   - Haz clic en el icono de la extensión en la barra de herramientas
   - Se abrirá un panel de configuración

2. **Revisa la configuración por defecto**
   - La extensión viene con valores preconfigurados
   - Estos valores son adecuados para un inversor promedio en España

3. **Personaliza según tu perfil**
   - Ajusta los gastos según tu experiencia
   - Modifica los parámetros de hipoteca si planeas financiar
   - Establece tus umbrales de rentabilidad

### Tu Primera Búsqueda

1. **Ve a Idealista.com**
   - Navega a [idealista.com](https://www.idealista.com)
   - Busca propiedades en venta en tu área de interés

2. **Observa los indicadores**
   - Después de unos segundos, verás aparecer badges de colores
   - Cada badge indica la rentabilidad estimada de la propiedad

3. **Explora los detalles**
   - Haz clic en cualquier badge para ver el análisis completo
   - Se abrirá un modal con información detallada

---

## Uso Básico

### Navegación en Idealista

La extensión funciona automáticamente en las siguientes páginas:

- **Búsquedas de venta**: `https://www.idealista.com/venta-viviendas/*`
- **Páginas de resultados**: Con múltiples propiedades
- **Páginas de propiedad individual**: Con detalles específicos

### Elementos de la Interfaz

#### Badges de Rentabilidad

Los badges aparecen en la esquina superior derecha de cada anuncio:

- **🟢 Verde oscuro**: Excelente rentabilidad (≥8% por defecto)
- **🟢 Verde claro**: Buena rentabilidad (6-7.99%)
- **🟡 Amarillo**: Rentabilidad regular (4-5.99%)
- **🔴 Rojo**: Rentabilidad baja (<4%)
- **⚪ Gris**: Analizando o sin datos

#### Estados de Análisis

- **"Analizando..."**: La extensión está obteniendo datos
- **"6.5%"**: Rentabilidad calculada
- **"Sin datos"**: No se encontraron datos de alquiler
- **"Error"**: Problema durante el análisis

### Interacción con los Resultados

#### Visualización Rápida
- Los badges proporcionan una evaluación visual instantánea
- Los colores te permiten identificar oportunidades rápidamente
- Puedes hacer scroll y ver múltiples propiedades de un vistazo

#### Análisis Detallado
- Haz clic en cualquier badge para abrir el modal de detalles
- El modal muestra:
  - Rentabilidad bruta y neta
  - Desglose de gastos
  - Cuota hipotecaria (si aplica)
  - Recomendación de inversión
  - Nivel de riesgo

---

## Interpretación de Resultados

### Métricas Principales

#### Rentabilidad Bruta
- **Fórmula**: (Ingresos anuales / Precio de compra) × 100
- **Interpretación**: Rentabilidad sin considerar gastos
- **Típico**: 4-12% en España

#### Rentabilidad Neta
- **Fórmula**: (Ingresos anuales - Gastos anuales) / Precio de compra × 100
- **Interpretación**: Rentabilidad real después de gastos
- **Típico**: 2-8% en España

#### Gastos Incluidos
- Comisión de gestión inmobiliaria
- Seguro de hogar
- IBI (Impuesto de Bienes Inmuebles)
- Gastos de comunidad
- Vacancia (períodos sin inquilino)
- Mantenimiento y reparaciones

### Clasificación de Inversiones

#### 🟢 Excelente (≥8%)
- **Significado**: Inversión muy atractiva
- **Acción**: Considera seriamente la compra
- **Precaución**: Verifica que los datos sean realistas

#### 🟢 Buena (6-7.99%)
- **Significado**: Inversión sólida
- **Acción**: Analiza en detalle
- **Consideración**: Compara con otras opciones

#### 🟡 Regular (4-5.99%)
- **Significado**: Inversión aceptable
- **Acción**: Evalúa otros factores (ubicación, potencial)
- **Precaución**: Margen de error más estrecho

#### 🔴 Baja (<4%)
- **Significado**: Inversión poco atractiva
- **Acción**: Busca otras opciones
- **Excepción**: Puede ser válida por plusvalía

### Factores Adicionales a Considerar

#### Factores No Cuantificados
- **Ubicación**: Transporte, servicios, seguridad
- **Estado de la propiedad**: Necesidad de reformas
- **Tendencias del mercado**: Evolución de precios
- **Aspectos legales**: Inquilinos actuales, licencias

#### Señales de Alerta
- **Rentabilidad muy alta (>15%)**: Verificar datos
- **Precios muy bajos**: Posibles problemas ocultos
- **Áreas desconocidas**: Investigar la zona
- **Propiedades muy específicas**: Mercado limitado

---

## Configuración Personalizada

### Acceso a la Configuración

1. Haz clic en el icono de la extensión
2. El panel de configuración se abre automáticamente
3. Navega por las diferentes secciones

### Configuración por Perfil de Inversor

#### Perfil Conservador
- **Gastos**: Más altos para mayor seguridad
- **Umbrales**: Más exigentes (Excelente ≥10%)
- **Hipoteca**: Menor financiación (60-70%)

```
Gastos recomendados:
- Gestión: 12%
- Vacancia: 8%
- Mantenimiento: 300€/año
```

#### Perfil Moderado
- **Gastos**: Valores promedio del mercado
- **Umbrales**: Estándar (Excelente ≥8%)
- **Hipoteca**: Financiación típica (80%)

```
Gastos recomendados:
- Gestión: 10%
- Vacancia: 5%
- Mantenimiento: 200€/año
```

#### Perfil Agresivo
- **Gastos**: Optimistas o gestión propia
- **Umbrales**: Menos exigentes (Excelente ≥6%)
- **Hipoteca**: Máxima financiación (90%)

```
Gastos recomendados:
- Gestión: 5%
- Vacancia: 3%
- Mantenimiento: 150€/año
```

### Configuración por Zona Geográfica

#### Madrid/Barcelona (Capitales)
- **IBI**: 400-800€/año
- **Comunidad**: 60-120€/mes
- **Seguro**: 25-40€/mes

#### Ciudades Medianas
- **IBI**: 250-500€/año
- **Comunidad**: 40-80€/mes
- **Seguro**: 20-30€/mes

#### Zonas Rurales/Costeras
- **IBI**: 150-400€/año
- **Comunidad**: 20-60€/mes
- **Seguro**: 15-25€/mes

---

## Características Avanzadas

### Lazy Loading

La extensión utiliza lazy loading para optimizar el rendimiento:

- **Beneficio**: No sobrecarga los servidores de Idealista
- **Funcionamiento**: Analiza propiedades solo cuando entran en pantalla
- **Indicador**: Verás "Analizando..." cuando empiece el análisis

### Sistema de Cache

- **Duración**: Los datos se almacenan por 10 minutos por defecto
- **Beneficio**: Análisis más rápido en visitas repetidas
- **Limpieza**: El cache se limpia automáticamente

### Análisis Inteligente

#### Filtros Aplicados
- La extensión respeta los filtros de tu búsqueda
- Busca propiedades de alquiler similares (habitaciones, superficie)
- Ajusta automáticamente por zona geográfica

#### Manejo de Errores
- **Sin datos**: Muestra "Sin datos" cuando no hay propiedades de alquiler
- **Error de red**: Reintenta automáticamente
- **Datos incompletos**: Proporciona estimaciones conservadoras

### Multiidioma

La extensión soporta múltiples idiomas:

- **Cambio automático**: Detecta el idioma del navegador
- **Cambio manual**: Configurable en el panel de configuración
- **Formatos locales**: Adapta monedas y porcentajes

---

## Casos de Uso Prácticos

### Caso 1: Búsqueda de Primera Inversión

**Situación**: Inversor novato buscando su primera propiedad de inversión

**Configuración recomendada**:
- Gastos conservadores (12% gestión, 8% vacancia)
- Umbrales altos (Excelente ≥10%)
- Financiación moderada (70%)

**Proceso**:
1. Busca en zonas conocidas
2. Filtra por precio máximo según capacidad
3. Prioriza badges verdes (Excelente/Buena)
4. Analiza en detalle las mejores opciones
5. Visita físicamente las propiedades finalistas

### Caso 2: Cartera de Inversiones

**Situación**: Inversor experimentado ampliando su cartera

**Configuración recomendada**:
- Gastos optimizados (8% gestión, 5% vacancia)
- Umbrales moderados (Excelente ≥8%)
- Máxima financiación (80-90%)

**Proceso**:
1. Analiza múltiples zonas simultáneamente
2. Compara rentabilidades entre áreas
3. Considera factores de diversificación
4. Evalúa propiedades "Regulares" con potencial
5. Optimiza por volumen y eficiencia

### Caso 3: Inversión en Obra Nueva

**Situación**: Evaluación de promociones de obra nueva

**Configuración recomendada**:
- Gastos bajos inicialmente (sin mantenimiento)
- Considerar vacancia baja (zona consolidada)
- Evaluar tendencias de mercado

**Proceso**:
1. Analiza la zona usando propiedades similares
2. Considera la entrega futura (1-2 años)
3. Evalúa la evolución del mercado de alquiler
4. Compara con precios actuales de segunda mano

### Caso 4: Compra para Rehabilitación

**Situación**: Propiedades para reformar y alquilar

**Configuración recomendada**:
- Añadir coste de reforma al precio de compra
- Gastos de mantenimiento bajos (todo nuevo)
- Considerar alquiler premium por reformas

**Proceso**:
1. Estima coste de reforma
2. Suma al precio de compra para análisis
3. Busca alquileres de propiedades reformadas
4. Evalúa el diferencial de precios

---

## Preguntas Frecuentes

### ¿Cómo funciona la extensión?

La extensión analiza automáticamente las páginas de Idealista cuando buscas propiedades en venta. Para cada propiedad:

1. Extrae datos básicos (precio, ubicación, características)
2. Genera una búsqueda equivalente de alquiler
3. Obtiene datos de propiedades similares en alquiler
4. Calcula la rentabilidad usando tu configuración
5. Muestra el resultado con un badge de color

### ¿Los datos son precisos?

Los datos son estimaciones basadas en:
- Propiedades similares en la misma zona
- Tu configuración de gastos personalizada
- Cálculos estándar de rentabilidad inmobiliaria

**Importante**: Son estimaciones para orientación inicial. Siempre verifica los datos y consulta con profesionales antes de tomar decisiones de inversión.

### ¿Por qué no veo análisis en algunas propiedades?

Posibles razones:
- **Sin datos de alquiler**: No hay propiedades similares en alquiler
- **Zona muy específica**: Área con pocos datos disponibles
- **Filtros muy restrictivos**: Criterios muy específicos
- **Error temporal**: Problema de conexión o servidor

### ¿Puedo usar la extensión fuera de España?

Actualmente la extensión está optimizada para el mercado español y specifically para Idealista.com. Los cálculos y configuraciones están adaptados para:
- Legislación española (IBI, gastos típicos)
- Mercado inmobiliario español
- Moneda euros

### ¿Cómo actualizo mi configuración?

1. Haz clic en el icono de la extensión
2. Modifica los valores que desees
3. Los cambios se guardan automáticamente
4. Recarga la página para ver los nuevos cálculos

### ¿Qué hacer si veo resultados extraños?

1. **Verifica tu configuración**: Asegúrate de que los valores son correctos
2. **Limpia el cache**: Recarga la página
3. **Comprueba la zona**: Verifica que hay suficientes datos de alquiler
4. **Compara manualmente**: Verifica algunos cálculos a mano
5. **Reporta el problema**: Si persiste, contacta con soporte

### ¿La extensión funciona en modo incógnito?

Sí, pero debes habilitarla específicamente:
1. Ve a `chrome://extensions/`
2. Encuentra la extensión
3. Haz clic en "Detalles"
4. Activa "Permitir en modo incógnito"

### ¿Qué datos almacena la extensión?

La extensión almacena:
- **Tu configuración**: Gastos, umbrales, preferencias
- **Cache temporal**: Datos de alquiler (expiración automática)
- **Logs de uso**: Para mejoras y debugging (anónimos)

**No almacena**:
- Datos personales identificables
- Historial de búsquedas
- Información financiera específica

---

## Solución de Problemas

### La extensión no funciona

#### Verificaciones básicas:
1. **Extensión habilitada**: Ve a `chrome://extensions/` y verifica que esté activada
2. **Página correcta**: Asegúrate de estar en una página de búsqueda de Idealista
3. **Permisos**: Verifica que la extensión tenga permisos para Idealista
4. **Actualización**: Asegúrate de tener la última versión

#### Soluciones:
1. **Recarga la página**: Ctrl+F5 o Cmd+Shift+R
2. **Reinicia el navegador**: Cierra y abre Chrome completamente
3. **Reinstala la extensión**: Desinstala y vuelve a instalar

### Los badges no aparecen

#### Posibles causas:
- La página aún está cargando
- No hay propiedades válidas para analizar
- Problema de permisos o configuración

#### Soluciones:
1. **Espera unos segundos**: El análisis puede tardar
2. **Verifica la URL**: Debe ser una búsqueda de venta en Idealista
3. **Revisa la configuración**: Asegúrate de que los badges están habilitados
4. **Comprueba la consola**: F12 → Console para ver errores

### Resultados inconsistentes

#### Posibles causas:
- Configuración no actualizada
- Datos de alquiler limitados
- Cambios en Idealista

#### Soluciones:
1. **Actualiza configuración**: Revisa y ajusta tus parámetros
2. **Limpia cache**: Los datos pueden estar obsoletos
3. **Verifica manualmente**: Compara con búsquedas manuales
4. **Reporta el problema**: Si es sistemático

### Problemas de rendimiento

#### Síntomas:
- Página lenta al cargar
- Navegador se congela
- Análisis muy lento

#### Soluciones:
1. **Reduce pestañas**: Cierra pestañas innecesarias
2. **Actualiza navegador**: Versión más reciente de Chrome
3. **Limpia cache**: Del navegador y extensión
4. **Reinicia el navegador**: Solución temporal

### Errores de conexión

#### Síntomas:
- Badges muestran "Error"
- Análisis no completan
- Timeouts frecuentes

#### Soluciones:
1. **Verifica conexión**: Comprueba tu internet
2. **VPN/Proxy**: Deshabilita si los usas
3. **Firewall**: Asegúrate de que no bloquea la extensión
4. **Espera**: Puede ser un problema temporal de servidores

### Contacto para Soporte

Si los problemas persisten:

1. **Documenta el problema**:
   - Captura de pantalla
   - URL específica
   - Mensaje de error completo
   - Pasos para reproducir

2. **Información del sistema**:
   - Versión de Chrome
   - Versión de la extensión
   - Sistema operativo

3. **Canales de contacto**:
   - GitHub Issues (preferido)
   - Email de soporte
   - Formulario de contacto

---

## Actualizaciones

### Actualizaciones Automáticas

Chrome actualiza las extensiones automáticamente:
- **Frecuencia**: Cada pocas horas cuando Chrome está abierto
- **Notificación**: Puede aparecer un indicador de actualización
- **Reinicio**: Algunas actualizaciones requieren reiniciar Chrome

### Notas de Versión

#### Versión 1.0.0 (Inicial)
- Análisis básico de rentabilidad
- Configuración de gastos y umbrales
- Soporte para español e inglés

#### Versión 1.1.0
- Mejoras en el algoritmo de análisis
- Nuevo sistema de cache optimizado
- Soporte para múltiples idiomas

#### Versión 1.2.0
- Interfaz de usuario rediseñada
- Nuevos indicadores visuales
- Configuración avanzada de hipoteca

### Próximas Características

#### En desarrollo:
- Análisis de tendencias históricas
- Comparación con mercados similares
- Alertas de nuevas oportunidades
- Exportación de datos de análisis

#### Planificado:
- Soporte para otros portales inmobiliarios
- Análisis de rentabilidad por habitaciones
- Calculadora de reforma y rehabilitación
- Integración con APIs de valoración

### Feedback y Sugerencias

Tu feedback es valioso para mejorar la extensión:

1. **Funcionalidades**: ¿Qué te gustaría que añadiéramos?
2. **Usabilidad**: ¿Cómo podemos mejorar la experiencia?
3. **Precisión**: ¿Los cálculos se ajustan a tu experiencia?
4. **Rendimiento**: ¿Encuentras la extensión rápida y eficiente?

**Canales de feedback**:
- Valoración en Chrome Web Store
- Issues en GitHub
- Formulario de feedback en la extensión
- Email directo al equipo de desarrollo

---

## Conclusión

La **Extensión de Análisis de Inversión Inmobiliaria** es una herramienta poderosa para evaluar rápidamente oportunidades de inversión en Idealista. Su uso efectivo requiere:

1. **Configuración adecuada**: Ajustar parámetros a tu perfil
2. **Interpretación correcta**: Entender qué significan los resultados
3. **Verificación adicional**: Complementar con análisis manual
4. **Actualización regular**: Mantener configuración al día

**Recuerda**: La extensión proporciona estimaciones para ayudarte en la evaluación inicial. Siempre realiza un análisis detallado y consulta con profesionales antes de tomar decisiones de inversión importantes.

**¡Feliz inversión!** 🏠💰