const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Xpenso API' });
});

// Import Routes
const authRoutes = require('./routes/authRoutes');

// Use Routes
app.use('/api/v1/auth', authRoutes);

// Error Handler
app.use(errorHandler);

module.exports = app;
