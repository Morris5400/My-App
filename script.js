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

document.getElementById("chat-toggle").onclick = () => {
  const chat = document.getElementById("chat-window");
  chat.style.display = chat.style.display === "none" ? "block" : "none";
};

async function sendMessage() {
  const input = document.getElementById("chat-input");
  const log = document.getElementById("chat-log");
  const question = input.value;
  if (!question) return;

  // Zeige Nutzereingabe
  log.innerHTML += `<div><b>Du:</b> ${question}</div>`;
  input.value = "…";

  // Frage an Verlauf anhängen
  messageHistory.push({ role: "user", content: question });

  try {
    const response = await fetch("/.netlify/functions/chatgpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: messageHistory })
    });

    const data = await response.json();

    // Antwort anzeigen und Verlauf aktualisieren
    log.innerHTML += `<div><b>Bot:</b> ${data.answer}</div>`;
    messageHistory.push({ role: "assistant", content: data.answer });

  } catch (error) {
    log.innerHTML += `<div><b>Fehler:</b> GPT konnte nicht antworten.</div>`;
  }

  input.value = "";
  log.scrollTop = log.scrollHeight;
}
