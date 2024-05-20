'use strict'
const http = require('http');
const querystring = require('querystring');
const url = require('url');
const express = require("express");
//const { generateKey } = require('crypto');
//const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const genAPIKey = () => {
  return [...Array(30)]
    .map((e) => ((Math.random() * 36) | 0).toString(36))
    .join('');
};

const apiKey = genAPIKey();

class MyClassificationPipeline {
    static task = 'text2text-generation';
    static model = 'Xenova/LaMini-Flan-T5-783M';
    static instance = null;
  
    static async getInstance(progress_callback = null) {
      if (this.instance === null) {
        let { pipeline, env } = await import('@xenova/transformers');
  
        this.instance = pipeline(this.task, this.model, { progress_callback });
      }
  
      return this.instance;
    }
}
/*
const apiKeyMiddleware = (req, res, next) => {

  if (providedApiKey && providedApiKey === apiKey) {
    next();
  } else {
    res.status(401).json({ error: 'API key non valida' });
  }
  
};
*/

const apiKeyMiddleware = (req, res, next) => {
  
  if (!req.headers['x-api-key']) {
    const newApiKey = genAPIKey();
    req.headers['x-api-key'] = newApiKey;
    next();
  } else {
    const incomingApiKey = req.headers['x-api-key'];
    const validApiKey = apiKey; 

    if (incomingApiKey === validApiKey) {
      next();
    } else {
      res.status(401).json({ error: 'Chiave API non valida' });
    }
  }
};


app.get('/', (req, res) => {
  console.log("Welcome!");
  res.json("Welcome!");
});

app.get('/apikey', (req, res) => {
  res.json(apiKey);
})

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

app.listen(5000, () => {
  console.log(`Server running on http://localhost:5000/`);
});





