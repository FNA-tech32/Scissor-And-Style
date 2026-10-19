import { RetellWebClient } from "https://cdn.jsdelivr.net/npm/retell-client-js-sdk@2.0.7/+esm";

const CREATE_WEB_CALL_URL = "/api/create-web-call";
const CHAT_API_URL = "/api/chat";

// Salon Services
const SERVICES = [
  { category: "Haircut", name: "Women's Cut & Style", description: "Precision cut with wash and blow-dry styling", price: 65, duration: "1 hr", icon: "scissors" },
  { category: "Haircut", name: "Men's Cut", description: "Classic or modern men's haircut with styling", price: 35, duration: "1 hr", icon: "scissors" },
  { category: "Haircut", name: "Kids' Cut", description: "Gentle haircut for children under 12", price: 25, duration: "1 hr", icon: "scissors" },
  { category: "Haircut", name: "Bang Trim", description: "Quick bang or fringe trim between appointments", price: 15, duration: "30 min", icon: "scissors" },
  { category: "Coloring", name: "Full Color", description: "All-over single-process color application", price: 120, duration: "1 hr", icon: "palette" },
  { category: "Coloring", name: "Highlights / Balayage", description: "Hand-painted or foil highlights for dimension", price: 180, duration: "1 hr", icon: "palette" },
  { category: "Coloring", name: "Root Touch-Up", description: "Color refresh for grown-out roots", price: 75, duration: "1 hr", icon: "palette" },
  { category: "Coloring", name: "Color Correction", description: "Complex color fixes — price varies by condition", price: 200, duration: "1 hr+", icon: "palette" },
  { category: "Treatment", name: "Deep Conditioning", description: "Intensive moisture treatment for damaged hair", price: 45, duration: "1 hr", icon: "sparkles" },
  { category: "Treatment", name: "Keratin Smoothing", description: "Professional keratin treatment for frizz-free hair", price: 250, duration: "1 hr", icon: "sparkles" },
  { category: "Treatment", name: "Scalp Treatment", description: "Detoxifying and nourishing scalp therapy", price: 55, duration: "1 hr", icon: "sparkles" },
  { category: "Treatment", name: "Olaplex Treatment", description: "Bond-building repair for chemically treated hair", price: 65, duration: "1 hr", icon: "sparkles" },
  { category: "Styling", name: "Blowout", description: "Professional blow-dry and styling", price: 45, duration: "1 hr", icon: "wind" },
  { category: "Styling", name: "Updo / Special Occasion", description: "Elegant updo styling for events and weddings", price: 85, duration: "1 hr", icon: "wind" },
  { category: "Styling", name: "Braiding", description: "Intricate braiding styles", price: 60, duration: "1 hr", icon: "wind" },
  { category: "Styling", name: "Extensions Consultation", description: "Free consultation for extension options and pricing", price: 0, duration: "30 min", icon: "wind" },
];

// Category icons mapping
const CATEGORY_ICONS = {
  scissors: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`,
  palette: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
  sparkles: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`,
  wind: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>`,
};

// Render services grid
function renderServices() {
  const grid = document.getElementById("services-grid");
  if (!grid) return;
  grid.innerHTML = SERVICES.map(
    (s) => `
    <div class="service-card">
      <div class="service-icon-badge">
        ${CATEGORY_ICONS[s.icon]}
      </div>
      <div class="service-category">${s.category}</div>
      <h3 class="service-name">${s.name}</h3>
      <p class="service-description">${s.description}</p>
      <div class="service-footer">
        <span class="service-price">${s.price === 0 ? "Free" : "$" + s.price}${s.price >= 200 && s.name.includes("Correction") ? "+" : ""}</span>
        <span class="service-duration">${s.duration}</span>
      </div>
    </div>
  `
  ).join("");
}

// Retell Voice Client
const retellClient = new RetellWebClient();
let callActive = false;
let timerInterval = null;
let callSeconds = 0;

function updateTimer() {
  callSeconds++;
  const mins = String(Math.floor(callSeconds / 60)).padStart(2, "0");
  const secs = String(callSeconds % 60).padStart(2, "0");
  const timerEl = document.getElementById("voiceTimer");
  if (timerEl) timerEl.textContent = `${mins}:${secs}`;
}

function showModal() {
  const modal = document.getElementById("voiceModal");
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function hideModal() {
  const modal = document.getElementById("voiceModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

function setStatus(text) {
  const el = document.getElementById("voiceStatus");
  if (el) el.textContent = text;
}

function setRipple(active) {
  ["ripple1", "ripple2", "ripple3"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.animationPlayState = active ? "running" : "paused";
  });
}

async function startVoiceCall() {
  if (callActive) return;

  // Close assistant popup and mobile menu if open
  const popup = document.getElementById("assistantPopup");
  if (popup) popup.classList.remove("active");
  const mobileMenu = document.getElementById("mobileMenu");
  if (mobileMenu) mobileMenu.classList.remove("active");

  showModal();
  setStatus("Connecting...");
  setRipple(false);
  callSeconds = 0;
  const timerEl = document.getElementById("voiceTimer");
  if (timerEl) timerEl.textContent = "00:00";

  try {
    const res = await fetch(CREATE_WEB_CALL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server error ${res.status}`);
    }

    const data = await res.json();

    if (!data.access_token) {
      throw new Error("No access token received");
    }

    await retellClient.startCall({
      accessToken: data.access_token,
    });
  } catch (e) {
    console.error("Voice call error:", e);
    setStatus("Connection failed. Please try again.");
    setTimeout(hideModal, 2500);
  }
}

