// 1. Import modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 2. Initialize express app
const app = express();

// 3. Use middlewares
app.use(express.json());
app.use(cors());

// 4. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Error:', err));

// 5. Define routes
app.use('/api/auth', require('./routes/authRoutes'));

// 6. Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
