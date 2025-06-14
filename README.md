# My-App

Eine einfache Vokabeltrainer-Webseite mit ChatGPT-Unterstützung.

## Verwendung

1. Öffne `index.html` in einem Browser oder hoste das Projekt auf GitHub Pages oder Netlify.
2. Klicke auf "🧠 Frage zur Grammatik", um den Chat zu öffnen.
3. Beim ersten Start auf GitHub Pages wirst du nach einem OpenAI API Key gefragt. Dieser wird lokal im Browser gespeichert (localStorage).
4. Beim Hosting auf Netlify wird stattdessen die Function `/.netlify/functions/chatgpt` verwendet. Hinterlege dort den Umgebungswert `OPENAI_API_KEY`.

## Entwickeln

Zum Testen der Serverless-Funktion kannst du sie direkt aufrufen:

```bash
node -e "require('./netlify/functions/chatgpt.js')"
node - <<'EOJS'
const handler = require('./netlify/functions/chatgpt.js').handler;
handler({body: JSON.stringify({messages:[{role:'user', content:'Hallo'}]})}).then(r=>console.log(r.statusCode)).catch(err=>console.error(err));
EOJS
```
