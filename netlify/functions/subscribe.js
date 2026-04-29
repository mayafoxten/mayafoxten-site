// netlify/functions/subscribe.js
// ─────────────────────────────────────────────────────────────
// Handles email capture from Maya Foxten landing page.
// Adds contact to Brevo list and triggers welcome automation.
//
// Environment variables to set in Netlify dashboard:
//   BREVO_API_KEY   — your Brevo API key (Settings > API Keys)
//   BREVO_LIST_ID   — your list ID as a number (e.g. 3)
//
// Netlify > Site settings > Environment variables > Add variable
// ─────────────────────────────────────────────────────────────

exports.handler = async function (event) {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ message: "Method not allowed" }) };
  }

  // Parse body
  let firstName, email;
  try {
    ({ firstName, email } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ message: "Invalid request body" }) };
  }

  // Basic validation
  if (!email || !email.includes("@")) {
    return { statusCode: 400, body: JSON.stringify({ message: "Invalid email address" }) };
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = parseInt(process.env.BREVO_LIST_ID, 10);

  if (!apiKey || !listId) {
    console.error("Missing BREVO_API_KEY or BREVO_LIST_ID environment variables");
    return { statusCode: 500, body: JSON.stringify({ message: "Server configuration error" }) };
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        email: email,
        attributes: {
          FIRSTNAME: firstName || "",
        },
        listIds: [listId],
        updateEnabled: true, // update contact if already exists
      }),
    });

    // 201 = created, 204 = already exists (updated)
    if (response.status === 201 || response.status === 204) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Success" }),
      };
    }

    const errorData = await response.json().catch(() => ({}));
    console.error("Brevo API error:", response.status, errorData);
    return {
      statusCode: response.status,
      body: JSON.stringify({ message: errorData.message || "Brevo API error" }),
    };

  } catch (err) {
    console.error("Network error calling Brevo:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Network error" }),
    };
  }
};
