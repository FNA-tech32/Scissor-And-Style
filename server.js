require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// Create Retell web call
app.post("/api/create-web-call", async (req, res) => {
  try {
    const response = await fetch("https://api.retellai.com/v2/create-web-call", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RETELL_API_KEY}`,
      },
      body: JSON.stringify({
        agent_id: process.env.RETELL_AGENT_ID || "agent_769bb8b9a8054df5d02e7e5d33",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Gemini chat
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const systemInstruction = `You are Nina, a friendly and knowledgeable AI assistant for Scissor&Style, a premium hair salon. You help customers learn about our services, pricing, and answer hair care questions.

SALON INFORMATION:
- Name: Scissor&Style
- Address: 214 Maple Street, Portland, OR 97205
- Phone: (503) 555-0192
- Email: book@scissorandstyle.com
- Hours: Tuesday to Sunday, 9:00 AM - 6:00 PM (closed Mondays)
- Appointments: 1-hour slots

SERVICES MENU:

Haircuts:
- Women's Cut & Style — $65 (Precision cut with wash and blow-dry styling)
- Men's Cut — $35 (Classic or modern men's haircut with styling)
- Kids' Cut — $25 (Gentle haircut for children under 12)
- Bang Trim — $15 (Quick bang/fringe trim between appointments)

Coloring:
- Full Color — $120 (All-over single-process color application)
- Highlights / Balayage — $180 (Hand-painted or foil highlights for dimension)
- Root Touch-Up — $75 (Color refresh for grown-out roots)
- Color Correction — $200+ (Complex color fixes, price varies by condition)

Treatments:
- Deep Conditioning — $45 (Intensive moisture treatment for damaged hair)
- Keratin Smoothing — $250 (Professional keratin treatment for frizz-free hair)
- Scalp Treatment — $55 (Detoxifying and nourishing scalp therapy)
- Olaplex Treatment — $65 (Bond-building repair for chemically treated hair)

Styling:
- Blowout — $45 (Professional blow-dry and styling)
- Updo / Special Occasion — $85 (Elegant updo styling for events and weddings)
- Braiding — $60 (Intricate braiding styles)
- Hair Extensions Consultation — Free (Consultation for extension options and pricing)

GUIDELINES:
- Be warm, professional, and enthusiastic about hair care
- Recommend services based on customer needs
- If a customer wants to book an appointment, direct them to use the voice assistant by clicking the "Book by Voice" button or the phone icon in the chat widget — our AI voice assistant Nina can check real-time availability and book appointments instantly
- You cannot book appointments through text chat — only the voice assistant can do that
- For complex questions about pricing (like color correction), explain that exact pricing depends on hair condition and length
- Share basic hair care tips when relevant
- Keep responses concise but helpful`;

  const contents = [];

  if (history && history.length > 0) {
    for (const msg of history) {
      contents.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      });
    }
  }

  contents.push({
    role: "user",
    parts: [{ text: message }],
  });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response. Please try again.";

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Scissor&Style server running at http://localhost:${PORT}`);
});
