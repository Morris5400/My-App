# Sprachlern-Webseite

Dies ist eine kleine Demoanwendung zum Lernen von Vokabeln. Die Seite enthält einen Flashcard-Trainer und einen kleinen Chatbot, der über Netlify Functions die OpenAI API nutzt.

## Struktur
- **index.html**: Startseite mit dem Vokabeltrainer.
- **about.html**: Beispielseite für weitere Inhalte.
- **style.css**: Einfaches Styling und Navigation.
- **netlify/functions/chatgpt.js**: Serverless Function für ChatGPT.

Zum Ausführen kann die Seite lokal in einem beliebigen Webserver geöffnet werden. Für den Chatbot wird eine gültige `OPENAI_API_KEY` Umgebungsvariable benötigt.
