# Plataforma Browne Data Extractor

# 1. Introducción

La automatización del procesamiento documental se ha convertido en una necesidad estratégica dentro de entornos empresariales que manejan grandes volúmenes de información operativa, financiera y logística. En este contexto, los procesos manuales de lectura, validación y digitación de documentos representan una fuente constante de retrasos, errores humanos y costos operacionales.

Con el objetivo de modernizar este flujo y reducir la dependencia de procesos manuales, se diseñó e implementó una plataforma basada en Google Cloud Platform (GCP) utilizando los servicios de Document AI para realizar extracción inteligente de información desde documentos empresariales tales como facturas, certificados y documentos logísticos.

La solución fue concebida como una arquitectura desacoplada y escalable, capaz de procesar documentos PDF mediante OCR avanzado y modelos entrenados específicamente para estructuras documentales reales utilizadas por la organización. El sistema fue diseñado además considerando futuras integraciones con sistemas ERP corporativos, permitiendo que la lógica de procesamiento documental residiera completamente en una plataforma cloud independiente y reutilizable.

La implementación no se limitó únicamente al consumo básico de servicios OCR. El proyecto contempló el diseño completo de la infraestructura cloud, configuración de procesadores especializados, entrenamiento de modelos personalizados, configuración de seguridad perimetral, despliegue de servicios backend serverless, monitoreo operacional y estrategias de escalabilidad orientadas a producción.

Este documento describe detalladamente la arquitectura, componentes, configuraciones y decisiones técnicas involucradas en la implementación de la infraestructura GCP asociada al motor documental basado en Document AI.



# 2. Objetivo de la Infraestructura

La infraestructura cloud fue diseñada con el propósito de construir una plataforma centralizada de procesamiento documental inteligente, capaz de recibir documentos empresariales, analizarlos mediante modelos OCR avanzados y retornar información estructurada utilizable por aplicaciones internas y futuras integraciones corporativas.

Desde una perspectiva técnica, la solución debía cumplir los siguientes objetivos:

    * Permitir el procesamiento automático de documentos PDF mediante OCR inteligente.
    * Extraer información estructurada desde documentos semi-estructurados y no estructurados.
    * Soportar múltiples tipos documentales mediante procesadores especializados.
    * Centralizar la lógica documental fuera de los sistemas ERP existentes.
    * Escalar horizontalmente según demanda sin depender de infraestructura física.
    * Exponer capacidades de procesamiento mediante endpoints REST consumibles por otras plataformas.
    * Permitir entrenamiento y evolución iterativa de modelos documentales.
    * Incorporar mecanismos de seguridad corporativa y control de acceso.
    * Facilitar observabilidad, trazabilidad y monitoreo operacional.
    * Mantener desacoplamiento entre frontend, backend y motores OCR.

La arquitectura fue planteada además considerando futuras necesidades de crecimiento, incluyendo:

    * Incorporación de nuevos formatos documentales.
    * Soporte multi-cliente.
    * Integración directa con ERP corporativo.
    * Versionamiento de modelos.
    * Automatización de reglas de negocio.
    * Procesamiento masivo de documentos.

La decisión de utilizar servicios serverless y administrados de Google Cloud permitió reducir la complejidad operacional asociada a infraestructura tradicional, concentrando los esfuerzos técnicos en el diseño del pipeline documental y la lógica de procesamiento.



# 3. Arquitectura General de la Solución

La solución fue diseñada bajo una arquitectura desacoplada basada en servicios administrados de Google Cloud Platform, permitiendo separar claramente las responsabilidades de procesamiento documental, exposición de APIs, seguridad perimetral y consumo por aplicaciones cliente.

La plataforma se compone principalmente de los siguientes bloques arquitectónicos:

| Componente                 | Función                                           |
| -------------------------- | ------------------------------------------------- |
| Google Cloud Run           | Ejecución serverless del backend de procesamiento |
| Document AI                | OCR inteligente y extracción estructurada         |
| Cloud Storage              | Almacenamiento temporal y datasets documentales   |
| HTTPS Load Balancer        | Exposición segura mediante dominio corporativo    |
| Cloud Armor                | Restricción de acceso y protección perimetral     |
| Cloud Logging / Monitoring | Observabilidad y monitoreo operacional            |
| Frontend Web               | Interfaz de carga y visualización                 |
| ERP Corporativo (futuro)   | Consumo backend-to-backend de la plataforma       |

El flujo general de procesamiento funciona de la siguiente manera:

    1. Un usuario carga un documento PDF desde la plataforma web.
    2. El frontend envía el archivo al backend desplegado en Cloud Run.
    3. El backend valida el documento y lo envía al processor correspondiente de Document AI.
    4. Document AI ejecuta OCR avanzado y extracción de entidades.
    5. El backend interpreta la respuesta estructurada.
    6. Los datos procesados son retornados al frontend o futuros consumidores ERP.
    7. Logs, métricas y eventos son registrados en los servicios de observabilidad de GCP.

La arquitectura fue diseñada para desacoplar completamente el motor OCR del sistema ERP corporativo. Esto permite que el procesamiento documental pueda evolucionar de forma independiente, facilitando:

    * Reutilización por múltiples sistemas.
    * Mantenimiento modular.
    * Incorporación de nuevos modelos.
    * Escalabilidad independiente del ERP.

Adicionalmente, se incorporaron componentes de seguridad perimetral mediante HTTPS Load Balancer y Cloud Armor, restringiendo el acceso a la plataforma únicamente desde redes corporativas autorizadas.



# 4. Diseño de la Infraestructura GCP

## 4.1 Proyecto GCP

La solución fue implementada sobre un proyecto dedicado de Google Cloud Platform, permitiendo aislar los recursos asociados al procesamiento documental y centralizar la administración de servicios cloud relacionados con la plataforma.

La utilización de un proyecto independiente permitió:

    * Separar recursos respecto de otros entornos corporativos.
    * Controlar permisos y políticas IAM de manera específica.
    * Administrar costos asociados al procesamiento documental.
    * Facilitar monitoreo operacional y auditoría.

Dentro del proyecto se habilitaron distintos servicios administrados necesarios para la operación de la plataforma.

Entre las APIs principales utilizadas destacan:

            | Servicio              | Función                                   |
            | --------------------- | ----------------------------------------- |
            | Document AI API       | Procesamiento OCR y extracción documental |
            | Cloud Run API         | Ejecución serverless del backend          |
            | Cloud Build API       | Construcción y despliegue automatizado    |
            | Artifact Registry API | Gestión de imágenes y artefactos          |
            | Cloud Logging API     | Registro centralizado de logs             |
            | Cloud Monitoring API  | Métricas y observabilidad                 |
            | Compute Engine API    | Componentes de red y Load Balancer        |

