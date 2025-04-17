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
