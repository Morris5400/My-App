let current = 0;
let showingDeutsch = true;

function updateCard() {
  const card = document.getElementById("card-text");
  const currentWord = vokabeln[current];
  card.textContent = showingDeutsch ? currentWord.deutsch : currentWord.ungarisch;
}

function flipCard() {
  showingDeutsch = !showingDeutsch;
  updateCard();
}

function nextCard() {
  current = (current + 1) % vokabeln.length;
  showingDeutsch = true;
  updateCard();
}

function prevCard() {
  current = (current - 1 + vokabeln.length) % vokabeln.length;
  showingDeutsch = true;
  updateCard();
}

window.onload = () => {
  updateCard();

  const cardElement = document.getElementById("flashcard");
  cardElement.addEventListener("click", flipCard); // ← Das ist jetzt besser für Handy

  document.querySelector(".controls button:nth-child(1)").addEventListener("click", prevCard);
  document.querySelector(".controls button:nth-child(2)").addEventListener("click", nextCard);
};
