export async function handler(event) {
  try {
    const { messages } = JSON.parse(event.body);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Du bist ein hilfsbereiter Deutschlehrer. Antworte verständlich, präzise und grammatikbezogen." },
          ...messages
        ],
        max_tokens: 200
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        answer:
          data.choices && data.choices[0] && data.choices[0].message
            ? data.choices[0].message.content
            : "Entschuldigung, ich konnte leider keine Antwort generieren."
      })
    };
  } catch (err) {
    console.error("Fehler bei GPT-Anfrage:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