La administración del entorno se realizó principalmente mediante:

    * Google Cloud Console.
    * Google Cloud SDK (`gcloud`).
    * Cloud Shell.
    * Despliegues automatizados vía línea de comandos.

La infraestructura fue diseñada bajo un enfoque cloud-native, privilegiando servicios administrados para reducir carga operacional y simplificar la escalabilidad del sistema.



## 4.2 Regiones y Distribución

La infraestructura principal fue desplegada en la región:

    southamerica-west1

La selección de esta región respondió principalmente a los siguientes factores:

### Cercanía Operacional

La región sudamericana permite reducir latencia entre usuarios corporativos y los servicios cloud desplegados, mejorando tiempos de respuesta en el procesamiento documental y consumo de APIs.

### Escalabilidad Regional

El uso de infraestructura regional administrada por Google Cloud facilita el escalamiento automático de servicios como Cloud Run y balanceadores HTTPS sin necesidad de administrar servidores manualmente.

### Centralización de Servicios

La mayoría de los componentes críticos fueron desplegados dentro de la misma región para minimizar tiempos de comunicación entre servicios y reducir complejidad de networking.

Entre los servicios desplegados regionalmente destacan:

    * Cloud Run
    * Load Balancer Backend
    * Cloud Logging
    * APIs de procesamiento
    * Conectividad backend

Mientras que algunos servicios globales fueron utilizados para funcionalidades específicas como:

    * certificados TLS administrados,
    * IP pública global,
    * y políticas de seguridad perimetral.



## 4.3 Cloud Storage

Google Cloud Storage fue utilizado como componente de soporte para el pipeline documental y el ciclo de entrenamiento de modelos Document AI.

Los buckets implementados cumplieron distintas funciones dentro de la arquitectura:

            | Tipo de Bucket   | Propósito                                      |
            | ---------------- | ---------------------------------------------- |
            | Dataset Bucket   | Almacenamiento de documentos de entrenamiento  |
            | Input Bucket     | PDFs de entrada para procesamiento             |
            | Temporary Bucket | Archivos temporales y procesamiento intermedio |
            | Export Bucket    | Resultados exportados y datasets etiquetados   |

Cloud Storage permitió desacoplar el almacenamiento documental del backend de procesamiento, facilitando:

    * Persistencia temporal.
    * Entrenamiento de modelos.
    * Procesamiento batch.
    * Reutilización de datasets.

Durante el entrenamiento de procesadores personalizados, los documentos almacenados en Cloud Storage fueron utilizados para:

    * Importación de datasets.
    * Auto-labeling.
    * Entrenamiento supervisado.
    * Validación de entidades.
    * Generación de nuevas versiones de modelos.

Adicionalmente, Cloud Storage facilitó pruebas técnicas y diagnósticos relacionados con documentos problemáticos, permitiendo reprocesar archivos específicos sin depender directamente del frontend de la plataforma.



# 5. Configuración de Document AI

Document AI constituye el núcleo principal del sistema de procesamiento documental implementado sobre Google Cloud Platform. Este servicio fue utilizado para ejecutar OCR avanzado, extracción estructurada de información y entrenamiento de modelos personalizados orientados a documentos empresariales reales.

La implementación contempló tanto el uso de procesadores preentrenados como modelos personalizados entrenados específicamente para estructuras documentales utilizadas por la organización.

La configuración de Document AI requirió abordar múltiples dimensiones técnicas:

    * Creación de processors.
    * Entrenamiento supervisado.
    * Etiquetado manual.
    * Versionamiento.
    * Despliegue de versiones.
    * Validación de resultados.
    * Troubleshooting operacional.

El diseño fue realizado bajo un enfoque evolutivo, permitiendo iterar continuamente sobre los modelos para mejorar precisión y robustez frente a variaciones documentales reales.

## 5.1 Creación de Processors

La plataforma fue diseñada utilizando múltiples processors especializados, permitiendo segmentar el procesamiento documental según el tipo de documento y la estructura esperada.

La separación de processors respondió a una necesidad técnica importante: distintos documentos presentan distribuciones, entidades y formatos completamente diferentes, lo que dificulta obtener buenos resultados utilizando un único modelo genérico.

Entre los tipos de processors utilizados destacan:

            | Processor                | Función                                           |
            | ------------------------ | ------------------------------------------------- |
            | Invoice Processor        | Extracción de información desde facturas          |
            | Bill of Lading Processor | Procesamiento de documentos logísticos            |
            | Custom Extractor         | Extracción personalizada de entidades específicas |

Cada processor fue configurado de forma independiente, permitiendo:

    * Entrenamientos separados.
    * Datasets específicos.
    * Validaciones individuales.
    * Versionamiento aislado.

La utilización de processors especializados permitió mejorar significativamente la precisión de extracción y reducir ambigüedades entre distintos tipos documentales.

Adicionalmente, esta estrategia facilita la incorporación futura de nuevos formatos documentales sin afectar modelos ya productivos.

## 5.2 Estrategia de Entrenamiento

El entrenamiento de modelos personalizados fue realizado utilizando datasets reales previamente etiquetados, permitiendo enseñar al modelo la ubicación, semántica y estructura de los campos relevantes para el negocio.

La estrategia de entrenamiento siguió un enfoque iterativo compuesto por varias etapas:

    1. Recolección de documentos reales.
    2. Clasificación por tipo documental.
    3. Etiquetado manual de entidades.
    4. Entrenamiento inicial del modelo.
    5. Validación de precisión.
    6. Corrección de errores.
    7. Reentrenamiento incremental.

El entrenamiento supervisado permitió mejorar progresivamente la capacidad del modelo para reconocer:

    * Entidades textuales.
    * Tablas.
    * Campos monetarios.
    * Fechas.
    * Identificadores.
    * Relaciones estructurales.

Uno de los desafíos principales fue la variabilidad documental entre proveedores y formatos reales. Diferencias en:

    * Diseño visual.
    * Resolución.
    * Orientación.
    * Calidad de escaneo.
    * Estructura tabular.

afectaban directamente la calidad de extracción.

Por esta razón, los datasets fueron construidos intentando representar múltiples escenarios reales, aumentando la robustez del modelo frente a documentos heterogéneos.

## 5.3 Etiquetado de Documentos

El etiquetado documental constituyó una de las etapas más críticas dentro del entrenamiento de modelos personalizados.

Durante este proceso se definieron manualmente las entidades que el modelo debía aprender a identificar dentro de cada documento.

