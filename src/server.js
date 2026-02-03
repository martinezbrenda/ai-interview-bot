const express = require('express');
const Groq = require('groq-sdk');
require('dotenv').config();

const app = express();
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const AGENT_CONTEXT = `Eres un asistente de preparación para entrevistas de AI Engineer.
Ayudas con:
1. Preguntas técnicas (Node.js, APIs, AI)
2. Consejos para responder preguntas comportamentales
3. Explicaciones de conceptos (Webhooks, GraphQL, LangChain)

Responde de forma concisa (máx 200 palabras) y práctica.`;

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