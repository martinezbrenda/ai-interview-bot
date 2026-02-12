# 🤖 AI Interview Bot

Sistema integral de preparación para entrevistas técnicas de **AI Engineer**. Este proyecto utiliza una arquitectura de microservicios para ofrecer una experiencia bimodal: **preparación técnica** y **gestión psicotécnica (soft skills)**.

## 🎯 Objetivo del Proyecto

El propósito de este sistema es demostrar la capacidad de **integración end-to-end** de un ecosistema moderno de IA, resolviendo retos comunes en el desarrollo de agentes inteligentes:

* **Desarrollo Backend:** Implementación de una **API RESTful** robusta utilizando **Node.js** y **Express**.
* **Contextual AI Anchor:** Capacidad de analizar **Job Descriptions** externos para personalizar el entrenamiento.
* **Prompt Engineering Avanzado:** Diseño de un agente con lógica bimodal y adaptabilidad de contexto mediante el SDK de **Groq** (Llama 3.3 70B).
* **Sincronización de Sistemas:** Recepción, validación y procesamiento de **Webhooks** en tiempo real.
* **Orquestación No-Code:** Automatización de flujos de trabajo complejos y conexión de servicios externos con **n8n**.
* **Resiliencia:** Manejo de errores y degradación elegante del servicio ante fallos de infraestructura.
* **Ciclo de Vida de Software (SDLC):** Gestión de versiones con **Git/GitHub** y despliegue continuo (CI/CD) en la nube mediante **Railway**.

## 🏗️ Arquitectura y Flujo de Ejecución

El sistema opera bajo un modelo de microservicios desacoplados para garantizar escalabilidad y facilidad de mantenimiento:

**Diagrama de Flujo:**
`Usuario (Telegram) → n8n Orquestador (Webhook) → Backend (Express API) → IA (Groq LLM) → Respuesta Estructurada (JSON)`

### Pipeline de ejecución:

1. **Ingesta**: El usuario envía texto o un archivo `.txt` vía Telegram.
2. **ETL en el Edge (n8n)**: El orquestador extrae el contenido binario y lo transforma en un string estructurado.
3. **Inyección de Contexto**: El backend en **Railway** recibe el mensaje y la **Job Description**, anclándolos como prioridad en la memoria de la sesión.
4. **Inferencia de IA**: Se consulta al modelo **Llama 3.3 70B** vía **Groq SDK** aplicando un **System Prompt** bimodal.
5. **Entrega Multiformato**: El nodo **Code** en n8n detecta el cliente (Telegram o Terminal) y aplica formato HTML o secuencias **ANSI** respectivamente.

## 🧠 Gestión de Memoria y Estados (Stateful AI)

A diferencia de implementaciones *stateless*, este bot mantiene la coherencia mediante:

* **Session Management**: Gestión de objetos de sesión indexados por `userId` en memoria volátil.
* **Sliding Window Memory**: Ventana deslizante que preserva el **System Prompt** y la **Job Description**, eliminando turnos intermedios para optimizar la ventana de contexto (128k tokens).
* **Reset Logic**: Endpoint dedicado para la limpieza síncrona de estados.

## 🚀 Funcionalidades Principales

### 1. Preparación Bimodal

* **Modo Relajación**: Técnicas de mindfulness y preparación psicológica pre-entrevista.
* **Modo Práctica**: Simulacros técnicos con detección de "humo" y validación de conceptos clave (Webhooks, GraphQL, LangChain).

### 2. Análisis Dinámico de JDs

El backend permite inyectar descriptivos de puesto para:

* Generar preguntas de validación crítica basadas en el stack real de la empresa.
* Identificar brechas de conocimiento específicas para el candidato.


## 🧠 Lógica del Agente (Prompt Engineering)

El bot opera bajo dos modos principales configurados mediante un **System Prompt** avanzado:

### 1. Relajación Pre-Entrevista

* **Entrevistado:** Técnicas de mindfulness, respiración y rutinas de confianza.
* **Entrevistador:** Técnicas de rapport y creación de ambientes profesionales.

### 2. Práctica Técnica

* **Detección de Humo:** Preguntas punzantes para validar experiencia real en niveles Junior, Mid y Senior.
* **Key Indicators:** Definición de conceptos clave que el candidato debe mencionar para demostrar dominio.
* **Método STAR:** Guía para estructurar respuestas comportamentales.

## 🚀 Instalación y Setup

### Requisitos

* **Node.js** >= 20.x
* **Groq API Key**
* **n8n instance** (Local o Cloud)

### Configuración .env

```env
GROQ_API_KEY=your_key_here
PORT=3000

```

## 🛠️ Stack Tecnológico

| Categoría | Tecnología | Rationale |
| --- | --- | --- |
| **Runtime** | Node.js 22 | Estabilidad y soporte de APIs modernas. |
| **Framework** | Express.js | Ligereza para microservicios RESTful. |
| **AI Engine** | Groq (Llama 3.3 70B) | Inferencia ultra-rápida (LPU Technology). |
| **Orquestación** | n8n | Automatización de flujos de trabajo sin código. |
| **Infraestructura** | Railway | Despliegue continuo (CI/CD) y PaaS seguro. |

## 🧪 Endpoints Principales

* `POST /webhook/message`: Punto de entrada principal para n8n. Gestiona el procesamiento de mensajes mediante el SDK de Groq.
* POST /api/chat: Interfaz programática para inyección de JDs y mensajes.
* `GET /health`: Monitoreo del estado del servicio y latencia.

---

## 👤 Autor

**Brenda Martinez**  
AI Engineer & Data Scientist

- 📧 Email: brendacarolinamartinez888@gmail.com
- 💼 LinkedIn: [/martinezbrendacarolina](https://linkedin.com/in/martinezbrendacarolina)
- 📞 WhatsApp: +54 11 2297 3347

---

