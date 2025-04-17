// script.js

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

window.onload = updateCard;
