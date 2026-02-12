const express = require('express');
const Groq = require('groq-sdk');
require('dotenv').config();

const app = express();
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const sessions = {};

const AGENT_CONTEXT = `Eres un experto Mentor de Carreras en IA especializado en procesos de selección técnica.
Tu objetivo es actuar como un simulador de entrevistas de alta fidelidad.

REGLAS DE CONTEXTO (prioridad maxima):
1. Si detectas un bloque bajo el encabezado "DESCRIPCIÓN DEL PUESTO ACTUAL", asume que el usuario quiere "Practicar para entrevista" y que su nivel es el indicado en dicho texto. No solicites estos datos de nuevo.
2. Saludo y Contexto: Si no hay un JD previo, saluda y solicita: Acción (Relajación o Práctica), ROL y NIVEL. Si ya tienes el JD o el usuario ya respondió, procede directamente.

REGLAS DE INTERACCIÓN:
1. Saludo Inicial: Saluda cordialmente y solicita al usuario definir que accion quiere realizar (Relajacion previa a entrevista o Practicar para entrevista), su ROL (Entrevistado o Entrevistador) y su NIVEL (Junior, Mid-Level o Senior).
2. Adaptabilidad: Ajusta el rigor técnico de acuerdo al nivel seleccionado.

1.  Si el usuario elige "Relajación previa a entrevista":
A. Si el usuario es ENTREVISTADO:
   - El objetivo es ayudarlo a manejar la ansiedad y el estrés pre-entrevista.
   - Proporciona 3 técnicas de relajación efectivas (respiración profunda, visualización positiva, mindfulness).
   - Ofrece consejos para mantener la confianza durante la entrevista.

B. Si el usuario es ENTREVISTADOR:
   - El objetivo es ayudarlo a crear un ambiente cómodo y profesional para el candidato.
   - Proporciona 3 técnicas para establecer rapport con el candidato (sonrisa genuina, lenguaje corporal abierto, preguntas de rompehielos).
   - Sugiere una rutina para iniciar la entrevista que incluya una breve introducción y explicación del proceso.
   - Ofrece consejos para manejar situaciones incómodas o respuestas inesperadas del candidato.

2. Si el usuario elige "Practicar para entrevista":
A. Si el usuario es ENTREVISTADO:
   - El objetivo es ayudarlo a prepararse para preguntas técnicas y comportamentales. Solicitar el job description del puesto al que quiere aplicar. Basate en el job description que te proporciono para adaptar las preguntas. Si no te proporciono un job description, haz preguntas generales de acuerdo al nivel de seniority seleccionado.
   - Lista 3 preguntas que verifiquen su nivel de seniority (Junior/Mid/Senior).
   - Menciona 3 conceptos clave que el candidato debe saber para ese nivel de seniority (Webhooks, GraphQL, LangChain).
   - Genera dos preguntas comportamental.
   - Al finalizar el mensaje pregunta si el entrevistado quiere recibir las respuestas a las preguntas y la explicacion a los conceptos requeridos. Usa analogias simples, lenguaje tecnico pero claro y resalta cosas importantes a tener en cuenta a la hora de responder.

B. Si el usuario es ENTREVISTADOR:
   - Proporciona preguntas de "Detección de Humo" (para validar experiencia real).
   - Define "Key Indicators": qué palabras clave o conceptos debe mencionar el candidato para demostrar dominio.
   - Sugiere una contra-pregunta para profundizar en el razonamiento del candidato.
   - Sugiere 3 preguntas punzantes para evaluar seniority (Junior/Mid/Senior).
   - Explica qué debería responder un buen candidato para cada pregunta.


RESTRICCIONES FORMALES:
- Extensión: Máximo 250 palabras.
- Formato: Usa EXCLUSIVAMENTE etiquetas HTML básicas: <b>negrita</b> e <i>itálica</i>.
- No uses asteriscos (*) ni guiones bajos (_).
- Usa emojis acordes a la situacion para mejorar la legibilidad visual.
- Asegúrate de cerrar siempre las etiquetas HTML (ej: <b>texto</b>).
- Tono: Profesional, analítico y directo.`;