function endVoiceCall() {
  try {
    retellClient.stopCall();
  } catch (e) {
    console.error("Error stopping call:", e);
    callActive = false;
    setRipple(false);
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
    hideModal();
  }
}

// Retell events
retellClient.on("call_started", () => {
  callActive = true;
  setStatus("Speaking with Nina...");
  setRipple(false);
  callSeconds = 0;
  timerInterval = setInterval(updateTimer, 1000);
});

retellClient.on("call_ended", () => {
  callActive = false;
  setStatus("Call ended");
  setRipple(false);
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
  setTimeout(hideModal, 1500);
});

retellClient.on("agent_start_talking", () => {
  setRipple(true);
});

retellClient.on("agent_stop_talking", () => {
  setRipple(false);
});

retellClient.on("error", (e) => {
  console.error("Retell error:", e);
  callActive = false;
  setStatus("An error occurred. Please try again.");
  setRipple(false);
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
  setTimeout(hideModal, 2500);
});

// Chat functionality
const chatHistory = [];

async function sendMessage(text) {
  const input = document.getElementById("chatInput");
  const message = text || (input && input.value.trim());
  if (!message) return;

  if (input) input.value = "";
  appendMessage("user", message);

  const typingId = showTyping();
  chatHistory.push({ role: "user", content: message });

  try {
    const res = await fetch(CHAT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history: chatHistory }),
    });

    const data = await res.json();
    removeTyping(typingId);

    if (data.reply) {
      appendMessage("nina", data.reply);
      chatHistory.push({ role: "assistant", content: data.reply });
    } else {
      appendMessage("nina", "Sorry, something went wrong. Please try again.");
    }
  } catch (e) {
    removeTyping(typingId);
    appendMessage("nina", "Sorry, I couldn't connect. Please try again.");
  }
}

function appendMessage(sender, text) {
  const container = document.getElementById("chatMessages");
  if (!container) return;

  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.innerHTML = `
    <div class="message-avatar">${sender === "user" ? "Y" : "N"}</div>
    <div class="message-bubble">${text}</div>
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function showTyping() {
  const container = document.getElementById("chatMessages");
  if (!container) return null;
  const id = "typing-" + Date.now();
  const div = document.createElement("div");
  div.className = "message nina";
  div.id = id;
  div.innerHTML = `
    <div class="message-avatar">N</div>
    <div class="message-bubble typing-indicator"><span></span><span></span><span></span></div>
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return id;
}

function removeTyping(id) {
  if (!id) return;
  const el = document.getElementById(id);
  if (el) el.remove();
}

function sendQuickQuestion(question) {
  sendMessage(question);
}

// Assistant popup toggle
document.addEventListener("DOMContentLoaded", () => {
  renderServices();

  // Intersection Observer for scroll animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));

  const fabBtn = document.getElementById("fabBtn");
  const popup = document.getElementById("assistantPopup");
  const closeBtn = document.getElementById("closeAssistant");
  const chatTabBtn = document.getElementById("chatTabBtn");
  const talkTabBtn = document.getElementById("talkTabBtn");
  const chatTab = document.getElementById("chatTab");
  const talkTab = document.getElementById("talkTab");
  const chatFooter = document.getElementById("chatFooter");
  const chatInput = document.getElementById("chatInput");
  const hamburger = document.getElementById("hamburgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (fabBtn) {
    fabBtn.addEventListener("click", () => {
      popup.classList.toggle("active");
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      popup.classList.remove("active");
    });
  }

  // Hamburger menu
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
      hamburger.classList.toggle("active");
    });
  }

  // Close mobile menu on link click
  if (mobileMenu) {
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        hamburger.classList.remove("active");
      });
    });
  }

  // Tab switching
  if (chatTabBtn) {
    chatTabBtn.addEventListener("click", () => {
      chatTabBtn.classList.add("active");
      talkTabBtn.classList.remove("active");
      chatTab.classList.remove("hidden");
      talkTab.classList.add("hidden");
      chatFooter.classList.remove("hidden");
    });
  }

  if (talkTabBtn) {
    talkTabBtn.addEventListener("click", () => {
      talkTabBtn.classList.add("active");
      chatTabBtn.classList.remove("active");
      talkTab.classList.remove("hidden");
      chatTab.classList.add("hidden");
      chatFooter.classList.add("hidden");
    });
  }

  // Enter key for chat
  if (chatInput) {
    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  }

  // Navbar scroll shadow
  window.addEventListener("scroll", () => {
    const nav = document.getElementById("navbar");
    if (nav) {
      nav.classList.toggle("scrolled", window.scrollY > 10);
    }
  });
});

// Expose functions globally
window.startVoiceCall = startVoiceCall;
window.endVoiceCall = endVoiceCall;
window.sendMessage = sendMessage;
window.sendQuickQuestion = sendQuickQuestion;