Entre las entidades comúnmente etiquetadas destacan:

            | Entidad          | Descripción          |
            | ---------------- | -------------------- |
            | invoice_number   | Número de factura    |
            | supplier_name    | Nombre del proveedor |
            | invoice_date     | Fecha de emisión     |
            | total_amount     | Monto total          |
            | currency         | Tipo de moneda       |
            | purchase_order   | Orden de compra      |
            | container_number | Número de contenedor |

El etiquetado incluyó no solamente el texto de las entidades, sino también:

    * Ubicación espacial,
    * Bounding boxes,
    * Relaciones estructurales,
    * Tablas yanchors documentales.

La calidad del etiquetado tuvo un impacto directo sobre la precisión del entrenamiento, por lo que fue necesario mantener consistencia semántica entre datasets y entidades definidas.

Adicionalmente, se realizaron validaciones manuales posteriores al auto-labeling para corregir:

    * Detecciones incorrectas.
    * Entidades desplazadas.
    * Problemas de segmentación y errores de asociación tabular.

## 5.4 Problemas Encontrados Durante el Entrenamiento

Durante el ciclo de entrenamiento y despliegue de modelos se identificaron múltiples problemas técnicos asociados tanto a la configuración cloud como al comportamiento interno de Document AI.

Entre los incidentes más relevantes destacan:

### Errores Internos de Entrenamiento

En algunos casos, operaciones de entrenamiento finalizaron en estado:

FAILED

sin entregar detalles suficientemente explícitos sobre la causa raíz, requiriendo análisis manual de operaciones y logs internos.

### Problemas de Cuota y Autenticación

Durante pruebas mediante APIs y Cloud Shell se detectaron errores relacionados con:

quota project required

originados por configuraciones incompletas de credenciales ADC (Application Default Credentials).

### Fallos de Auto-Labeling

Algunos datasets presentaron inconsistencias durante procesos automáticos de etiquetado debido a:

    * Documentos corruptos.
    * Formatos incompatibles.
    * Estructuras ambiguas o problemas internos del servicio.

### Limitaciones Operacionales

Se detectó además una limitación importante en el procesamiento de PDFs extensos, debido a restricciones de páginas procesables por solicitud, obligando a diseñar posteriormente estrategias de división y procesamiento segmentado.

La resolución de estos problemas requirió:

    * Análisis de logs en Cloud Logging.
    * Revisión manual de operaciones GCP.
    * Pruebas REST directas.
    * Validaciones de datasets y ajustes iterativos de configuración.

## 5.5 Estrategia de Versionamiento de Processors

La plataforma fue diseñada considerando que los modelos documentales evolucionan constantemente a medida que se incorporan nuevos documentos y casos de uso.

Por esta razón, se implementó una estrategia de versionamiento basada en Processor Versions de Document AI.

Cada nueva iteración del modelo generaba una nueva versión entrenada, permitiendo:

    * Mantener versiones estables en producción.
    * Validar nuevas versiones experimentalmente.
    * Realizar rollback en caso de regresiones y comparar precisión entre modelos.

El ciclo típico de evolución consistía en:

    1. Entrenamiento de nueva versión.
    2. Validación manual.
    3. Despliegue controlado.
    4. Monitoreo de resultados.
    5. Promoción a producción.

Esta estrategia permitió reducir riesgos operacionales y mantener continuidad del servicio mientras los modelos continuaban evolucionando.

# 6. Pipeline de Procesamiento Documental

El pipeline de procesamiento documental fue diseñado como una cadena desacoplada de procesamiento capaz de recibir documentos empresariales, ejecutar análisis OCR inteligente mediante Document AI y retornar resultados estructurados listos para consumo por aplicaciones frontend y futuros sistemas ERP.

La arquitectura del pipeline fue construida bajo principios de:

    * Modularidad.
    * Tolerancia a fallos.
    * Escalabilidad.
    * Trazabilidad y desacoplamiento entre componentes.

Uno de los objetivos principales fue evitar que la lógica documental dependiera directamente del frontend o de sistemas corporativos externos, permitiendo centralizar el procesamiento en una única plataforma cloud reutilizable.

El flujo fue implementado utilizando servicios serverless y APIs REST, permitiendo procesar documentos bajo demanda sin necesidad de administrar infraestructura tradicional.



## 6.1 Flujo General

El flujo operacional del sistema puede resumirse en las siguientes etapas:

    1. El usuario carga un documento PDF desde la plataforma web.
    2. El frontend envía el archivo al backend desplegado en Cloud Run.
    3. El backend valida el documento recibido.
    4. Se determina el processor correspondiente según el tipo documental.
    5. El documento es enviado a Document AI mediante APIs oficiales.
    6. Document AI ejecuta OCR y extracción estructurada.
    7. El backend interpreta y transforma la respuesta JSON.
    8. Los resultados son enviados al frontend o consumidor externo.
    9. Logs y métricas son registrados en los sistemas de observabilidad.

El diseño desacoplado permitió separar claramente:

            | Componente         | Responsabilidad                  |
            | ------------------ | -------------------------------- |
            | Frontend           | Interfaz de usuario              |
            | Backend Cloud Run  | Orquestación y lógica documental |
            | Document AI        | OCR y extracción inteligente     |
            | Cloud Storage      | Persistencia documental          |
            | Servicios externos | Consumo futuro de resultados     |

La plataforma fue diseñada además para soportar futuras integraciones backend-to-backend, permitiendo que el ERP corporativo consuma directamente los resultados documentales mediante APIs REST sin depender del frontend actual.



## 6.2 Procesamiento OCR

El núcleo funcional del pipeline corresponde al procesamiento OCR ejecutado por Document AI.

A diferencia de motores OCR tradicionales centrados únicamente en reconocimiento de texto plano, Document AI permite comprender la estructura semántica y espacial del documento, entregando información enriquecida y estructurada.

Entre las capacidades utilizadas destacan:

    * Reconocimiento de texto.
    * Extracción de entidades.
    * Detección de tablas.
    * Relaciones estructurales.
    * Coordenadas espaciales.
    * Anchors documentales y confidence scores.

La respuesta generada por Document AI incluye un documento JSON estructurado que contiene:

            | Elemento   | Descripción               |
            | ---------- | ------------------------- |
            | text       | Texto completo reconocido |
            | entities   | Entidades detectadas      |
            | pages      | Información por página    |
            | tables     | Estructuras tabulares     |
            | confidence | Nivel de confianza        |
            | pageRefs   | Referencias espaciales    |

El backend implementado sobre Cloud Run interpreta posteriormente esta respuesta para:

    * Normalizar entidades,
    * Aplicar validaciones,
    * Transformar estructuras y preparar respuestas consistentes para el frontend.

