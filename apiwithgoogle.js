
//AIzaSyComwe2gy27ahLSPx2wo4PxOwFDH5hxD3w
'use strict'
const http = require('http');
const querystring = require('querystring');
const url = require('url');
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = ''

const genAI = new GoogleGenerativeAI(apiKey);

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    console.log("Welcome!");
    res.json("Welcome!");
});


/*
async function run() {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  
    const prompt = "Write a story about a magic backpack."
  
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
  }



app.post('/generatetext', apiKeyMiddleware, async (req, res) => {

    req.headers['x-api-key'] = apiKey;

    res.setHeader('Content-Type', 'application/json');
    const generator = await MyClassificationPipeline.getInstance();

    const prompt = req.body.prompt;
    if (!prompt) {
        return res.status(400).json({ error: 'Missing prompt' });
    }
    //Data length validation
    if (prompt.length >= 70 || prompt.length <=10) {
        return res.status(400).json({ error: 'Description is not correct...' });
    }
    //Regular expression for 
    if(!/^[a-zA-Z0-9\s]+$/.test(prompt)){
        return res.status(400).json({ error: '' });
    }
    //Input sanitization whitelisting
    const sanitizedPrompt = prompt.replace(/[^\w\s]/g, ''); 
    if (sanitizedPrompt !== prompt) {
        return res.status(400).json({ error: 'Invalid characters in prompt' });
    }

    const possibleoutput1 = await generator('Describe ' + `${prompt}`, {
        max_new_tokens: 100,
    });

    const possibleoutput2 = await generator('Elaborate on ' + `${prompt}`, {
        max_new_tokens: 120,
    });



    //res.end(JSON.stringify(response1));
    res.json({ possibleoutput1, possibleoutput2 });  
});
*/

app.post('/generatetext', async (req, res) => {
    req.headers['x-api-key'] = apiKey;

    res.setHeader('Content-Type', 'application/json');

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = req.body.prompt;
        if (!prompt) {
            return res.status(400).json({ error: 'Missing prompt' });
        }
        if (prompt.length >= 70 || prompt.length <= 10) {
            return res.status(400).json({ error: 'Description is not correct...' });
        }
        if (!/^[a-zA-Z0-9\s]+$/.test(prompt)) {
            return res.status(400).json({ error: 'Invalid characters in prompt' });
        }
        const sanitizedPrompt = prompt.replace(/[^\w\s]/g, '');
        if (sanitizedPrompt !== prompt) {
            return res.status(400).json({ error: 'Invalid characters in prompt' });
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        res.json({ generatedText: text });
    } catch (error) {
        console.error("Error generating text:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.listen(5000, () => {
    console.log(`Server running on http://localhost:5000/`);
});

