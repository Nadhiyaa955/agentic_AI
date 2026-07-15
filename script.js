/**
 * SkinCareGPT - Luxury SaaS Skincare Chatbot Assistant
 * Conversational parsing, domain-scope filters, and UI/theme state bindings
 */

// ==========================================
// 1. SKINCARE KEYWORD DICTIONARY & CONCISE ANSWERS
// ==========================================
const skincareResponses = {
  acne: [
    "Use a gentle salicylic acid cleanser, oil-free moisturizer, and SPF 30 sunscreen daily.",
    "Avoid popping breakouts to prevent deep scarring and wash your face twice a day to clear excess sebum.",
    "For active pustules, apply a thin layer of 2.5% benzoyl peroxide as a targeted spot treatment at night."
  ].join(" "),

  dry: [
    "Use a hydrating cleanser, ceramide moisturizer, and drink adequate water daily.",
    "Avoid hot water when washing your face as it strips natural lipids, and apply moisturizers while skin is damp.",
    "Consider adding a gentle lactic acid (AHA) toner twice a week to clear dry surface flakes safely."
  ].join(" "),

  oily: [
    "Choose lightweight non-comedogenic products and use a gel-based moisturizer daily.",
    "Wash your face twice a day with a foaming gel cleanser containing salicylic acid or niacinamide.",
    "Avoid heavy oil-based creams and look for terms like 'sebum-regulating' or 'matte-finish' on labels."
  ].join(" "),

  sensitive: [
    "Avoid harsh ingredients, drying alcohols, and artificial fragrances to prevent barrier irritation.",
    "Always perform a patch test on your inner arm for 24 hours before using any new skincare products.",
    "Incorporate soothing, barrier-repair ingredients like Centella Asiatica (Cica), Panthenol, and Allantoin."
  ].join(" "),

  combination: [
    "Balance your skin by applying a mild foaming cleanser that cleans sebum without drying.",
    "Use a lightweight gel moisturizer on your oily T-zone (forehead, nose, chin) to reduce shine.",
    "Layer a slightly richer, nourishing cream on dry cheek zones (U-zone) to maintain deep hydration."
  ].join(" "),

  pigmentation: [
    "Consider Vitamin C serum, Niacinamide, and daily sunscreen protection to fade dark marks.",
    "Incorporate gentle chemical exfoliants like Glycolic or Lactic acid at night to speed up cell turnover.",
    "Apply tyrosinase inhibitors like Alpha Arbutin or Tranexamic acid to block excess melanin production."
  ].join(" "),

  tanning: [
    "Apply pure Aloe Vera gel and Licorice root extract cool compresses to soothe UV-induced redness.",
    "Wear SPF 50 broad-spectrum sunscreen daily and avoid direct sun exposure during active recovery.",
    "Use gentle Niacinamide lotions at night to safely restore your natural skin tone over time."
  ].join(" "),

  sunscreen: [
    "Apply broad-spectrum sunscreen (SPF 30 or higher) every morning as the final step of your routine.",
    "Reapply every 2 hours when outdoors to prevent UV sunspots, premature fine lines, and cellular damage.",
    "Use a chemical SPF fluid for no white cast, or a physical Zinc Oxide SPF if your skin is sensitive."
  ].join(" "),

  moisturizers: [
    "Moisturizers seal in vital hydration and protect your skin's natural moisture barrier from irritants.",
    "Use rich creams containing Ceramides for dry skin, and light oil-free gel lotions for oily or acne-prone skin.",
    "Apply moisturizer both morning and night after cleansing to lock in active water levels."
  ].join(" "),

  facewash: [
    "Wash your face twice a day with a gentle, sulfate-free cleanser to keep pores clear without tightness.",
    "Choose foaming gels for oily or combination skin, and creamy, non-foaming milks for dry or sensitive skin.",
    "Avoid harsh scrub particles, as they cause micro-tears in the epidermal barrier."
  ].join(" "),

  routines: [
    "A basic skincare routine consists of three core steps: Cleansing, Moisturizing, and Sunscreen Protection.",
    "AM: Cleanse, apply hydrating moisturizer, and finish with a broad-spectrum SPF 30+ sunscreen.",
    "PM: Double-cleanse to remove dirt/makeup, apply targeted serums, and seal with a barrier cream."
  ].join(" "),

  hydration: [
    "Keep skin plump by drinking 8+ glasses of water daily and applying Hyaluronic Acid on damp skin.",
    "Use a humidifier in dry indoor environments and lock in serum hydration with a quality emollient.",
    "Focus on humectants like Glycerin and Panthenol in your serums to draw moisture deep into skin cells."
  ].join(" "),

  habits: [
    "Build healthy skin habits by sleeping 7-8 hours nightly to facilitate natural cellular rejuvenation.",
    "Wash your pillowcases weekly to prevent bacteria transfer, and eat foods rich in antioxidants.",
    "Avoid touching your face throughout the day to reduce bacterial contact and unexpected breakouts."
  ].join(" ")
};

