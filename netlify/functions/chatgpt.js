exports.handler = async function (event) {
  try {
    const { messages } = JSON.parse(event.body);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Du bist ein hilfsbereiter Deutschlehrer. Antworte verständlich, präzise und grammatikbezogen.",
          },
          ...messages,
        ],
        max_tokens: 200,
      }),
    });

    const data = await response.json();

    const answer =
      data &&
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content
        ? data.choices[0].message.content
        : "Entschuldigung, ich konnte leider keine Antwort generieren.";

    return {
      statusCode: 200,
      body: JSON.stringify({ answer }),
    };
  } catch (err) {
    console.error("GPT‑Function‑Error:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message, stack: err.stack }),
    };
  }
};
