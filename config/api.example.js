const API_CONFIG = {
    // Gemini API Configuration
    KEY: "YOUR_GEMINI_API_KEY",
    // Using gemini-1.5-flash as default for better performance/cost balance, can be changed to gemini-pro
    BASE_URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",

    // Grok API Configuration
    GROK_KEY: "YOUR_GROK_API_KEY",
    GROK_URL: "https://api.x.ai/v1/chat/completions",
    GROK_MODEL: "grok-beta",

    // Claude API Configuration (via OpenRouter)
    CLAUDE_KEY: "YOUR_CLAUDE_API_KEY",
    CLAUDE_URL: "https://openrouter.ai/api/v1/chat/completions",
    CLAUDE_MODEL: "anthropic/claude-3.5-sonnet",
    CLAUDE_VERSION: "2023-06-01", // Keep for reference, though OpenRouter handles this
    
    // Backend Proxy Configuration (Aliyun ECS)
    PROXY_URL: "http://YOUR_SERVER_IP:9100" // ⚠️ Replace with your actual Server IP after deployment
};

module.exports = API_CONFIG;