// Synonym maps to categorize and route to target guidelines
const keywordMap = {
  "acne": "acne", "pimple": "acne", "pimples": "acne", "breakout": "acne", "breakouts": "acne", "zits": "acne", "zit": "acne",
  "dry": "dry", "dryness": "dry", "flaky": "dry", "flake": "dry", "tight skin": "dry",
  "oily": "oily", "oil": "oily", "sebum": "oily", "greasy": "oily", "shine": "oily",
  "sensitive": "sensitive", "redness": "sensitive", "irritated": "sensitive", "burn": "sensitive", "sting": "sensitive", "reactive": "sensitive",
  "combination": "combination", "tzone": "combination", "t-zone": "combination",
  "pigmentation": "pigmentation", "dark spots": "pigmentation", "dark spot": "pigmentation", "spots": "pigmentation", "melasma": "pigmentation", "blemishes": "pigmentation", "hyperpigmentation": "pigmentation", "scars": "pigmentation",
  "tan": "tanning", "tanned": "tanning", "tanning": "tanning", "sunburn": "tanning", "sun damage": "tanning", "photodamage": "tanning",
  "sunscreen": "sunscreen", "spf": "sunscreen", "sunblock": "sunscreen", "sun protection": "sunscreen", "uv": "sunscreen",
  "moisturizer": "moisturizers", "moisturizers": "moisturizers", "moisturize": "moisturizers", "cream": "moisturizers", "lotion": "moisturizers", "barrier": "moisturizers",
  "facewash": "facewash", "cleanser": "facewash", "cleansers": "facewash", "face wash": "facewash", "wash face": "facewash",
  "routine": "routines", "routines": "routines", "regimen": "routines", "steps": "routines", "morning routine": "routines", "night routine": "routines",
  "hydration": "hydration", "hydrate": "hydration", "dehydrated": "hydration", "water": "hydration",
  "habits": "habits", "habit": "habits", "sleep": "habits", "diet": "habits", "pillowcase": "habits", "lifestyle": "habits"
};

// Fallback response for obscure skincare questions
const skincareFallback = [
  "For optimal skin health, keep your daily routine simple: cleanse gently, moisturize to protect your barrier, and always apply SPF in the morning.",
  "Let me know if you would like practical recommendations targeting Acne, Dry Skin, Oily skin, Sensitive skin, Pigmentation, or Sun Protection!"
].join(" ");

// Array of allowed terms to protect domain scope
const skincareScopeWords = [
  "skin", "skincare", "acne", "pimple", "pimples", "breakout", "breakouts", "zit", "zits",
  "dry", "dryness", "flaky", "flake", "tightness", "oily", "oil", "sebum", "greasy",
  "sensitive", "redness", "irritated", "irritation", "burn", "sting", "reactive",
  "combination", "tzone", "t-zone", "pigmentation", "dark spot", "dark spots", "spot", "spots",
  "melasma", "blemish", "blemishes", "hyperpigmentation", "scar", "scars", "tan", "tanned",
  "tanning", "sunburn", "photodamage", "sunscreen", "spf", "sunblock", "uv", "moisturizer",
  "moisturizers", "moisturize", "cream", "lotion", "barrier", "facewash", "cleanser",
  "cleansers", "face wash", "routine", "routines", "regimen", "hydration", "hydrate",
  "dehydrated", "water", "habit", "habits", "sleep", "diet", "pillowcase", "wrinkle",
  "wrinkles", "aging", "pore", "pores", "exfoliant", "exfoliate", "exfoliation", "serum",
  "serums", "toner", "toners", "active", "actives", "retinol", "niacinamide", "salicylic",
  "glycolic", "hyaluronic", "vitamin c", "arbutin", "cica", "ceramide", "ceramides", "clay"
];

