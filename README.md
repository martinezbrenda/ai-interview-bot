# 🤖 AI Interview Bot

Sistema integral de preparación para entrevistas técnicas de **AI Engineer**. Este proyecto utiliza una arquitectura de microservicios para ofrecer una experiencia bimodal: **preparación técnica** y **gestión psicotécnica (soft skills)**.

## 🎯 Objetivo del Proyecto

El propósito de este sistema es demostrar la capacidad de **integración end-to-end** de un ecosistema moderno de IA, resolviendo retos comunes en el desarrollo de agentes inteligentes:

* **Desarrollo Backend:** Implementación de una **API RESTful** robusta utilizando **Node.js** y **Express**.
* **Prompt Engineering Avanzado:** Diseño de un agente con lógica bimodal y adaptabilidad de contexto mediante el SDK de **Groq** (Llama 3.3 70B).
* **Sincronización de Sistemas:** Recepción, validación y procesamiento de **Webhooks** en tiempo real.
* **Orquestación No-Code:** Automatización de flujos de trabajo complejos y conexión de servicios externos con **n8n**.
* **Ciclo de Vida de Software (SDLC):** Gestión de versiones con **Git/GitHub** y despliegue continuo (CI/CD) en la nube mediante **Railway**.

## 🏗️ Arquitectura y Flujo de Ejecución

El sistema opera bajo un modelo de microservicios desacoplados para garantizar escalabilidad y facilidad de mantenimiento:

**Diagrama de Flujo:**
`Usuario (Telegram) → n8n Orquestador (Webhook) → Backend (Express API) → IA (Groq LLM) → Respuesta Estructurada (JSON)`

### Paso a paso del flujo de datos:

1. **Entrada de Usuario:** El usuario interactúa con el bot de Telegram, lo que dispara un evento hacia el **Webhook de n8n**.
2. **Orquestación:** n8n recibe los datos, los normaliza y realiza una petición `POST` al endpoint `/webhook/message` de nuestro servidor en **Express**.
3. **Procesamiento de IA:** El servidor en **Railway** recibe el mensaje, aplica el **System Prompt** configurado y consulta al modelo **Llama 3.3 70B** a través del SDK de **Groq**.
4. **Generación de Respuesta:** Groq procesa la intención y devuelve una respuesta contextual basada en el rol (Entrevistado/Entrevistador) y nivel de seniority.
5. **Cierre del Ciclo:** Express retorna la respuesta en formato JSON a n8n, que finalmente entrega el mensaje al usuario en Telegram.

---

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
* `GET /health`: Monitoreo del estado del servicio y latencia.

---

## 👤 Autor

**Brenda Martinez**  
AI Engineer & Data Scientist

- 📧 Email: brendacarolinamartinez888@gmail.com
- 💼 LinkedIn: [/martinezbrendacarolina](https://linkedin.com/in/martinezbrendacarolina)
- 📞 WhatsApp: +54 11 2297 3347

---

