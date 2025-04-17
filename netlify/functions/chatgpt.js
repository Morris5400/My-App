export async function handler(event) {
  try {
    const { messages } = JSON.parse(event.body); // 🧠 Mehrere Nachrichten erlaubt

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages, // 👈 übergebe den kompletten Verlauf
        max_tokens: 200
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ answer: data.choices[0].message.content })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