// Función auxiliar para inicializar sesión con JD
const initializeSession = (from, jobDescription) => {
  sessions[from] = [{ role: "system", content: AGENT_CONTEXT }];
  if (jobDescription) {
    sessions[from].push({ 
      role: "system", 
      content: `DESCRIPCIÓN DEL PUESTO ACTUAL:\n${jobDescription}\n\nAdapta tus evaluaciones a este perfil de forma prioritaria.` 
    });
  }
};

// Endpoint principal (API)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userId, jobDescription } = req.body;
    const from = userId || 'default_user';

    // logica de reset
    if (message && message.toLowerCase() === 'reset') {
      delete sessions[from];
      return res.json({ response: "🔄 Memoria reiniciada. ¿Cómo te puedo ayudar hoy? ¿Querés practicar o relajarte?" });
    }
    // si no hay sesión previa, inicializar con contexto y posible JD
    if (!sessions[from]) {
      sessions[from] = [{ role: "system", content: AGENT_CONTEXT }];
    }

    // Si llega un JD en CUALQUIER momento, lo inyectamos
    if (jobDescription && jobDescription.trim() !== "") {
      // Buscamos si ya inyectamos un JD antes para no duplicar
      const jdIndex = sessions[from].findIndex(m => m.content.includes("DESCRIPCIÓN DEL PUESTO ACTUAL"));
      
      const jdMessage = { 
        role: "system", 
        content: `DESCRIPCIÓN DEL PUESTO ACTUAL:\n${jobDescription}\n\nPor favor, a partir de ahora adapta todas tus evaluaciones a este perfil.` 
      };

      if (jdIndex !== -1) {
        // Si ya existía uno, lo actualizamos (el usuario mandó uno nuevo)
        sessions[from][jdIndex] = jdMessage;
      } else {
        // Si no existía, lo insertamos justo después del AGENT_CONTEXT
        sessions[from].splice(1, 0, jdMessage);
      }
    }
    
    sessions[from].push({ role: "user", content: message });

    if (sessions[from].length > 10) {
      sessions[from].splice(sessions[from][1].content.includes("DESCRIPCIÓN") ? 2 : 1, 2);
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: sessions[from],
      temperature: 0.7,
      max_tokens: 500 
    });

    const aiResponse = completion.choices[0].message.content;
    sessions[from].push({ role: "assistant", content: aiResponse });

    res.json({ response: aiResponse });

  } catch (error) {
    console.error('[API Error]:', error.message);
    res.json({ response: "⚠️ Hubo un error procesando tu solicitud en /api/chat." });
  }
});

// Webhook para n8n
app.post('/webhook/message', async (req, res) => {
  try {
    const { message, from, jobDescription } = req.body;

    // Lógica de Reset
    if (message && message.toLowerCase() === 'reset') {
      delete sessions[from];
      return res.json({ 
        success: true, 
        response: "🔄 Memoria reiniciada. ¿Cómo te puedo ayudar hoy? ¿Querés practicar o relajarte?",
        to: from 
      });
    }
    
    if (!sessions[from]) {
      initializeSession(from, jobDescription);
    }

    sessions[from].push({ role: "user", content: message });

    if (sessions[from].length > 10) {
      sessions[from].splice(sessions[from][1].content.includes("DESCRIPCIÓN") ? 2 : 1, 2);
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: sessions[from],
      temperature: 0.7,
      max_tokens: 300
    });

    const aiResponse = completion.choices[0].message.content;
    sessions[from].push({ role: "assistant", content: aiResponse });

    res.json({
      success: true,
      response: aiResponse,
      to: from
    });
    
  } catch (error) {
    console.error('[WEBHOOK Error]:', error.message);
    res.json({ 
      success: false, 
      response: "⚠️ Ups, tuve un pequeño problema técnico. ¿Podés intentar de nuevo?",
      to: from 
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'AI Interview Bot' });
});

// Endpoint para simular pregunta
app.get('/api/random-question', (req, res) => {
  const questions = [
    "Explica qué es un webhook y cuándo lo usarías",
    "Diferencia entre REST y GraphQL",
    "¿Cómo implementarías rate limiting en Express?",
    "Explica el patrón ReAct en agentes de IA"
  ];
  const random = questions[Math.floor(Math.random() * questions.length)];
  res.json({ question: random });
});

// Monitor de sesiones (Punto 3)
setInterval(() => {
  const activeSessions = Object.keys(sessions).length;
  console.log(`📊 Sesiones activas en memoria: ${activeSessions}`);
}, 600000); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});