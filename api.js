const querystring = require('querystring');
const url = require('url');
const express = require("express");

const app = express();
app.use(express.json());

class MyClassificationPipeline {
    static task = 'text2text-generation';
    static model = 'Xenova/LaMini-Flan-T5-783M';
    static instance = null;
  
    static async getInstance(progress_callback = null) {
      if (this.instance === null) {
        // Dynamically import the Transformers.js library
        let { pipeline, env } = await import('@xenova/transformers');
  
        // NOTE: Uncomment this to change the cache directory
        // env.cacheDir = './.cache';
  
        this.instance = pipeline(this.task, this.model, { progress_callback });
      }
  
      return this.instance;
    }
}
/*
const server = http.createServer();
const hostname = '127.0.0.1';
const port = 3000;
*/
app.get('/', async (req, res) => {
  
    res.setHeader('Content-Type', 'application/json');

    const classificationPipeline = await MyClassificationPipeline.getInstance();
    
    const response = await classificationPipeline('Describe a trip in rome', {
      max_new_tokens: 100,
    });
  
    res.end(JSON.stringify(response));
});

app.listen(5000, () => {
  console.log(`Server running on http://localhost:5000/`);
});