La utilización de OCR estructurado permitió reducir significativamente la necesidad de validaciones manuales posteriores y facilitó la automatización de procesos documentales complejos.



## 6.3 Manejo de PDFs Grandes

Uno de los desafíos técnicos más relevantes detectados durante la implementación fue la limitación operacional de Document AI respecto al número máximo de páginas procesables por solicitud.

Durante las pruebas se identificó que documentos extensos superaban los límites soportados por determinados processors, generando errores de procesamiento o rechazos automáticos.

Este problema resultó especialmente relevante en documentos empresariales que podían contener:

    * Múltiples anexos.
    * Varias órdenes asociadas.
    * Grandes tablas o documentación logística consolidada.

Inicialmente se evaluó una estrategia manual donde el usuario debía dividir los documentos antes de cargarlos, sin embargo, esta aproximación fue descartada debido a:

    * Mala experiencia de usuario.
    * Aumento de errores operacionales.
    * Dependencia manual y dificultad para usuarios no técnicos.

Como solución, se diseñó una estrategia de procesamiento segmentado basada en:

    1. División automática del PDF en bloques compatibles.
    2. Procesamiento independiente de cada segmento.
    3. Recolección de resultados parciales.
    4. Reunificación lógica de entidades.
    5. Consolidación final del resultado estructurado.

Adicionalmente, se desarrolló un componente frontend experimental orientado a:

    * Visualizar páginas.
    * Eliminar hojas innecesarias.
    * Reorganizar documentos y exportar nuevos PDFs procesables.

Posteriormente, la arquitectura evolucionó hacia un enfoque más transparente donde el backend realizaría automáticamente la división sin intervención del usuario final.

Esta solución permitió mantener compatibilidad con las restricciones técnicas de Document AI sin afectar la experiencia operacional de los usuarios.



## 6.4 Manejo de Errores

El pipeline fue diseñado incorporando múltiples mecanismos de manejo de errores y resiliencia operacional, considerando que el procesamiento documental involucra diversos componentes distribuidos y dependencias cloud externas.

Los errores detectados durante la operación podían originarse desde distintas capas:

            | Capa            | Tipo de Error              |
            | --------------- | -------------------------- |
            | Frontend        | PDFs inválidos             |
            | Backend         | Validaciones fallidas      |
            | Document AI     | Errores OCR                |
            | GCP APIs        | Problemas de autenticación |
            | Networking      | Timeouts o conectividad    |
            | Infraestructura | Restricciones de acceso    |

Para reducir impacto operacional se implementaron validaciones previas al procesamiento, incluyendo:

    * Validación de tamaño.
    * Validación de extensión.
    * Verificación de páginas.
    * Control de archivos vacíos y validaciones MIME.

Adicionalmente, el backend incorporó mecanismos de:

    * Logging estructurado.
    * Captura de excepciones.
    * Mensajes controlados.
    * Trazabilidad de requests y respuestas de error normalizadas.

En escenarios de fallos parciales, la arquitectura fue diseñada para evitar interrupciones completas del servicio, permitiendo aislar errores específicos y facilitar diagnósticos posteriores.

La observabilidad centralizada mediante Cloud Logging resultó fundamental para identificar problemas relacionados con:

    * Autenticación.
    * Endpoints incorrectos.
    * Permisos insuficientes y errores internos de Document AI.



## 6.5 Transformación y Normalización de Resultados

Una vez obtenida la respuesta OCR desde Document AI, el backend ejecuta una etapa de transformación orientada a convertir la información extraída en una estructura consistente y consumible por aplicaciones externas.

Esta etapa fue necesaria debido a que los resultados entregados por Document AI pueden variar dependiendo de:

    * Tipo documental.
    * Processor utilizado.
    * Calidad del documento.
    * Estructura tabular y nivel de confianza de extracción.

El backend implementó lógica de normalización para:

    * Homogenizar nombres de entidades.
    * Convertir formatos de fechas.
    * Normalizar montos.
    * Validar monedas.
    * Limpiar caracteres especiales y consolidar resultados tabulares.

Adicionalmente, se incorporaron validaciones orientadas a detectar:

    * Entidades faltantes.
    * Confidence scores bajos.
    * Inconsistencias estructurales y posibles errores OCR.

El resultado final fue una estructura JSON estandarizada orientada a facilitar:

    * Consumo frontend.
    * Integración futura con ERP.
    * Automatización de reglas de negocio y persistencia estructurada.

Esta capa de normalización permitió desacoplar completamente a los consumidores externos de la estructura nativa de respuesta de Document AI, evitando dependencias directas con el proveedor cloud y facilitando futuras evoluciones de la plataforma.


# 7. Cloud Run y Backend de Procesamiento

La capa backend de la plataforma fue implementada utilizando Google Cloud Run como entorno de ejecución serverless principal.

La decisión de utilizar Cloud Run respondió a múltiples factores arquitectónicos y operacionales:

    * Escalabilidad automática.
    * Bajo costo operacional.
    * Integración nativa con GCP.
    * Despliegues simplificados.
    * Ejecución basada en contenedores y ausencia de administración de servidores.

El backend fue diseñado como un servicio REST encargado de orquestar completamente el pipeline documental, actuando como intermediario entre:

* Frontend web.
* Servicios Document AI.
* Almacenamiento cloud y futuros consumidores ERP.


## 7.1 Arquitectura Backend

La plataforma backend fue desarrollada utilizando Node.js y Express.js, permitiendo construir una API ligera, modular y fácilmente extensible.

Entre las principales responsabilidades del backend destacan:

            | Responsabilidad         | Descripción                  |
            | ----------------------- | ---------------------------- |
            | Recepción de documentos | Upload y validación          |
            | Orquestación OCR        | Comunicación con Document AI |
            | Transformación JSON     | Normalización de resultados  |
            | Manejo de errores       | Respuestas controladas       |
            | Seguridad               | Restricciones y validaciones |
            | Logging                 | Observabilidad operacional   |

La integración con Document AI fue realizada utilizando el SDK oficial de Google Cloud:

    @google-cloud/documentai


El backend implementó además una separación modular de responsabilidades para evitar concentrar toda la lógica en un único servicio monolítico.

Entre los componentes implementados destacan:

    * Controladores REST.
    * Servicios OCR.
    * Validadores documentales.
    * Parsers JSON y manejadores de errores.

Esta arquitectura permitió facilitar:

    * Mantenimiento.
    * Pruebas.
    * Escalabilidad futura y evolución funcional del sistema.



