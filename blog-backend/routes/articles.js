const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const openai = require('../config/openai-config');
const axios = require('axios');

// Create Article
router.post('/', async (req, res) => {
  const { title, content, author } = req.body;

  try {
    // Check for plagiarism
    const plagiarismResponse = await axios.post('https://api.quetext.com/v1/plagiarism', {
      text: content,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.PLAGIARISM_API_KEY}`,
      },
    });

    console.log('Plagiarism API Response:', plagiarismResponse.data); // Log the response

    const plagiarismScore = plagiarismResponse.data.score;

    if (plagiarismScore > 10) { // Allow up to 10% plagiarism
      return res.status(400).json({ error: 'Plagiarism detected. Please rewrite the content.' });
    }

    // Generate article suggestions
    const suggestionsResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: `Generate 3 article suggestions based on the title: "${title}". Each suggestion should be concise and relevant to the title.` },
      ],
      max_tokens: 100,
    });

    const suggestions = suggestionsResponse.choices[0].message.content.trim();

    // Save the article
    const article = new Article({ title, content, author });
    await article.save();

    res.status(201).json({ article, suggestions });
  } catch (error) {
    console.error('Error:', error.message); // Log the error
    res.status(500).json({ error: error.message });
  }
});

// Get All Articles
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find().populate('author', 'name');
    res.json(articles);
  } catch (error) {
    console.error('Error:', error.message); // Log the error
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;