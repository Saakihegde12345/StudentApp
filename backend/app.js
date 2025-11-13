// Load environment variables from a .env file located next to this file
// so the backend picks them up even when started from the repo root.
const path = require('path');
const dotenv = require('dotenv');

// Try loading backend/.env first (next to this file), then fall back to the
// repository root `.env` so developers who put env at project root are covered.
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// Non-sensitive debug: indicate whether the Supabase service role key is present
// (do not log the key itself).
// eslint-disable-next-line no-console
console.log('SUPABASE_SERVICE_ROLE_KEY configured:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const studentRoutes = require("./routes/routes")

// Simple health-check endpoint
app.get('/health', (req, res) => {
    const stateMap = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
        99: 'uninitialized'
    };
    const dbState = stateMap[mongoose.connection.readyState] || 'unknown';
    const healthy = mongoose.connection.readyState === 1;
    res.status(healthy ? 200 : 503).json({ status: healthy ? 'ok' : 'unavailable', db: { state: dbState } });
});

//Use the Routes
app.use('/api/students', studentRoutes);
app.get('/', (req,res) => {
    res.send("Welcome to Student API");
})

// Use environment variable MONGODB_URI if provided, otherwise fallback to local DB
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/studentdb";

mongoose.connect(mongoUri)
.then(() => {
    console.log("DB Connected Successfully");
    app.listen(PORT, function check(error){
        if(!error){
            console.log("Server Running Successfully on port: ",PORT);
        }
        else{
            console.error("An Error Occured While Starting The Server: ", error);
        }
    });
})
.catch(function(error){
    console.error("DB Connection Failed: ", error);
    process.exit(1);
})

module.exports = app;