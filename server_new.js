const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, HeadingLevel, TextRun } = require('docx');
const PDFDocument = require('pdfkit');

const app = express();
const PORT = 9100;

// Enable CORS and JSON parsing
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Configure Uploads
const upload = multer({ dest: 'uploads/' });

// --- 1. File Parsing Endpoint ---
app.post('/proxy/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = req.file.path;
        const fileType = req.file.mimetype;
        let originalName = req.file.originalname;
        let parsedText = "";

        console.log(`Processing file: ${originalName} (${fileType})`);

        if (fileType === 'application/pdf' || originalName.endsWith('.pdf')) {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdfParse(dataBuffer);
            parsedText = data.text;
        } 
        else if (
            fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
            originalName.endsWith('.docx')
        ) {
            const result = await mammoth.extractRawText({ path: filePath });
            parsedText = result.value;
        } 
        else {
            fs.unlinkSync(filePath);
            return res.status(400).json({ error: 'Unsupported file type. Only PDF and DOCX are supported.' });
        }

        // Clean up temp file
        fs.unlinkSync(filePath);

        res.json({ success: true, text: parsedText });

    } catch (error) {
        console.error('File parsing error:', error);
        res.status(500).json({ error: 'Failed to parse file: ' + error.message });
    }
});

// --- 2. Vision/Image Analysis Endpoint ---
// --- 2. Vision/Image Analysis Endpoint (Proxy) ---
// --- 2. Vision/Image Analysis Endpoint (Proxy) ---
app.post('/proxy/claude', upload.single('image'), async (req, res) => {
    try {
        // Extract fields flexibly to support different client versions
        const { model, stream } = req.body;
        let { messages, prompt, message } = req.body;

        // Hardcoded key for server-side proxy simplicity (matches api.js)
        const CLAUDE_KEY = "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"; 
        
        // 1. Prepare Messages
        // If client sent 'messages' (e.g. vision or chat history), use it.
        // If client sent 'prompt' or 'message' (simple text), wrap it.
        if (!messages) {
            const textContent = prompt || message;
            if (!textContent && !req.file) {
                return res.status(400).json({ error: "Missing 'prompt', 'message', or 'messages' in request body." });
            }
            if (textContent) {
                messages = [{ role: "user", content: textContent }];
            } else {
                 messages = [{ role: "user", content: "Analyze this file." }];
            }
        }

        // 2. Handle File Upload (Multipart) if present
        // This supports clients sending 'file' via formData instead of base64 JSON
        if (req.file) {
            const imageBuffer = fs.readFileSync(req.file.path);
            const base64Image = imageBuffer.toString('base64');
            const mimeType = req.file.mimetype;
            
            // Append visual content to the last user message
            const lastMsg = messages[messages.length - 1];
            if (lastMsg && lastMsg.role === 'user') {
                const existingText = Array.isArray(lastMsg.content) 
                    ? lastMsg.content.find(c => c.type === 'text')?.text || "" 
                    : lastMsg.content;

                lastMsg.content = [
                    { type: "text", text: existingText || "Analyze this image." },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:${mimeType};base64,${base64Image}`
                        }
                    }
                ];
            }
            // Cleanup temp file
            fs.unlinkSync(req.file.path);
        }

        // 3. Construct Payload
        const payload = {
            model: model || "anthropic/claude-3.5-sonnet",
            messages: messages,
            stream: stream || false
        };

        console.log("Proxying request to Claude:", payload.model);
        // console.log("Payload Preview:", JSON.stringify(payload).substring(0, 200) + "...");

        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", payload, {
            headers: {
                "Authorization": `Bearer ${CLAUDE_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://indievolve.com", 
                "X-Title": "Indievolve"
            }
        });

        res.json(response.data);

    } catch (error) {
        // Enhanced Error Logging
        const errorData = error.response ? error.response.data : error.message;
        console.error("Proxy Error:", JSON.stringify(errorData));
        
        res.status(500).json({ 
            error: "Proxy Request Failed", 
            details: errorData 
        });
    }
});

// --- 3. Grok API Endpoint (Proxy) ---
// --- 3. (Grok Endpoint Removed as per request) ---


// --- 4. Export to Word/PDF Endpoint ---
app.post('/proxy/export', async (req, res) => {
    try {
        const { title, content, format } = req.body;
        const downloadDir = path.join(__dirname, 'downloads');
        
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir);
        }

        if (format === 'docx') {
            const docChildren = [];

            // Title
            docChildren.push(new Paragraph({
                text: title,
                heading: HeadingLevel.TITLE,
                alignment: "center"
            }));

            // Content Blocks
            content.forEach(block => {
                if (block.type === 'h1' || block.type === 'h2') {
                    docChildren.push(new Paragraph({
                        text: block.text,
                        heading: HeadingLevel.HEADING_1,
                        spacing: { before: 200, after: 100 }
                    }));
                } else if (block.type === 'p') {
                    docChildren.push(new Paragraph({
                        children: [new TextRun(block.text)],
                        spacing: { after: 100 }
                    }));
                } else if (block.type === 'list') {
                     if (block.items) {
                         block.items.forEach(item => {
                            docChildren.push(new Paragraph({
                                text: "• " + item,
                                indent: { left: 720 }, // 0.5 inch
                            }));
                         });
                     }
                } else if (block.type === 'quote') {
                    docChildren.push(new Paragraph({
                        text: block.text,
                        style: "Quote", 
                        indent: { left: 720 },
                        spacing: { before: 100, after: 100 }
                    }));
                }
            });

            const doc = new Document({
                sections: [{
                    children: docChildren,
                }],
            });

            const b64string = await Packer.toBase64String(doc);
            const buffer = Buffer.from(b64string, 'base64');
            const filePath = path.join(downloadDir, `export_${Date.now()}.docx`);
            fs.writeFileSync(filePath, buffer);

            const downloadUrl = `http://localhost:${PORT}/proxy/download?file=${path.basename(filePath)}`;
            res.json({ success: true, url: downloadUrl });

        } else {
            // PDF extraction removed as per request
            res.status(400).json({ error: "Unsupported format. Only DOCX is supported." });
        }

    } catch (error) {
        console.error("Export Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// --- 4. Download Helper ---
app.get('/proxy/download', (req, res) => {
    const fileName = req.query.file;
    if (!fileName) return res.status(400).send("Missing file param");

    const filePath = path.join(__dirname, 'downloads', fileName);
    if (fs.existsSync(filePath)) {
        res.download(filePath); 
        // Optional: Delete after download (setTimeout)
    } else {
        res.status(404).send("File not found");
    }
});


// --- 5. Health Check Endpoint ---
app.get('/', (req, res) => {
    res.send("<h1>✅ Indievolve Proxy Server is Running!</h1><p>Endpoints are ready.</p>");
});


app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`✅ Server running at: http://localhost:${PORT}`);
    console.log(`   - File Parsing supported`);
    console.log(`   - Vision/Image supported via /proxy/claude`);
    console.log(`   - Export supported via /proxy/export`);
    console.log(`==================================================`);
});
