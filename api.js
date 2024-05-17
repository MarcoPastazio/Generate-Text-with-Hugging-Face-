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
    return res.status(400).json({ error: 'Prompt mancante nel corpo della richiesta' });
  }
  if (prompt.length >= 50) {
    return res.status(400).json({ error: 'Il prompt deve essere meno lungo di 50 caratteri' });
  }
  if(!/^[a-zA-Z0-9\s]+$/.test(prompt)){
    return res.status(400).json({ error: 'Il prompt deve contenere solo caratteri alfanumerici' });
  }

  const response = await generator('Describe ' + `${prompt}`, {
    max_new_tokens: 100,
  });
  res.end(JSON.stringify(response));
  
});

app.listen(5000, () => {
  console.log(`Server running on http://localhost:5000/`);
});


//utilizzo con API KEY * FATTO * -> Automatizzalo
//input me lo devono passare oppure di default lo metto io per fare le prove * FATTO *
//sanificazione dell'input * FATTO *