## 7.2 Variables de Entorno

La configuración operacional del backend fue gestionada mediante variables de entorno, permitiendo desacoplar parámetros sensibles y configuraciones cloud del código fuente.

Entre las variables más relevantes utilizadas destacan:

            | Variable                       | Función              |
            | ------------------------------ | -------------------- |
            | PROJECT_ID                     | Proyecto GCP         |
            | LOCATION                       | Región Document AI   |
            | PROCESSOR_ID                   | Processor activo     |
            | PORT                           | Puerto Cloud Run     |
            | GOOGLE_APPLICATION_CREDENTIALS | Credenciales locales |

La utilización de variables de entorno permitió:

    * Despliegues reutilizables.
    * Separación por ambientes.
    * Mayor seguridad y facilidad de configuración.

Durante entornos locales de desarrollo se detectaron además problemas relacionados con credenciales ADC (Application Default Credentials), especialmente en operaciones avanzadas de entrenamiento y consultas REST directas.

Por esta razón, fue necesario complementar la configuración mediante autenticación explícita utilizando Google Cloud SDK.



## 7.3 Despliegue

El despliegue del backend fue realizado utilizando Cloud Run y Cloud Build, permitiendo automatizar la construcción y publicación del servicio mediante contenedores administrados por Google Cloud.

El flujo típico de despliegue consistía en:

    1. Construcción del contenedor.
    2. Publicación automática.
    3. Despliegue serverless.
    4. Configuración de variables.
    5. Exposición HTTPS.

Los despliegues fueron realizados principalmente mediante línea de comandos utilizando Google Cloud SDK.

Ejemplo de despliegue utilizado:

bash
gcloud run deploy docai-backend \
  --source . \
  --region southamerica-west1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars PROJECT_ID=XXXXXXX,LOCATION=us,PROCESSOR_ID=XXXXXXXX


Cloud Run permitió además incorporar capacidades importantes como:

    * Escalamiento automático.
    * Revisiones versionadas.
    * Rollback simplificado.
    * Logs integrados y métricas operacionales nativas.

La utilización de servicios serverless permitió reducir significativamente la complejidad operacional respecto de arquitecturas tradicionales basadas en máquinas virtuales o clusters autoadministrados.



## 7.4 Integración con APIs Document AI

La comunicación entre el backend y Document AI fue implementada mediante llamadas directas a las APIs oficiales de Google Cloud.

El backend actúa como una capa de orquestación que:

    1. recibe el documento,
    2. prepara la solicitud,
    3. invoca el processor correspondiente,
    4. interpreta la respuesta,
    5. y retorna resultados estructurados.

El procesamiento se realizaba principalmente utilizando operaciones síncronas para documentos estándar, mientras que algunos escenarios experimentales evaluaron procesamiento batch para cargas mayores.

Entre las operaciones utilizadas destacan:

    | Operación          | Función                     |
    | ------------------ | --------------------------- |
    | processDocument    | Procesamiento OCR principal |
    | processorVersions  | Gestión de versiones        |
    | operations         | Monitoreo de entrenamientos |
    | dataset operations | Gestión de datasets         |

Durante la implementación se realizaron además pruebas REST directas para diagnósticos avanzados y troubleshooting operacional, especialmente en escenarios donde el SDK ocultaba detalles relevantes de error.

Esto permitió identificar problemas relacionados con:

    * Endpoints incorrectos.
    * Permisos insuficientes.
    * Processors no desplegados y errores internos de entrenamiento.



## 7.5 Estrategia Serverless y Escalabilidad

La arquitectura fue diseñada completamente bajo principios serverless con el objetivo de minimizar administración operacional y facilitar escalabilidad automática.

Cloud Run permitió que el backend escalara dinámicamente según:

    * Cantidad de solicitudes.
    * Carga documental.
    * Concurrencia.
    * Tiempo de procesamiento.

Entre las ventajas principales obtenidas destacan:

    * Ausencia de administración de servidores.
    * Pago por consumo.
    * Despliegues rápidos.
    * Escalamiento automático.
    * Alta disponibilidad administrada.

Adicionalmente, esta estrategia permitió desacoplar completamente la capacidad de procesamiento respecto del frontend o futuros sistemas ERP consumidores.

La arquitectura fue diseñada considerando crecimiento futuro en:

    * Volumen documental.
    * Cantidad de processors.
    * Integración multi-cliente.
    * Automatización empresarial.

El enfoque serverless permitió además mantener la plataforma alineada con principios cloud-native modernos, facilitando evolución continua y reducción de complejidad operacional.

# 8. Seguridad de la Plataforma

La seguridad de la plataforma fue diseñada considerando que el sistema debía operar sobre infraestructura cloud pública, pero procesando información empresarial sensible asociada a documentos operacionales y financieros.

Por esta razón, la arquitectura incorporó múltiples capas de protección orientadas a:

- Restringir acceso externo.
- Proteger endpoints backend.
- Asegurar comunicaciones HTTPS.
- Limitar acceso únicamente a redes corporativas autorizadas.
- Desacoplar completamente los servicios internos del acceso público directo.

La estrategia de seguridad fue implementada utilizando componentes nativos de Google Cloud Platform, permitiendo combinar protección perimetral, control de tráfico y restricciones de acceso a nivel de infraestructura.



## 8.1 HTTPS Load Balancer

Con el objetivo de exponer la plataforma mediante un dominio corporativo seguro y administrado, se implementó un HTTPS Load Balancer como punto de entrada principal hacia el backend desplegado en Cloud Run.

La utilización del balanceador permitió desacoplar la exposición pública del servicio backend respecto de la URL nativa generada por Cloud Run, facilitando:

- Uso de dominio corporativo.
- Terminación TLS.
- Administración centralizada de certificados.
- Políticas de seguridad.
- Control de tráfico entrante.

La arquitectura fue diseñada utilizando:

|       Componente          |           Función                 |
| HTTPS Load Balancer       | Entrada segura HTTPS              |
| IP Pública Global         | Exposición controlada             |
| Managed SSL Certificates  | Certificados TLS administrados    |
| Backend Service           | Integración con Cloud Run         |

Uno de los objetivos principales fue permitir que la plataforma operara mediante un dominio corporativo personalizado en lugar de depender directamente de endpoints públicos generados automáticamente por Google Cloud.

La utilización de certificados TLS administrados permitió automatizar:

- Provisión.
- Renovación.
- Validación.
- Administración criptográfica.

Esto redujo significativamente la complejidad operacional asociada al manejo manual de certificados SSL.

Durante la implementación fue necesario además coordinar configuraciones DNS corporativas y propagación de registros asociados al balanceador HTTPS.



