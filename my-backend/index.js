const express = require('express');
const prisma = require('./tarot-frontend/lib/prisma');
const app = express();
app.use(express.json());

// Get all cards using JavaScript instead of SELECT *
app.get('/cards', async (req, res) => {
  const cards = await prisma.tarotCard.findMany();
  res.json(cards);
});

// Add a new card using JavaScript instead of INSERT INTO
app.post('/cards', async (req, res) => {
  const newCard = await prisma.tarotCard.create({
    data: req.body
  });
  res.json(newCard);
});

app.listen(3000, () => console.log("Server running on port 3000"));