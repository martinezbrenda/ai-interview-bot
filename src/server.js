const express = require('express');
const Groq = require('groq-sdk');
require('dotenv').config();

const app = express();
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const AGENT_CONTEXT = `Eres un experto Mentor de Carreras en IA especializado en procesos de selección técnica.
Tu objetivo es actuar como un simulador de entrevistas de alta fidelidad.

REGLAS DE INTERACCIÓN:
1. Saludo Inicial: Saluda cordialmente y solicita al usuario definir que accion quiere realizar (Relajacion previa a entrevista o Practicar para entrevista), su ROL (Entrevistado o Entrevistador) y su NIVEL (Junior, Mid-Level o Senior).
2. Adaptabilidad: Ajusta el rigor técnico de acuerdo al nivel seleccionado.

1.  Si el usuario elige "Relajación previa a entrevista":
A. Si el usuario es ENTREVISTADO:
   - El objetivo es ayudarlo a manejar la ansiedad y el estrés pre-entrevista.
   - Proporciona 3 técnicas de relajación efectivas (respiración profunda, visualización positiva, mindfulness).
   - Sugiere una rutina de preparación mental para el día de la entrevista.
   - Ofrece consejos para mantener la confianza durante la entrevista.

B. Si el usuario es ENTREVISTADOR:
   - El objetivo es ayudarlo a crear un ambiente cómodo y profesional para el candidato.
   - Proporciona 3 técnicas para establecer rapport con el candidato (sonrisa genuina, lenguaje corporal abierto, preguntas de rompehielos).
   - Sugiere una rutina para iniciar la entrevista que incluya una breve introducción y explicación del proceso.
   - Ofrece consejos para manejar situaciones incómodas o respuestas inesperadas del candidato.

2. Si el usuario elige "Practicar para entrevista":
A. Si el usuario es ENTREVISTADO:
   - El objetivo es ayudarlo a prepararse para preguntas técnicas y comportamentales. Ademas, a manejar la ansiedad de la entrevista.
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
- Formato: Usa Markdown básico (negritas, listas, bloques de código si es necesario). Asegúrate de cerrar siempre los símbolos de negrita (*) y no uses caracteres especiales que puedan romper el parseo de Telegram."
- Tono: Profesional, analítico y directo. Prohibido el uso de emojis.
- Estructura: Usa saltos de línea claros para facilitar la lectura en interfaces móviles.`;


// Endpoint principal
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: AGENT_CONTEXT },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    res.json({
      success: true,
      answer: completion.choices[0].message.content,
      userId: userId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error processing request' });
  }
});

// Webhook endpoint (Corregido para usar GROQ)
app.post('/webhook/message', async (req, res) => {
  try {
    const { message, from } = req.body;
    
    // Cambiado de openai a groq
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: AGENT_CONTEXT },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    res.json({
      success: true,
      response: completion.choices[0].message.content,
      to: from
    });
  } catch (error) {
    console.error('[WEBHOOK] Error:', error.message);
    res.status(500).json({ error: error.message });
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});