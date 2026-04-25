import { GoogleGenerativeAI } from '@google/generative-ai';

// Lazy load GenAI to ensure .env is configured first
let genAI = null;

function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('🔑 Gemini API Key loaded:', apiKey ? `✅ (${apiKey.substring(0, 10)}...)` : '❌ UNDEFINED');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

const SUBJECT_CONTEXTS = {
  mathematics: 'algebra, calculus, statistics, geometry, trigonometry, number theory',
  physics: 'mechanics, electricity, magnetism, waves, optics, thermodynamics, nuclear physics',
  chemistry: 'atomic structure, bonding, reactions, stoichiometry, organic chemistry, electrochemistry',
  biology: 'cells, genetics, evolution, ecology, human physiology, photosynthesis, respiration',
  computer_science: 'algorithms, data structures, programming, networks, databases, AI, web development',
};

const LANGUAGE_INSTRUCTIONS = {
  english: `Respond entirely in clear, formal English. Use academic language appropriate for secondary school students.`,

  swahili: `Jibu kwa Kiswahili safi. Tumia lugha rahisi inayofaa wanafunzi wa shule ya sekondari. 
Unaweza kutumia maneno ya kisayansi kwa Kiingereza kama hakuna tafsiri nzuri ya Kiswahili.`,

  sheng: `Tumia mchanganyiko wa Kiingereza, Kiswahili, na Sheng kama unavyozungumzwa na vijana wa Nairobi. 
Anza kwa Kiingereza au Kiswahili, kisha ingiza Sheng naturally pale inapoathiri.
Mifano ya Sheng unaweza kutumia: "Sawa fam", "Unaelewa?", "Weka hivyo", "Sawa boss", "Si mbaya", "Poa sana", "Cheki hii", "Fanya hivi".
Lakini lazima maelezo ya kisayansi yawe sahihi na yaeleweke vizuri.`,
};

function buildSystemPrompt(subject, languageMode) {
  const subjectTopics = SUBJECT_CONTEXTS[subject] || SUBJECT_CONTEXTS.mathematics;
  const langInstruction = LANGUAGE_INSTRUCTIONS[languageMode] || LANGUAGE_INSTRUCTIONS.sheng;

  return `You are **Elimu AI**, a brilliant and friendly STEM tutor designed specifically for Kenyan secondary school students. 
Your mission is to make complex STEM concepts crystal clear and relatable.

## Your Teaching Style
- Always use **localized Kenyan analogies** to explain abstract concepts. Examples:
  - Use matatus, bodabodas, and traffic to explain speed/velocity/acceleration
  - Use shamba (farm) scenarios for biology and growth concepts  
  - Use M-Pesa transactions for mathematical operations and economics
  - Use sukuma wiki pricing at the market for statistics and percentages
  - Use Nairobi CBD navigation for geometry and coordinates
  - Use KCSE exam scenarios for probability and statistics
  - Use cooking ugali for chemistry reactions (mixing, heat, states of matter)
  - Use football (soccer) for projectile motion and physics
  
- Break down concepts step-by-step
- After each explanation, ask a follow-up question to check understanding
- Celebrate student progress with encouraging words
- If a student is struggling, try a different analogy or approach

## Subject Focus
You specialize in: ${subjectTopics}

## Language Instructions
${langInstruction}

## Response Format
- Use markdown for formatting (headers, bullet points, bold text)
- For math equations, write them clearly using text notation
- Keep responses concise but complete — aim for 150-300 words per explanation
- Always end with either a question to check understanding OR a suggested next topic

## Important Rules
- Never make up facts — if unsure, say so
- Keep scientific accuracy even when using analogies
- Be encouraging and never make students feel stupid
- Tailor complexity to secondary school level (Form 1-4 Kenya)`;
}

export async function streamChat(messages, subject, languageMode) {
  const model = getGenAI().getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: buildSystemPrompt(subject, languageMode),
  });

  // Convert messages to Gemini history format
  const history = messages.slice(0, -1).map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.content }],
  }));

  const lastMessage = messages[messages.length - 1];

  const chat = model.startChat({ history });
  const result = await chat.sendMessageStream(lastMessage.content);
  return result.stream;
}

export async function generateQuiz(topic, subject, languageMode) {
  const model = getGenAI().getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });

  const langNote =
    languageMode === 'swahili'
      ? 'Write questions and answers in Swahili.'
      : languageMode === 'sheng'
        ? 'Write questions in a mix of English and Swahili/Sheng, keep it natural for Kenyan youth.'
        : 'Write questions in English.';

  const prompt = `Generate a 5-question multiple choice quiz about "${topic}" in ${subject} for Kenyan Form 3-4 students.
${langNote}

Return a JSON object with this exact structure:
{
  "topic": "${topic}",
  "questions": [
    {
      "id": 1,
      "question": "...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctAnswer": "A",
      "explanation": "Brief explanation of why this is correct, using a local Kenyan analogy if possible"
    }
  ]
}

Make questions progressively harder. Use practical, real-world Kenyan contexts where possible.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return JSON.parse(text);
}

export async function getSuggestedTopics(subject) {
  const model = getGenAI().getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: { responseMimeType: 'application/json' },
  });

  const prompt = `List 8 key topics for ${subject} in the Kenyan KCSE secondary school curriculum.
Return as JSON: { "topics": ["topic1", "topic2", ...] }`;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}