## 8.2 Cloud Armor

Como mecanismo de protección perimetral se implementó Google Cloud Armor, permitiendo restringir el acceso a la plataforma únicamente desde redes corporativas autorizadas.

Cloud Armor fue utilizado principalmente para:

- Filtrado por IP.
- Allow lists corporativas.
- Denegación automática de tráfico no autorizado.
- Protección del backend frente a accesos externos.

La estrategia de seguridad implementada se basó en un modelo de acceso restringido donde únicamente determinadas redes VPN corporativas podían acceder a la plataforma.

El flujo de protección operaba de la siguiente manera:

1. El usuario se conecta a la VPN corporativa.
2. El tráfico corporativo sale mediante rangos IP autorizados.
3. Cloud Armor valida la IP de origen.
4. Si la IP pertenece a una allow list autorizada, el tráfico es permitido.
5. En caso contrario, el acceso es bloqueado automáticamente.

Esto permitió reducir significativamente la superficie de exposición pública del sistema.

Entre las capacidades utilizadas destacan:

|       Capacidad       |       Función             |
| Allow Lists           | Restricción por IP        |
| Deny Rules            | Bloqueo automático        |
| Security Policies     | Políticas perimetrales    |
| Backend Protection    | Protección de Cloud Run   |

La utilización de Cloud Armor permitió además mantener la plataforma técnicamente pública desde el punto de vista cloud, pero operacionalmente privada desde la perspectiva corporativa.



## 8.3 Restricción de Acceso

Adicionalmente a la protección perimetral implementada mediante Cloud Armor, la arquitectura incorporó mecanismos adicionales de restricción orientados a proteger directamente los endpoints backend y las APIs de procesamiento documental.

Entre las estrategias implementadas destacan:

### Restricción por IP

El acceso a la plataforma fue limitado únicamente a rangos IP corporativos autorizados mediante políticas de seguridad asociadas al Load Balancer.

Esto permitió bloquear automáticamente:

- Accesos externos.
- Tráfico desconocido.
- Escaneos automatizados.
- Solicitudes fuera del entorno corporativo.

### Backend Desacoplado

El backend de procesamiento fue diseñado para evitar exposición directa de lógica documental sensible.

La arquitectura desacopló:

- Frontend.
- Backend.
- Procesamiento OCR.
- Futuras integraciones ERP.

Esto permitió encapsular la lógica de negocio y mantener control centralizado sobre las operaciones documentales.

### APIs Protegidas

La estrategia de seguridad futura contempló además la incorporación de mecanismos de autenticación técnica orientados a integraciones backend-to-backend con sistemas ERP corporativos.

Entre las alternativas evaluadas destacan:

- Bearer tokens.
- Autenticación técnica.
- Service accounts.
- Validación de headers.
- APIs privadas internas.

La arquitectura fue diseñada considerando que el frontend actual no sería el único consumidor del sistema, por lo que las APIs debían ser tratadas como componentes empresariales reutilizables y protegidos.



# 9. Observabilidad y Monitoreo

La plataforma fue diseñada incorporando capacidades de observabilidad desde etapas tempranas de implementación, considerando que el procesamiento documental distribuido sobre servicios cloud requiere mecanismos robustos de monitoreo, trazabilidad y diagnóstico operacional.

La estrategia de observabilidad se centró en tres pilares principales:

|       Pilar       |       Objetivo                |
| Logging           | Registro y trazabilidad       |
| Monitoring        | Métricas y salud operacional  |
| Billing Analytics | Control de consumo y costos   |

La incorporación de estas capacidades permitió:

- Diagnosticar problemas técnicos.
- Monitorear comportamiento operacional.
- Identificar cuellos de botella.
- Analizar errores de procesamiento.
- Controlar costos asociados al uso de Document AI.



## 9.1 Cloud Logging

Google Cloud Logging fue utilizado como mecanismo centralizado de registro operacional y trazabilidad de eventos del sistema.

Todos los componentes principales de la arquitectura generaban logs estructurados, incluyendo:

- Backend Cloud Run.
- Llamadas a Document AI.
- Errores de procesamiento.
- Despliegues.
- Eventos de infraestructura.

La centralización de logs permitió facilitar:

- Debugging.
- Análisis operacional.
- Auditoría técnica.
- Troubleshooting distribuido.

Entre los tipos de eventos monitoreados destacan:

|   Tipo de Evento      |       Ejemplo             |
| Errores OCR           | Fallos Document AI        |
| Errores Backend       | Exceptions Node.js        |
| Problemas Auth        | Credenciales inválidas    |
| Requests HTTP         | Trazabilidad API          |
| Operaciones Training  | Estados FAILED            |
| Seguridad             | Accesos bloqueados        |

Uno de los beneficios más importantes de Cloud Logging fue la posibilidad de correlacionar eventos provenientes de distintos servicios cloud dentro de un mismo flujo operacional.

Esto permitió diagnosticar incidentes complejos relacionados con:

- Autenticación.
- Endpoints incorrectos.
- Processors no desplegados.
- Restricciones de acceso.
- Errores internos de infraestructura.



## 9.2 Cloud Monitoring

Google Cloud Monitoring fue utilizado para supervisar el comportamiento operacional de la plataforma y obtener métricas asociadas al rendimiento del sistema.

Entre las métricas principales monitoreadas destacan:

|       Métrica         |           Objetivo        |
| request_count         | Cantidad de solicitudes   |
| latencia              | Tiempo de procesamiento   |
| errores HTTP          | Fallos backend            |
| consumo Cloud Run     | Uso operacional           |
| disponibilidad        | Salud del servicio        |

El monitoreo permitió identificar:

- Incrementos de carga.
- Errores recurrentes.
- Degradación de performance.
- Comportamiento anómalo del sistema.

Adicionalmente, se realizaron pruebas utilizando métricas avanzadas asociadas a Cloud Run y Document AI con el objetivo de aproximar:

- Cantidad de documentos procesados.
- Consumo operacional.
- Volumen de requests diarios.

La observabilidad operacional fue especialmente relevante debido a la naturaleza asincrónica y distribuida de algunos componentes asociados al entrenamiento y procesamiento documental.


## 9.3 Billing y Costos

Uno de los aspectos más relevantes de la operación sobre servicios OCR cloud corresponde al control de costos asociados al procesamiento documental.

Para abordar esta necesidad se implementó una estrategia de monitoreo financiero basada en exportación de datos de facturación hacia BigQuery.

La arquitectura de billing analytics permitió:

- Monitorear consumo.
- Identificar costos por servicio.
- Analizar procesamiento documental.
- Estimar crecimiento operacional.

