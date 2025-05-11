import express from 'express';
const router = express.Router();

router.get('/', (_, res) => {
  res.json({ message: 'TalentDeck backend is up and running 🔥' });
});

export default router;