// ==========================================
// 2. MOCK HISTORY LOG PRESENTS BINDINGS
// ==========================================
const mockChatHistory = {
  "am-routine": [
    { sender: "user", text: "Hey SkinCareGPT! What is a quick, basic morning skincare routine to get a glowing look?" },
    { sender: "bot", text: "To achieve a healthy morning glow, follow these three steps: 1. Wash with a gentle hydrating cleanser. 2. Apply a 10% Vitamin C serum combined with Vitamin E to brighten skin and act as an antioxidant shield. 3. Layer a lightweight ceramide moisturizer and lock it in with a broad-spectrum SPF 30+ sunscreen daily." }
  ],
  "dry-rescue": [
    { sender: "user", text: "My skin is extremely dry, flaking, and feels tight after cleansing. How do I rescue it?" },
    { sender: "bot", text: "To rescue dry, tight skin and restore your moisture barrier, adopt this practical plan: 1. Switch to a non-foaming, creamy milk cleanser. 2. Apply Hyaluronic Acid serum onto damp skin to lock in active water layers. 3. Seal with a rich, nourishing moisturizer containing Squalane and Ceramides. Avoid hot showers and harsh exfoliating scrubs." }
  ],
  "acne-cycle": [
    { sender: "user", text: "I have active breakouts and clogged pores on my chin. How can I clear them?" },
    { sender: "bot", text: "To clear chin acne and reduce pore congestion safely: 1. Wash your face twice daily with a gentle Salicylic Acid (BHA) cleanser to unclog follicles. 2. Apply 2% Benzoyl Peroxide directly as a targeted spot treatment on active breakouts to neutralize bacteria. 3. Use an oil-free, gel-based moisturizer and daily non-comedogenic SPF 30 sunscreen." }
  ],
  "sensitive-calm": [
    { sender: "user", text: "My skin gets red and stings whenever I apply new skincare products. How do I calm it?" },
    { sender: "bot", text: "For reactive, easily irritated skin, focus on calming your skin barrier: 1. Avoid all essential oils, high-strength chemical exfoliants, and synthetic fragrances. 2. Wash with an ultra-gentle, pH-balanced cleansing lotion. 3. Use a soothing cream rich in Centella Asiatica (Cica), Panthenol (Pro-Vitamin B5), and Allantoin. Perform a 24-hour patch test before trying any new formula." }
  ]
};

// ==========================================
// 3. CORE PARSING ENGINE
// ==========================================
function processQuery(input) {
  const cleanInput = input.toLowerCase().trim();

  // Validate Scope
  const isSkincare = skincareScopeWords.some(word => cleanInput.includes(word));
  if (!isSkincare) {
    // Return exact mandated string required by design specs
    return "I am SkinCareGPT and can only assist with skincare-related topics.";
  }

  // Find targeted category match
  let matchedCategory = null;
  for (const trigger in keywordMap) {
    if (cleanInput.includes(trigger)) {
      matchedCategory = keywordMap[trigger];
      break;
    }
  }

  if (matchedCategory && skincareResponses[matchedCategory]) {
    return skincareResponses[matchedCategory];
  }

  return skincareFallback;
}