La exportación de billing fue utilizada principalmente para obtener métricas relacionadas con:

|       Métrica             |       Descripción         |
| Pages Processed           | Páginas OCR procesadas    |
| Costos Document AI        | Consumo OCR               |
| Consumo Cloud Run         | Backend serverless        |
| Requests Operacionales    | Tráfico plataforma        |

El uso de BigQuery permitió ejecutar consultas analíticas orientadas a:

- Identificar tendencias de consumo.
- Calcular costos mensuales.
- Estimar escalabilidad futura.
- Validar impacto financiero del procesamiento documental.

Adicionalmente, este enfoque permitió diferenciar costos asociados específicamente a Document AI respecto de otros componentes cloud utilizados por la plataforma.

La incorporación temprana de monitoreo financiero resultó especialmente importante debido a que los servicios OCR basados en IA poseen costos directamente relacionados con volumen documental procesado.



# 10. Problemas Técnicos Reales y Soluciones

Durante la implementación de la plataforma se identificaron múltiples desafíos técnicos asociados tanto a la infraestructura cloud como al comportamiento interno de los servicios administrados utilizados.

La resolución de estos problemas constituyó una parte importante del proceso de maduración técnica de la solución y permitió fortalecer significativamente la arquitectura final.


## 10.1 Problemas SSL y Certificados Administrados

Durante la configuración inicial del HTTPS Load Balancer y los certificados TLS administrados se detectaron problemas relacionados con validación de dominio y propagación DNS.

Uno de los estados observados durante la provisión de certificados fue:

FAILED_NOT_VISIBLE

# 11. Escalabilidad y Evolución

La arquitectura fue diseñada desde sus etapas iniciales considerando crecimiento progresivo, incorporación de nuevos componentes y futuras integraciones corporativas.

Uno de los objetivos principales fue evitar construir una solución rígida o acoplada únicamente al frontend inicial, permitiendo que la plataforma evolucionara hacia un servicio documental centralizado reutilizable por distintos sistemas empresariales.

La estrategia de evolución técnica se basó en principios de:

    - Desacoplamiento.
    - Modularidad.
    - Escalabilidad horizontal.
    - Separación de responsabilidades.
    - Evolución independiente de componentes.



## 11.1 Integración ERP Futura

Uno de los principales objetivos de evolución corresponde a la integración directa entre la plataforma documental y el ERP corporativo.

La arquitectura fue diseñada considerando que el ERP no consumiría directamente servicios OCR ni interactuaría con Document AI de manera nativa.

En cambio, la plataforma documental actuaría como una capa intermedia centralizada encargada de:

    - Procesar documentos.
    - Ejecutar OCR inteligente.
    - Normalizar resultados.
    - Aplicar validaciones.
    - Exponer APIs empresariales reutilizables.

Este enfoque permite desacoplar completamente la lógica documental respecto del ERP, evitando:

    - Dependencia tecnológica directa.
    - Duplicación de lógica OCR.
    - Acoplamiento con proveedores cloud.
    - Complejidad documental dentro del ERP.

La futura integración contempla un modelo backend-to-backend donde el ERP consumirá endpoints protegidos de la plataforma documental para:

    - Enviar documentos.
    - Obtener resultados estructurados.
    - Consultar estados de procesamiento.
    - Integrar automatizaciones operacionales.



## 11.2 Arquitectura Desacoplada

La solución fue diseñada bajo una arquitectura desacoplada donde cada componente cumple responsabilidades específicas e independientes.

La separación de capas permitió desacoplar:

| Componente        | Responsabilidad           |
| Frontend          | Interfaz de usuario       |
| Backend Cloud Run | Orquestación documental   |
| Document AI       | OCR y extracción          |
| Cloud Storage     | Persistencia documental   |
| ERP Futuro        | Consumo empresarial       |

Este enfoque permite que cada componente pueda evolucionar individualmente sin afectar necesariamente el resto de la plataforma.

Entre las ventajas obtenidas destacan:

    - Facilidad de mantenimiento.
    - Escalabilidad independiente.
    - Reutilización de servicios.
    - Integración multi-sistema.
    - Evolución tecnológica progresiva.

La arquitectura desacoplada permitió además encapsular toda la complejidad OCR dentro de una capa backend centralizada.



## 11.3 Soporte Multi-Cliente

La arquitectura fue concebida considerando escenarios futuros donde múltiples clientes, áreas o procesos documentales pudieran reutilizar la misma plataforma.

La separación por processors y configuraciones independientes permite incorporar nuevos escenarios documentales sin necesidad de reconstruir completamente la solución.

La estrategia multi-cliente considera:

    - Processors independientes.
    - Configuraciones aisladas.
    - Reglas documentales específicas.
    - Datasets separados.
    - Versionamiento independiente.

Esto permite extender la plataforma hacia distintos tipos documentales o flujos empresariales manteniendo aislamiento lógico entre configuraciones.



## 11.4 Estrategia Multi-Processor

Uno de los principios arquitectónicos más importantes implementados fue la utilización de múltiples processors especializados.

En lugar de centralizar toda la extracción documental en un único modelo genérico, la plataforma fue diseñada utilizando processors independientes según:

    - Tipo documental.
    - Cliente.
    - Estructura del documento.
    - Proceso empresarial.
    - Naturaleza de la extracción.

Este enfoque permite:

    - Mejorar precisión OCR.
    - Reducir ambigüedad documental.
    - Facilitar entrenamiento especializado.
    - Versionar modelos individualmente.
    - Escalar procesamiento de forma segmentada.

La estrategia multi-processor facilita además incorporar nuevos modelos sin afectar processors ya productivos.



## 11.5 Pipeline Extensible

El pipeline documental fue diseñado bajo un enfoque extensible donde nuevas funcionalidades pueden incorporarse progresivamente sin requerir rediseños completos de arquitectura.

Entre las capacidades futuras consideradas destacan:

    - Nuevos tipos documentales.
    - Reglas automáticas de validación.
    - Procesamiento batch masivo.
    - Integración con workflows empresariales.
    - Automatización de aprobaciones.
    - Persistencia estructurada en bases de datos.
    - Integración con sistemas ERP y BPM.

La utilización de servicios serverless y APIs desacopladas facilita además incorporar nuevos consumidores o componentes cloud sin modificar el núcleo del procesamiento documental.



# 12. Resultados Obtenidos

La implementación de la plataforma permitió construir una solución documental cloud funcional, escalable y preparada para futuras integraciones corporativas.

Desde una perspectiva técnica y operacional, el proyecto permitió validar exitosamente la utilización de Google Cloud Platform y Document AI como núcleo de automatización documental empresarial.

