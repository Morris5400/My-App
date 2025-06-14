let current = 0;
let showingDeutsch = true;
let shuffledVokabeln = [];

function shuffle(array) {
  // Fisher–Yates–Shuffle
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function updateCard() {
  const card = document.getElementById("card-text");
  const currentWord = shuffledVokabeln[current];
  card.textContent = showingDeutsch ? currentWord.deutsch : currentWord.ungarisch;
}

function flipCard() {
  showingDeutsch = !showingDeutsch;
  updateCard();
}

function nextCard() {
  current = (current + 1) % shuffledVokabeln.length;
  showingDeutsch = true;
  updateCard();
}

function prevCard() {
  current = (current - 1 + shuffledVokabeln.length) % shuffledVokabeln.length;
  showingDeutsch = true;
  updateCard();
}

window.onload = () => {
  shuffledVokabeln = shuffle([...vokabeln]); // Kopie des Arrays + Shuffle
  updateCard();

  const cardElement = document.getElementById("flashcard");
  cardElement.addEventListener("click", flipCard);

  document.querySelector(".controls button:nth-child(1)").addEventListener("click", prevCard);
  document.querySelector(".controls button:nth-child(2)").addEventListener("click", nextCard);
};
// 🧠 GPT-Bot mit Gesprächsgedächtnis
let messageHistory = [];

// Auf GitHub Pages gibt es keine Netlify Functions. Dann rufen wir
// die OpenAI-API direkt aus dem Browser auf und verlangen einen
// persönlichen API-Key vom Nutzer (wird in localStorage gespeichert).
const useDirectApi = location.hostname.endsWith('github.io');
let openaiKey = localStorage.getItem('openai_key') || '';

async function callOpenAi(messages) {
  if (!openaiKey) {
    openaiKey = prompt('OpenAI API Key eingeben:') || '';
    if (openaiKey) localStorage.setItem('openai_key', openaiKey);
    else throw new Error('Kein API-Key angegeben');
  }

  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'Du bist ein hilfsbereiter Deutschlehrer. Antworte verständlich, präzise und grammatikbezogen.'
        },
        ...messages
      ],
      max_tokens: 200
    })
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`OpenAI API error ${resp.status}: ${text}`);
  }

  const data = await resp.json();
  return (
    data?.choices?.[0]?.message?.content ||
    'Entschuldigung, ich konnte leider keine Antwort generieren.'
  );
}

async function fetchAnswer(messages) {
  if (useDirectApi) {
    return callOpenAi(messages);
  }

  try {
    const resp = await fetch('/.netlify/functions/chatgpt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages })
    });

    const text = await resp.text();
    let data = {};
    try { data = JSON.parse(text); } catch {}

    if (resp.ok) {
      return data.answer;
    }

    const errMsg = data.error || `Server returned ${resp.status}`;
    if (errMsg.includes('OPENAI_API_KEY')) {
      // Netlify-Funktion hat keinen API-Key – direkt im Browser versuchen
      return callOpenAi(messages);
    }
    throw new Error(errMsg);
  } catch (err) {
    // Netzwerkausfall oder ungültige Antwort – Fallback auf direkte API
    return callOpenAi(messages);
  }
}

document.getElementById("chat-toggle").onclick = () => {
  const chat = document.getElementById("chat-window");
  chat.style.display = chat.style.display === "none" ? "block" : "none";
};

// Absenden mit Enter-Taste
document.getElementById("chat-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendMessage();
    e.preventDefault();
  }
});

async function sendMessage() {
  const input = document.getElementById('chat-input');
  const log = document.getElementById('chat-log');
  const question = input.value;
  if (!question) return;

  // Zeige Nutzereingabe
  log.innerHTML += `<div><b>Du:</b> ${question}</div>`;
  input.value = '…';

  // Frage an Verlauf anhängen
  messageHistory.push({ role: 'user', content: question });

  try {
    const answer = await fetchAnswer(messageHistory);
    log.innerHTML += `<div><b>Bot:</b> ${answer}</div>`;
    messageHistory.push({ role: 'assistant', content: answer });
  } catch (error) {
    log.innerHTML += `<div><b>Fehler:</b> ${error.message}</div>`;
  }

  input.value = '';
  log.scrollTop = log.scrollHeight;
}
