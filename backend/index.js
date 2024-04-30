const express = require('express');
const recipeRouter = require("./api/routes/recipeRouter");
const userRouter = require("./api/routes/userRouter");
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDb = require('./config/db');

// Create express server
const app = express();
const PORT = 5000;

// Express configuration
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Connect to database
connectDb();

app.use("/api/recipes", recipeRouter);
app.use("/api/users", userRouter)

// Start express server
app.listen(PORT, () => {
    console.log(`App started at http://localhost:${PORT}`);
});


