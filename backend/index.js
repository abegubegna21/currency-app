const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json()); // Allows us to read JSON from the frontend

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 1. API Endpoint to get live rates
app.get('/api/rates', async (req, res) => {
    try {
        const base = (req.query.base || 'USD').toUpperCase();
        const response = await axios.get(`https://open.er-api.com/v6/latest/${base}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching rates:', error.message);
        res.status(500).json({ error: "Failed to fetch rates" });
    }
});

// 2. API Endpoint to save a conversion
app.post('/api/history', async (req, res) => {
    try {
        const { from_currency, to_currency, amount, result } = req.body;
        if (!from_currency || !to_currency || amount == null || result == null) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const query = `INSERT INTO history (from_currency, to_currency, amount, result) VALUES (?, ?, ?, ?)`;
        const [insertResult] = await db.query(query, [from_currency, to_currency, amount, result]);
        res.json({ message: "Saved to database successfully!", id: insertResult.insertId });
    } catch (error) {
        console.error('Error saving history:', error.message);
        res.status(500).json({ error: "Failed to save history" });
    }
});

// 3. API Endpoint to get past conversions
app.get('/api/history', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 50;
        const [rows] = await db.query("SELECT * FROM history ORDER BY created_at DESC LIMIT ?", [limit]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching history:', error.message);
        res.status(500).json({ error: "Failed to fetch history" });
    }
});

// 3b. API Endpoint to delete single history item
app.delete('/api/history/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM history WHERE id = ?", [id]);
        res.json({ message: "History item deleted" });
    } catch (error) {
        console.error('Error deleting history item:', error.message);
        res.status(500).json({ error: "Failed to delete history item" });
    }
});

// 3c. API Endpoint to clear all history
app.delete('/api/history', async (req, res) => {
    try {
        await db.query("DELETE FROM history");
        res.json({ message: "All history cleared" });
    } catch (error) {
        console.error('Error clearing history:', error.message);
        res.status(500).json({ error: "Failed to clear history" });
    }
});

// 4. API Endpoint to save a favorite (checks for duplicates)
app.post('/api/favorites', async (req, res) => {
    try {
        const { from_currency, to_currency } = req.body;
        if (!from_currency || !to_currency) {
            return res.status(400).json({ error: "Both currencies are required" });
        }

        const [existing] = await db.query(
            "SELECT id FROM favorites WHERE from_currency = ? AND to_currency = ? LIMIT 1",
            [from_currency, to_currency]
        );

        if (existing.length > 0) {
            return res.json({ message: "Pair already in favorites", id: existing[0].id, alreadyExists: true });
        }

        const query = `INSERT INTO favorites (from_currency, to_currency) VALUES (?, ?)`;
        const [insertResult] = await db.query(query, [from_currency, to_currency]);
        res.json({ message: "Favorite saved!", id: insertResult.insertId });
    } catch (error) {
        console.error('Error saving favorite:', error.message);
        res.status(500).json({ error: "Failed to save favorite" });
    }
});

// 5. API Endpoint to get favorites
app.get('/api/favorites', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM favorites ORDER BY created_at DESC");
        res.json(rows);
    } catch (error) {
        console.error('Error fetching favorites:', error.message);
        res.status(500).json({ error: "Failed to fetch favorites" });
    }
});

// 5b. API Endpoint to delete a favorite
app.delete('/api/favorites/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM favorites WHERE id = ?", [id]);
        res.json({ message: "Favorite removed" });
    } catch (error) {
        console.error('Error removing favorite:', error.message);
        res.status(500).json({ error: "Failed to remove favorite" });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});