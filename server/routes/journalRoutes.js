const express = require('express');
const router  = express.Router();
const requireAuth = require('../middleware/authMiddleware');

const {
  addJournalEntry,
  getJournalEntries,
  updateJournalEntry
} = require('../controllers/journalController');

router.use(requireAuth);                // protect all journal routes

router.post('/',    addJournalEntry);   // POST  /api/journal
router.get('/',     getJournalEntries); // GET   /api/journal
router.patch('/:id', updateJournalEntry); // PATCH /api/journal/:id

module.exports = router;
