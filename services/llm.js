const apiConfig = require('../config/api.js');

const LLMService = {
    /**
     * Call Gemini API
     * @param {string} prompt - The user prompt
     * @returns {Promise<string>} - The generated text
     */
    callGemini: function(prompt, imageBase64 = null, audioBase64 = null) {
        return new Promise((resolve, reject) => {
            // Use Backend Proxy URL
            const url = `${apiConfig.PROXY_URL}/proxy/claude`;
            
            // Construct OpenAI/OpenRouter compatible message format
            const content = [];
            
            // Add Text
            content.push({ type: "text", text: prompt });

            // Add Image if present
            if (imageBase64) {
                content.push({
                    type: "image_url",
                    image_url: {
                        url: `data:image/jpeg;base64,${imageBase64}`
                    }
                });
            }

            // Note: Audio support via OpenRouter might vary, usually transcribed first. 
            // For now, we focus on text/image which is the critical path.
            // If audio is critical, we might need a separate transcription flow.

            const payload = {
                model: "anthropic/claude-3.5-sonnet", // Use Claude 3.5 Sonnet
                messages: [
                    {
                        role: "user",
                        content: content
                    }
                ]
            };

            wx.request({
                url: url,
                method: 'POST',
                header: {
                    'Content-Type': 'application/json'
                },
                data: payload,
                success: (res) => {
                    console.log('Proxy API Response:', res);
                    // Check for standard OpenAI-style response
                    if (res.statusCode === 200 && res.data && res.data.choices && res.data.choices.length > 0) {
                        const reply = res.data.choices[0].message.content;
                        resolve(reply);
                    } else {
                        console.error('Proxy API Error:', res);
                        const errorMsg = res.data && res.data.error ? res.data.error.message : 'Unknown Proxy Error';
                        reject(new Error(`${errorMsg} (Status: ${res.statusCode})`));
                    }
                },
                fail: (err) => {
                    console.error('Network Request Failed:', err);
                    reject(new Error(`Network Request Failed: ${err.errMsg}`));
                }
            });
        });
    },


    /**
     * Call Grok API
     * @param {string} prompt - The user prompt
     * @param {string} model - Model name (default: grok-beta)
     * @returns {Promise<string>} - The generated text
     */
    /**
     * Call Grok API -> Redirected to Claude as per user request
     * @param {string} prompt - The user prompt
     */
    callGrok: function(prompt, model) {
        console.log("Redirecting Grok request to Claude (Policy: All APIs use Claude)");
        return this.callClaude(prompt);
    },

    /**
     * Call Claude API
     * @param {string} prompt - The user prompt
     * @param {string} model - Model name (default: configured)
     * @returns {Promise<string>} - The generated text
     */
    callClaude: function(prompt, model = apiConfig.CLAUDE_MODEL, imageBase64 = null) {
        return new Promise((resolve, reject) => {
            if (!apiConfig.PROXY_URL || apiConfig.PROXY_URL.includes("YOUR_ALIYUN_IP")) {
                reject(new Error("Please configure PROXY_URL in config/api.js with your Server IP"));
                return;
            }

            console.log("Calling Claude via Backend Proxy...", apiConfig.PROXY_URL);
            
            let requestData = { model: model };

            if (imageBase64) {
                // Construct Vision Payload (OpenRouter/Claude format)
                requestData.messages = [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: prompt },
                            { 
                              type: "image_url", 
                              image_url: { 
                                url: `data:image/jpeg;base64,${imageBase64}` 
                              } 
                            }
                        ]
                    }
                ];
            } else {
                // Standard Text Payload (Backward Compatible)
                requestData.message = prompt;
            }

            wx.request({
                url: `${apiConfig.PROXY_URL}/proxy/claude`,
                method: 'POST',
                header: {
                    'Content-Type': 'application/json'
                },
                data: requestData,
                success: (res) => {
                    console.log('Proxy Response:', res);
                    // Debug: Log keys to see structure
                    if (res.data) console.log('Response Keys:', Object.keys(res.data));
                    
                    if (res.statusCode === 200 && res.data) {
                        // Standard OpenAI-style
                        if (res.data.choices && res.data.choices.length > 0) {
                             const choice = res.data.choices[0];
                             const msg = choice.message || choice.delta;
                             let content = msg ? msg.content : "";
                             
                             if (Array.isArray(content)) {
                                 content = content.map(c => c.text || '').join('');
                             }
                             
                             // Force resolve if content exists-ish
                             if (content !== undefined && content !== null) {
                                 resolve(String(content));
                                 return;
                             }
                        }
                        
                        // Fallback 1: Direct text (rare)
                        if (typeof res.data === 'string') {
                            resolve(res.data);
                            return;
                        }

                        // Fallback 2: Dump JSON to UI for debugging
                        console.warn("Unexpected JSON structure:", res.data);
                        resolve("DEBUG_DUMP: " + JSON.stringify(res.data));
                        
                    } else {
                        console.error('Proxy API Error:', res);
                        let errorMsg = 'Unknown Error';
                        if (res.data) {
                            if (typeof res.data === 'string') {
                                errorMsg = res.data.length > 100 ? res.data.slice(0, 100) + '...' : res.data;
                            } else if (res.data.error) {
                                if (typeof res.data.error === 'string') {
                                    errorMsg = res.data.error;
                                } else if (res.data.error.message) {
                                    errorMsg = res.data.error.message;
                                } else {
                                    errorMsg = JSON.stringify(res.data.error);
                                }
                            } else {
                                errorMsg = JSON.stringify(res.data);
                            }
                        }
                        reject(new Error(`Proxy Error: ${errorMsg}`));
                    }
                },
                fail: (err) => {
                    console.error('Network Error:', err);
                    // Critical: Reject with highly visible error
                    const errMsg = `NetFail: ${err.errMsg || 'Unknown'} (Status=${err.statusCode || 'N/A'})`;
                    reject(new Error(errMsg));
                }
            });
        });
    }
};

module.exports = LLMService;
