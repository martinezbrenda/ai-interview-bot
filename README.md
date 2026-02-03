# 🤖 AI Interview Prep Bot

Sistema de preparación para entrevistas técnicas de AI Engineer usando IA, integrado con webhooks y orquestación n8n.

## 🎯 Objetivo del Proyecto

Demostrar integración end-to-end de tecnologías clave para un AI Engineer:
- ✅ Node.js/Express (backend RESTful)
- ✅ Groq API (agente de IA con prompt engineering)
- ✅ Webhooks (recepción y procesamiento)
- ✅ n8n (orquestación de workflows no-code)
- ✅ Git/GitHub (control de versiones)
- ✅ Deploy en producción (Railway)

---

## 🏗️ Arquitectura
```
Usuario/Sistema → n8n Webhook → Express API → Groq LLM → Respuesta JSON
```

**Flujo de datos:**
1. Usuario envía pregunta a webhook de n8n
2. n8n hace POST a Express `/webhook/message`
3. Express procesa con Groq (Llama 3.3 70B)
4. Groq genera respuesta contextual
5. Express retorna JSON a n8n
6. n8n responde al usuario

---

## 🚀 Instalación y Uso

### **Requisitos previos**
- Node.js >= 18.x
- npm o yarn
- Cuenta en Groq (gratuita): https://console.groq.com

### **Setup local**
```bash
# Clonar repositorio
git clone https://github.com/martinezbrenda/ai-interview-bot.git
cd ai-interview-bot

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env y agregar tu GROQ_API_KEY

# Ejecutar en desarrollo
npm run dev

# Ejecutar en producción
npm start
```

### **Configuración `.env`**
```env
GROQ_API_KEY=gsk_tu_api_key_aqui
PORT=3000
```

---

## 📡 Endpoints API

### `GET /health`
Health check del servicio

**Response:**
```json
{
  "status": "ok",
  "service": "AI Interview Bot",
  "timestamp": "2025-02-03T18:30:00.000Z"
}
```

### `POST /api/chat`
Interacción directa con el agente de IA

**Request:**
```json
{
  "message": "Explica qué es GraphQL",
  "userId": "brenda"
}
```

**Response:**
```json
{
  "success": true,
  "answer": "GraphQL es un lenguaje de consulta...",
  "userId": "brenda",
  "timestamp": "2025-02-03T18:30:00.000Z"
}
```

### `POST /webhook/message`
Webhook para integración con n8n u otros sistemas

**Request:**
```json
{
  "message": "Dame 3 preguntas sobre Node.js",
  "from": "n8n-user"
}
```

**Response:**
```json
{
  "success": true,
  "response": "1. ¿Qué es el Event Loop?...",
  "to": "n8n-user"
}
```

### `GET /api/random-question`
Obtener pregunta técnica aleatoria

**Response:**
```json
{
  "question": "Explica qué es un webhook y cuándo lo usarías"
}
```

---

## 🛠️ Stack Tecnológico

| Categoría | Tecnología |
|-----------|------------|
| **Runtime** | Node.js 18+ |
| **Framework** | Express.js |
| **AI/LLM** | Groq (Llama 3.3 70B) |
| **Orquestación** | n8n |
| **Deploy** | Railway / ngrok (dev) |
| **Version Control** | Git + GitHub |

---

## 💡 Conceptos Implementados

### **Backend & APIs**
- ✅ RESTful API design
- ✅ Webhook receivers y senders
- ✅ Middleware en Express
- ✅ Error handling y logging
- ✅ Environment variables (dotenv)
- ✅ JSON request/response formatting

### **Inteligencia Artificial**
- ✅ **Prompt Engineering:** System prompt para contexto del agente
- ✅ **AI Agent pattern:** Conversacional con memoria de contexto
- ✅ **LLM parameters tuning:** Temperature, max_tokens
- ✅ Integración con API externa (Groq)

### **DevOps & Deployment**
- ✅ Git workflow (branches, commits, push)
- ✅ Gestión de secrets (.env, .gitignore)
- ✅ Exposición de servicios locales (ngrok)
- ✅ Deploy en cloud (Railway)

### **Integración & Automatización**
- ✅ n8n workflow orchestration
- ✅ HTTP requests entre servicios
- ✅ Webhook handling bidireccional

---

## 🧪 Testing Manual
```bash
# Health check
curl http://localhost:3000/health

# Chat directo
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Qué es un webhook?", "userId": "test"}'

# Webhook (con ngrok)
curl -X POST https://tu-url.ngrok-free.dev/webhook/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Dame tips para entrevistas", "from": "curl"}'

# Pregunta random
curl http://localhost:3000/api/random-question
```

---

## 🔧 Configuración n8n

### **Workflow: AI Interview Bot**

**Nodos:**
1. **Webhook** → Path: `/interview-bot`, Method: POST
2. **HTTP Request** → URL: `{ngrok_url}/webhook/message`, Method: POST
3. **Respond to Webhook** → Body: `{{ $json.response }}`

**JSON del workflow:** (Ver `/n8n-workflow.json` en el repo)

---

## 📈 Mejoras Futuras

- [ ] Base de datos (PostgreSQL) para historial de conversaciones
- [ ] Rate limiting por usuario/IP
- [ ] Autenticación con JWT o API Keys
- [ ] Docker containerization
- [ ] CI/CD con GitHub Actions
- [ ] Tests unitarios (Jest) y e2e
- [ ] Integración con Telegram/WhatsApp oficial
- [ ] Dashboard de métricas (requests, latencia, errores)
- [ ] Caching de respuestas frecuentes (Redis)
- [ ] Logging estructurado (Winston/Pino)

---

## 👤 Autor

**Brenda Martinez**  
AI Engineer & Data Scientist

- 📧 Email: brendacarolinamartinez888@gmail.com
- 💼 LinkedIn: [/martinezbrendacarolina](https://linkedin.com/in/martinezbrendacarolina)
- 📞 WhatsApp: +54 11 2297 3347