// ==========================================
// 4. UI STATE MANAGER
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chat-form");
  const chatField = document.getElementById("chat-field");
  const chatMessages = document.getElementById("chat-messages");
  const chatViewport = document.getElementById("chat-viewport");
  const welcomeHub = document.getElementById("welcome-hub");

  // State Triggers
  const btnNewChat = document.getElementById("btn-new-chat");
  const btnClearHistory = document.getElementById("btn-clear-history");
  const btnClearMobile = document.getElementById("btn-clear-mobile");
  const themeToggle = document.getElementById("theme-toggle");
  const historyCards = document.querySelectorAll(".history-card");

  // Theme Controller (localStorage preservation)
  const currentTheme = localStorage.getItem("skin-care-sass-theme") || "light";
  document.documentElement.setAttribute("data-theme", currentTheme);

  themeToggle.addEventListener("click", () => {
    const activeTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = activeTheme === "dark" ? "light" : "dark";
    
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("skin-care-sass-theme", newTheme);
  });

  // Dynamic Scroll Anchor
  function scrollToBottom() {
    chatViewport.scrollTop = chatViewport.scrollHeight;
  }

  // Fade out welcome card when conversation begins
  function hideWelcomeHub() {
    if (welcomeHub && welcomeHub.style.display !== "none") {
      welcomeHub.style.transition = "opacity 0.4s ease, transform 0.4s ease";
      welcomeHub.style.opacity = "0";
      welcomeHub.style.transform = "translateY(-15px)";
      
      setTimeout(() => {
        welcomeHub.style.display = "none";
      }, 400);
    }
  }

  // Restore welcome card when cache is cleared
  function showWelcomeHub() {
    if (welcomeHub && welcomeHub.style.display === "none") {
      welcomeHub.style.display = "block";
      setTimeout(() => {
        welcomeHub.style.opacity = "1";
        welcomeHub.style.transform = "translateY(0)";
      }, 50);
    }
  }

  // Create message bubble
  function renderMessage(sender, text) {
    const isBot = sender === "bot";
    
    const card = document.createElement("div");
    card.className = `message-card ${isBot ? 'bot' : 'user'}`;

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = text;

    card.appendChild(bubble);
    chatMessages.appendChild(card);
    scrollToBottom();
  }

  // Typing loading animation bubble
  let typingBubble = null;

  function showLoader() {
    if (typingBubble) return;

    typingBubble = document.createElement("div");
    typingBubble.className = "message-card bot";

    const bubble = document.createElement("div");
    bubble.className = "bubble";

    const indicator = document.createElement("div");
    indicator.className = "typing-pulse-wrapper";
    indicator.innerHTML = `
      <span class="typing-pulse-dot"></span>
      <span class="typing-pulse-dot"></span>
      <span class="typing-pulse-dot"></span>
    `;

    bubble.appendChild(indicator);
    typingBubble.appendChild(bubble);
    chatMessages.appendChild(typingBubble);
    scrollToBottom();
  }

  function removeLoader() {
    if (typingBubble) {
      typingBubble.remove();
      typingBubble = null;
    }
  }

  // Conversational Processing Pipeline
  function transmitQuery(queryText) {
    if (!queryText || queryText.trim() === "") return;

    // Fade out splash if open
    hideWelcomeHub();

    // Render User message
    renderMessage("user", queryText);
    chatField.value = "";

    // Lock inputs while generating
    chatField.disabled = true;
    const sendBtn = document.getElementById("btn-send");
    if (sendBtn) sendBtn.disabled = true;

    // Show loading pulse
    showLoader();

    // Latency simulation (600ms - 1000ms)
    setTimeout(() => {
      removeLoader();

      // Resolve query
      const reply = processQuery(queryText);

      // Render Bot reply
      renderMessage("bot", reply);

      // Release inputs
      chatField.disabled = false;
      if (sendBtn) sendBtn.disabled = false;
      chatField.focus();
    }, 700 + Math.random() * 300);
  }

  // Trigger send on click
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    transmitQuery(chatField.value);
  });

  // Enter key trigger
  chatField.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      transmitQuery(chatField.value);
    }
  });

  // Reset viewport state (Clear conversation cache)
  function clearViewport() {
    // Remove all message-card elements, leaving only the welcome hub
    const messageCards = chatMessages.querySelectorAll(".message-card");
    messageCards.forEach(card => card.remove());
    
    // Restore welcome panel
    showWelcomeHub();
    chatField.value = "";
    chatField.disabled = false;
    const sendBtn = document.getElementById("btn-send");
    if (sendBtn) sendBtn.disabled = false;
    chatField.focus();
  }

  // Bind clear chat triggers
  btnNewChat.addEventListener("click", clearViewport);
  btnClearHistory.addEventListener("click", clearViewport);
  btnClearMobile.addEventListener("click", clearViewport);

  // Sidebar History Cards Click Event Handler
  historyCards.forEach(card => {
    card.addEventListener("click", () => {
      const historyId = card.getAttribute("data-history-id");
      if (mockChatHistory[historyId]) {
        // Clear viewport first
        const currentCards = chatMessages.querySelectorAll(".message-card");
        currentCards.forEach(c => c.remove());
        
        hideWelcomeHub();

        // Load presets with a tiny delay for high-end staggered load visual
        mockChatHistory[historyId].forEach((msg, idx) => {
          setTimeout(() => {
            renderMessage(msg.sender, msg.text);
          }, idx * 150);
        });
      }
    });
  });

  // Focus search box on launch
  chatField.focus();
});