Entre los principales resultados obtenidos destacan:



## 12.1 Reducción de Procesos Manuales

La plataforma permitió automatizar gran parte del proceso de lectura y extracción documental que anteriormente requería intervención manual.

Esto permitió reducir:

    - Digitación manual.
    - Validaciones repetitivas.
    - Lectura visual de documentos.
    - Dependencia operacional humana.
    - Riesgo de errores manuales.



## 12.2 Automatización del Pipeline Documental

La solución logró implementar un pipeline automatizado capaz de:

    - Recibir documentos.
    - Procesarlos mediante OCR inteligente.
    - Extraer entidades estructuradas.
    - Normalizar resultados.
    - Retornar información procesable mediante APIs.

La automatización permitió además establecer una base técnica sólida para futuras integraciones empresariales.



## 12.3 Centralización del Procesamiento OCR

La arquitectura permitió desacoplar completamente el procesamiento documental respecto de aplicaciones consumidoras.

Esto permitió centralizar:

    - OCR.
    - Entrenamiento.
    - Reglas documentales.
    - Seguridad.
    - Monitoreo.
    - Evolución de modelos.

La centralización facilita mantener una única plataforma documental reutilizable por múltiples sistemas corporativos.



## 12.4 Escalabilidad Cloud-Native

La utilización de servicios serverless permitió construir una arquitectura alineada con principios cloud-native modernos.

Entre las capacidades obtenidas destacan:

    - Escalamiento automático.
    - Alta disponibilidad administrada.
    - Despliegues rápidos.
    - Reducción de infraestructura manual.
    - Elasticidad operacional.

La plataforma quedó preparada para soportar crecimiento futuro tanto en volumen documental como en cantidad de consumidores.



## 12.5 Base para Integración Empresarial

Uno de los resultados más relevantes fue la construcción de una arquitectura preparada para integrarse posteriormente con sistemas ERP corporativos.

La plataforma logró establecer:

    - APIs desacopladas.
    - Seguridad perimetral.
    - Backend reutilizable.
    - Normalización documental.
    - Arquitectura extensible.

Esto permite que futuros sistemas empresariales consuman capacidades OCR sin depender directamente de proveedores cloud ni implementar lógica documental propia.



# 13. Conclusión Técnica

La implementación de la plataforma documental basada en Google Cloud Platform y Document AI permitió construir una solución cloud moderna orientada al procesamiento inteligente de documentos empresariales.

El proyecto no se limitó únicamente al consumo básico de servicios OCR, sino que involucró el diseño completo de una arquitectura desacoplada, escalable y preparada para evolución empresarial futura.

La solución incorporó múltiples componentes técnicos relevantes, incluyendo:

    - Infraestructura serverless.
    - Processors especializados.
    - Entrenamiento de modelos personalizados.
    - Seguridad perimetral.
    - Observabilidad operacional.
    - Monitoreo financiero.
    - Gestión documental cloud.
    - APIs desacopladas.
    - Estrategias de escalabilidad.

Durante la implementación se abordaron además diversos desafíos técnicos reales asociados a:

    - Entrenamiento de modelos.
    - Configuración cloud.
    - Seguridad.
    - Integración entre servicios.
    - Variabilidad documental.
    - Restricciones operacionales de Document AI.

La resolución de estos problemas permitió fortalecer significativamente la arquitectura final y consolidar una plataforma preparada para escenarios empresariales reales.

La arquitectura obtenida establece una base sólida para futuras etapas de evolución, incluyendo integración ERP, automatización documental avanzada y expansión hacia nuevos procesos corporativos.



# 14. Anexos

## A. Diagrama Arquitectónico

El diagrama arquitectónico representa los principales componentes de la solución y las relaciones entre:

    - Frontend web.
    - Cloud Run.
    - Document AI.
    - Cloud Storage.
    - HTTPS Load Balancer.
    - Cloud Armor.
    - ERP corporativo futuro.

El objetivo del diagrama es visualizar el flujo completo de procesamiento documental y la separación de responsabilidades dentro de la arquitectura cloud.



## B. Flujo OCR

El flujo OCR documenta detalladamente el recorrido operacional de un documento desde su carga inicial hasta la obtención del resultado estructurado.

Incluye:

    1. Recepción del PDF.
    2. Validaciones backend.
    3. Envío a Document AI.
    4. Extracción OCR.
    5. Normalización de entidades.
    6. Retorno de resultados.
    7. Registro de logs y métricas.



## C. Flujo de Entrenamiento

Este anexo describe el ciclo de entrenamiento de modelos personalizados implementado sobre Document AI.

Incluye:

    - Recolección documental.
    - Etiquetado manual.
    - Auto-labeling.
    - Entrenamiento.
    - Validación.
    - Versionamiento.
    - Despliegue de nuevas versiones.



## D. Configuración Cloud Run

Este anexo incluye ejemplos referenciales de configuración y despliegue utilizados durante la implementación del backend serverless.

Ejemplo de despliegue:

gcloud run deploy backend-service \
  --source . \
  --region REGION \
  --platform managed \
  --allow-unauthenticated

  También considera ejemplos de:

    - Variables de entorno.
    - Configuración regional.
    - Logs operacionales.
    - Revisión de servicios.

E. Configuración Cloud Armor

Este anexo documenta la estrategia de protección perimetral implementada mediante Cloud Armor.

Incluye:

    - Allow lists corporativas.
    - Restricciones IP.
    - Reglas deny.
    - Integración con HTTPS Load Balancer.
    - Validación mediante VPN corporativa.

F. Ejemplos JSON de Extracción

Este anexo contiene ejemplos anonimizados de respuestas JSON generadas por Document AI luego del procesamiento documental.

Los ejemplos incluyen:

    - Entidades detectadas.
    - Confidence scores.
    - Tablas extraídas.
    - Coordenadas documentales.
    - Normalización backend.

Toda información sensible o corporativa debe ser anonimizada antes de incorporarse al documento.

G. Logs Técnicos Relevantes

Este anexo contiene ejemplos representativos de logs técnicos utilizados durante troubleshooting y monitoreo operacional.

Incluye ejemplos asociados a:

    - Errores Document AI.
    - Entrenamientos FAILED.
    - Restricciones Cloud Armor.
    - Errores OAuth.
    - Problemas SSL.
    - Logs Cloud Run.
    - Validaciones backend.

Los logs deben ser anonimizados eliminando:

    - IDs sensibles.
    - Tokens.
    - Direcciones IP internas.
    - URLs privadas.
    - Información corporativa confidencial.
