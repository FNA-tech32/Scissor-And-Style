# Scissor&Style

A premium hair salon website with AI-powered voice booking and text chat. Customers can browse services, see the gallery, and book appointments by talking to Nina, the salon assistant.

## Features

- **AI voice booking** — Talk to Nina to check real-time availability and book an appointment (Retell AI)
- **AI text chat** — Ask about services, pricing, hours, and hair care (Google Gemini)
- **Services menu** — Haircuts, coloring, treatments, and styling with listed prices
- **Gallery** — Image grid of salon work
- **Responsive layout** — Desktop, tablet, and mobile
- **Google Calendar** — Appointments are booked through n8n workflows into Google Calendar

## Contact

- **Address:** 214 Maple Street, Portland, OR 97205
- **Phone:** (503) 555-0192
- **Email:** book@scissorandstyle.com
- **Hours:** Tuesday–Sunday, 9:00 AM – 6:00 PM (closed Mondays)

## Tech stack

- **Frontend:** HTML, CSS, JavaScript
- **Local server:** Node.js and Express
- **Voice AI:** Retell AI WebClient SDK
- **Text chat:** Google Gemini
- **Automation:** n8n (availability and booking)
- **Calendar:** Google Calendar API (via n8n)
- **Deployment:** Vercel serverless functions in `api/`
- **Fonts:** Inter and Playfair Display

## Architecture

```
User clicks "Book by Voice"
  → Frontend POST /api/create-web-call
    → Server calls Retell API and returns an access token
  → Frontend starts a WebRTC voice session with the Retell SDK
    → Retell agent calls an n8n webhook to check Google Calendar
    → Retell agent calls an n8n webhook to book the appointment
  → Appointment is confirmed in Google Calendar

User types in chat
  → Frontend POST /api/chat
    → Server calls Gemini with Scissor&Style context
  → Nina replies with services, pricing, hours, or hair care tips
```

Text chat cannot book appointments. Booking goes through the voice assistant.

## Getting started

### Prerequisites

- Node.js 18+
- A Retell AI account with a configured agent
- A Google Gemini API key
- An n8n instance with availability and booking workflows (used by the Retell agent)

### Installation

```bash
npm install
```

### Environment variables

Create a `.env` file in the project root:

```env
RETELL_API_KEY=your_retell_api_key
RETELL_AGENT_ID=your_retell_agent_id
GEMINI_API_KEY=your_gemini_api_key
```

`.env` is gitignored. Do not commit API keys.

### Run locally

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000).

The Express server in `server.js` serves the site and the `/api/create-web-call` and `/api/chat` routes. On Vercel, the same routes are handled by the functions in `api/`.

### Deploy to Vercel

```bash
vercel --prod
```

Set `RETELL_API_KEY`, `RETELL_AGENT_ID`, and `GEMINI_API_KEY` in the Vercel project environment.

## Project structure

```
├── index.html              # Single-page salon site
├── main.js                 # Voice booking, chat widget, services
├── styles.css              # Salon theme
├── server.js               # Express server for local development
├── vercel.json             # Vercel config
├── package.json
├── api/
│   ├── create-web-call.js  # Retell web call
│   └── chat.js             # Gemini text chat
└── README.md
```

## License

MIT
