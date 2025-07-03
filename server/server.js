const express  = require('express');
const cors     = require('cors');
const dotenv   = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

// 1️⃣  Create the app FIRST
const app = express();

// 2️⃣  Global middlewares
app.use(express.json());
app.use(cors());

// 3️⃣  Route registrations (now app is defined, so this is safe)
app.use('/api/auth',    require('./routes/authRoutes'));
app.use('/api/focus',   require('./routes/focusRoutes'));
app.use('/api/rewards', require('./routes/rewardRoutes'));
app.use('/api/buddy',   require('./routes/buddyRoutes'));
app.use('/api/journal', require('./routes/journalRoutes'));
app.use('/api/user',    require('./routes/userRoutes'));  // ← the line that crashed
app.use('/api/rewards', require('./routes/rewardRoutes'));


// 4️⃣  DB connection + server start
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
